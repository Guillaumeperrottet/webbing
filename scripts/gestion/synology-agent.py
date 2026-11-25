#!/usr/bin/env python3
"""Rapporte uniquement les métadonnées des sauvegardes, sans envoyer leurs fichiers."""
import argparse
import datetime
import fnmatch
import json
import os
import pathlib
import ssl
import sys
import urllib.request


def iso(timestamp):
    return datetime.datetime.fromtimestamp(timestamp, datetime.timezone.utc).isoformat().replace("+00:00", "Z")


def inspect_backup(source):
    root = pathlib.Path(source["directory"])
    result = {"application": source["application"], "state": "absent", "backupAt": None, "bytes": None, "maxAgeHours": source.get("maxAgeHours", 24)}
    if not root.is_absolute() or not root.is_dir():
        return result
    if source.get("lastSuccess"):
        try:
            success = json.loads(pathlib.Path(source["lastSuccess"]).read_text())
            archive = pathlib.Path(success["archive"])
            if root.resolve() not in archive.resolve().parents:
                raise ValueError("Archive hors du dossier autorisé")
            stat = archive.stat()
            if success.get("status") != "ok" or success.get("project") != source.get("expectedProject") or stat.st_size != success.get("bytes") or stat.st_size == 0:
                raise ValueError("Rapport incohérent")
            created = datetime.datetime.fromisoformat(success["created_at"].replace("Z", "+00:00"))
            result.update(state="ok", backupAt=iso(created.timestamp()), bytes=stat.st_size)
        except (OSError, ValueError, KeyError):
            result["state"] = "erreur"
        return result
    patterns = source.get("patterns", ["*.dump", "*.sql", "*.sql.gz", "*.backup", "*.tar.gz", "*.age"])
    newest = None
    try:
        for base, dirs, files in os.walk(root, followlinks=False):
            dirs[:] = [d for d in dirs if not d.startswith(".") and not pathlib.Path(base, d).is_symlink()]
            for name in files:
                file = pathlib.Path(base, name)
                if file.is_symlink() or not any(fnmatch.fnmatch(name, pattern) for pattern in patterns):
                    continue
                stat = file.stat()
                if stat.st_size > 0 and (newest is None or stat.st_mtime > newest.st_mtime):
                    newest = stat
        if newest:
            result.update(state="ok", backupAt=iso(newest.st_mtime), bytes=newest.st_size)
    except OSError:
        result["state"] = "erreur"
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    config_path = pathlib.Path(args.config)
    if config_path.stat().st_mode & 0o077:
        raise ValueError("Le fichier de configuration doit être privé : chmod 600.")
    config = json.loads(config_path.read_text())
    if config["endpoint"] != "https://www.webbing.ch/api/gestion/collecte":
        raise ValueError("Destination de collecte invalide.")
    report = {"backups": [inspect_backup(source) for source in config["backups"]]}
    if args.dry_run:
        print(json.dumps(report, ensure_ascii=False))
        return
    request = urllib.request.Request(config["endpoint"], data=json.dumps(report).encode(), headers={"Content-Type": "application/json", "Authorization": "Bearer " + config["token"]}, method="POST")
    with urllib.request.urlopen(request, timeout=30, context=ssl.create_default_context()) as response:
        print("Rapport de sauvegardes transmis :", response.status)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("Échec de la collecte :", type(error).__name__, file=sys.stderr)
        sys.exit(1)
