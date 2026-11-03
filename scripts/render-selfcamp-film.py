"""Render Webbing's shorter Selfcamp film from the supplied Selfkey project.

Requires Pillow, ffmpeg, and --source-dir pointing to the original film folder
(render*.py and real-*.png). That source project is read only. Earlier supplied
and locally rendered exports remain intact. No live application, booking or
payment is accessed.
"""

import argparse
import importlib
import json
from functools import lru_cache
from pathlib import Path
import subprocess
import sys

from PIL import Image, ImageDraw

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--source-dir", type=Path, required=True)
parser.add_argument("--output-dir", type=Path, required=True)
parser.add_argument("--format", choices=["desktop", "mobile"], required=True)
parser.add_argument("--preview", action="store_true")
args = parser.parse_args()
sys.dont_write_bytecode = True
sys.path.insert(0, str(args.source_dir.resolve()))
c = importlib.import_module("render")
v = importlib.import_module("render_v2")
r = importlib.import_module("render_v3")
f = importlib.import_module("render_v4")
m = importlib.import_module("render_mobile")

FPS = 60
DURATIONS = [2, 3.3, 3.5, 2.8, 3.5, 4.1, 4.6, 6.8, 3.8, 2.4]
DURATION = sum(DURATIONS)
HALF = 0.28
PHRASE_LEAD = 0.20
PAGE_TRANSITION = 0.50
CLIENT_ENTRY = PHRASE_LEAD + PAGE_TRANSITION
PHRASE_EXIT = 0.14
# Keep the source palette and faces. Darker supporting text survives the smaller
# portfolio preview; source screenshots and demonstration data are unchanged.
MUTED = "#626a5b"
for module in [c, v, r, f, m]:
    module.MUTED = MUTED

# Use the supplied Selfcamp mark and replace every authored brand label before
# rasterization. Rebuild cached branded pieces too; never paint over the film.
logo = Image.open(Path(__file__).resolve().parents[1] / "public/logo_app/logo_selfcamp.png").convert("RGBA")
mark = logo.crop((0, 0, logo.width, round(logo.height * 0.6)))
c.LOGO = mark.crop(mark.getbbox())
c.LOGO.thumbnail((76, 76), Image.Resampling.LANCZOS)
source_text = c.text
DRAWN_LABELS = set()


def brand_text(im, xy, label, *params, **kwargs):
    label = str(label).replace("SelfCamp", "Selfcamp").replace("Selfkey", "Selfcamp").replace("selfkey.ch", "selfcamp.ch")
    DRAWN_LABELS.add(label)
    return source_text(im, xy, label, *params, **kwargs)


c.text = brand_text
v.BASE = Image.new("RGBA", (1920, 1080), v.BG)
m.BASE = Image.new("RGBA", (720, 960), v.BG)
f.SOURCE = f.source_card()
v.POSTER = c.panel(340, 322)
v.POSTER.alpha_composite(c.LOGO.resize((26, 26), Image.Resampling.LANCZOS), (24, 23))
c.text(v.POSTER, (63, 22), "Selfcamp", 24, v.GREEN, True)
v.POSTER.alpha_composite(c.QR.resize((215, 215), Image.Resampling.LANCZOS), (62, 77))
v.WINDOW = c.panel(1460, 648)
v.rr(v.WINDOW, (1, 1, 1458, 48), 24, "#f2f4ee", None)
c.text(v.WINDOW, (730, 26), "Selfcamp · Tableau de bord", 23, MUTED, anchor="mm")
v.WINDOW.alpha_composite(v.CROP, (10, 49))
window_mask = Image.new("L", v.WINDOW.size)
ImageDraw.Draw(window_mask).rounded_rectangle((0, 0, 1459, 647), 24, fill=255)
v.WINDOW.putalpha(window_mask)


PHRASES = [
    "Le séjour commence.", "Un simple scan.", "Vos dates. Vos envies.",
    "Votre place vous attend.", "Quelques informations.",
    "Réglez votre séjour.", "Bienvenue sur place.",
    "La suite est automatique.", "Tout est à jour.",
]


def phrase(im, label, t, mobile=False, centered=False):
    """One phrase, revealed as a group from below, then completely still."""
    size = 51 if mobile else 76 if centered else 86
    width = 660 if mobile else 1450 if centered else 790
    line_breaks = {"Vos dates. Vos envies.": ["Vos dates.", "Vos envies."],
                   "Votre place vous attend.": ["Votre place", "vous attend."],
                   "Bienvenue sur place.": ["Bienvenue", "sur place."]}
    lines, line = [], ""
    if not mobile and not centered and label in line_breaks:
        lines = line_breaks[label]
    else:
        for word in label.split():
            candidate = f"{line} {word}".strip()
            if line and c.font(size, True).getlength(candidate) > width:
                lines.append(line)
                line = word
            else:
                line = candidate
        lines.append(line)
    leading = round(size * 1.12)
    height = leading * len(lines) + 8
    layer = Image.new("RGBA", (width, height))
    for i, line in enumerate(lines):
        c.text(layer, (width / 2 if mobile or centered else 0, i * leading),
               line, size, v.GREEN, True, anchor="mt" if mobile or centered else "lt")
    p = v.clamp(t / 0.34)
    offset = round((24 if mobile else 34) * (1 - p) ** 4)
    reveal = Image.new("RGBA", layer.size)
    reveal.alpha_composite(v.opacity(layer, v.clamp(t / 0.12)), (0, offset))
    x = round((im.width - width) / 2) if mobile or centered else v.TEXT_X
    y = 93 if mobile else 167 if centered else round(520 - height / 2)
    im.alpha_composite(reveal, (x, y))


def common(title, lines, t, step):
    return v.base()


def caption(im, label, t, start=1.0):
    pass


def mobile_head(title, subtitle):
    return m.BASE.copy()


def arrival(t):
    im = v.base()
    r.phone(im, r.crop("dates"))
    return im


def scan(t):
    im = v.base()
    page = Image.new("RGBA", (r.SW, r.SH), "#f9fafb")
    c.text(page, (r.SW / 2, 83), "Bienvenue sur place.", 29, v.INK, True, anchor="mm")
    page.alpha_composite(c.QR.resize((310, 310), Image.Resampling.LANCZOS), (77, 170))
    for x, y, dx, dy in [(59, 151, 1, 1), (405, 151, -1, 1), (59, 499, 1, -1), (405, 499, -1, -1)]:
        c.line(page, [(x, y + dy * 25), (x, y), (x + dx * 25, y)], v.GREEN, 4)
    if t < 2.35:
        yy = v.mix(184, 464, v.ease((t - 0.3) / 1.75))
        c.line(page, [(76, yy), (388, yy)], "#96ad80", 3)
    else:
        v.check(page, 232, 325, (t - 2.35) / 0.5, 39)
    v.layer_text(page, (r.SW / 2, 567), "Ouvrir la réservation", 25, v.GREEN,
                 anchor="mm", a=v.out((t - 2.4) / 0.5))
    r.phone(im, page)
    return im


def delivery(t):
    im = v.base()
    v.place(im, f.SOURCE, 200, 493, shadow=True)
    for points, (start, end) in zip(f.PATHS, f.TIMES):
        f.flight(im, points, t, start, end)
    f.destination(im, 340, "Check-in FR", "Déclarations de taxe de séjour", "declaration", t, 2.95)
    f.destination(im, 652, "Votre client", "Sa carte d’hôte", "guest", t, 5.45)
    return im


def operator(t):
    im = v.base()
    yy = 341 + 18 * (1 - v.out((t + 0.1) / 1))
    v.place(im, v.WINDOW, 230, yy, shadow=True)
    alpha = v.out((t - 0.7) / 0.6)
    v.place(im, v.NOTICE, 1185, 792 + 24 * (1 - alpha), a=alpha, shadow=True)
    return im


def closing(t, mobile=False):
    size = (720, 960) if mobile else (1920, 1080)
    im = Image.new("RGBA", size, v.BG)
    layer = Image.new("RGBA", size)
    mark_size, gap, font_size = (65, 24, 62) if mobile else (84, 28, 75)
    word_width = c.font(font_size, True).getlength("Selfcamp")
    x = round((size[0] - mark_size - gap - word_width) / 2)
    y = 275 if mobile else 300
    layer.alpha_composite(c.LOGO.resize((mark_size, mark_size), Image.Resampling.LANCZOS), (x, y))
    c.text(layer, (x + mark_size + gap, y - 1), "Selfcamp", font_size, v.GREEN, True)
    shift = round(28 * (1 - v.clamp(t / 0.34)) ** 4)
    c.text(layer, (size[0] / 2, (520 if mobile else 600) + shift),
           "Profitez du séjour.", 45 if mobile else 68, v.GREEN, True, anchor="mm")
    im.alpha_composite(v.opacity(layer, v.out((t + 0.2) / 1)), (0, 0))
    v.layer_text(im, (size[0] / 2, 742 if mobile else 838), "selfcamp.ch", 30, MUTED,
                 anchor="mm", a=v.out((t - 0.5) / 0.8))
    return im


r.common = common
r.caption = caption
m.head = mobile_head
m.progress = lambda im, active: None
# Function objects are already stored in the imported timelines. Replace their
# closing callbacks explicitly so the centered Selfcamp lockup is used there.
mobile = args.format == "mobile"
W, H = (720, 960) if mobile else (1920, 1080)
BLANK = m.BASE if mobile else v.BASE
SOURCE_SCENES = [scene for scene in (m.SCENES if mobile else f.SCENES)
                 if scene[2].__name__ != "summary"]
SCENES = []
cursor = 0.0
for (old_start, old_end, fn), duration in zip(SOURCE_SCENES, DURATIONS):
    if not mobile:
        fn = {"arrival": arrival, "scan": scan, "delivery": delivery, "operator": operator}.get(fn.__name__, fn)
    if fn.__name__ == "closing":
        fn = lambda t: closing(t, mobile)
        fn.__name__ = "closing"
    SCENES.append((cursor, cursor + duration, fn, old_end - old_start))
    cursor += duration
LAST_CLIENT = next(i for i, scene in enumerate(SCENES) if scene[2].__name__ == "access")


def media(index, local_time):
    """The product runs after the phrase; its source actions still finish."""
    start, end, fn, original_duration = SCENES[index]
    local = max(0, min(end - start, local_time))
    delay = CLIENT_ENTRY if 1 <= index <= LAST_CLIENT else PHRASE_LEAD
    progress = v.clamp((local - delay) / (end - start - delay))
    if index == 4:
        # Keep the contact fields and a short move to the following fields.
        # The discarded tail of the long source scroll adds no new action.
        action = max(0, local - delay)
        pan = v.ease((action - 0.55) / 0.9)
        image = BLANK.copy()
        if mobile:
            m.page(image, "details", v.mix(1020, 1800, pan))
        else:
            r.phone(image, r.crop("details", v.mix(430, 1000, pan)))
        return image
    return fn(progress * original_duration)


@lru_cache(maxsize=24)
def held_media(index, at_end):
    start, end, _, _ = SCENES[index]
    return media(index, end - start if at_end else 0)


def page_transition(old, new, phase):
    """A continuous device; only its page changes after the 200ms text lead."""
    p = v.ease(phase)
    if mobile:
        x, y, w, h = m.PAGE_X, m.PAGE_Y, m.PAGE_W, m.PAGE_H
    else:
        x, y = r.PX + r.SCREEN_X, r.PY + r.SCREEN_Y
        w, h = r.SW, r.SH
    box = (x, y, x + w, y + h)
    page = Image.new("RGBA", (w, h), "#f9fafb")
    page.alpha_composite(old.crop(box), (0, -round(h * p)))
    page.alpha_composite(new.crop(box), (0, round(h * (1 - p))))
    image = BLANK.copy()
    if mobile:
        # Retain the real site's address above the moving portrait viewport.
        image = new.copy()
        image.alpha_composite(page, (x, y))
    else:
        r.phone(image, page)
    return image


def raw(index, local_time):
    start, end, _, _ = SCENES[index]
    local = max(0, min(end - start, local_time))
    if 1 <= index <= LAST_CLIENT and local < CLIENT_ENTRY:
        old = held_media(index - 1, True)
        image = (old.copy() if local <= PHRASE_LEAD else
                 page_transition(old, held_media(index, False),
                                 (local - PHRASE_LEAD) / PAGE_TRANSITION))
    else:
        image = media(index, local)
    if index < len(PHRASES):
        text_layer = Image.new("RGBA", image.size)
        phrase(text_layer, PHRASES[index], local, mobile, index > LAST_CLIENT)
        # Clear the outgoing phrase first, so the next enters on its own.
        fade = v.clamp((end - start - local) / PHRASE_EXIT)
        image.alpha_composite(v.opacity(text_layer, fade))
    return image


def transition(before, after, t, phase):
    p = v.ease(phase)
    old = raw(before, t - SCENES[before][0])
    new = raw(after, 0 if after == 0 else t - SCENES[after][0])
    im = (Image.blend(old, BLANK, v.ease(p * 2)) if p < 0.5
          else Image.blend(BLANK, new, v.ease((p - 0.5) * 2)))
    return im


def frame(t):
    t %= DURATION
    image = None
    for i, (start, end, _, _) in enumerate(SCENES):
        if i > LAST_CLIENT and abs(t - start) < HALF:
            image = transition(i - 1, i, t, (t - start + HALF) / (2 * HALF))
            break
        if start <= t < end:
            if LAST_CLIENT <= i < len(SCENES) - 1 and t > end - HALF:
                image = transition(i, i + 1, t, (t - end + HALF) / (2 * HALF))
            elif i == len(SCENES) - 1 and t > DURATION - HALF:
                image = transition(i, 0, t, (t - DURATION + HALF) / HALF)
            else:
                image = raw(i, t - start)
            break
    if not mobile:
        # A uniform 16:9 reframe keeps the complete phone and all workflow cards.
        image = image.crop((100, 60, 1820, 1028)).resize((W, H), Image.Resampling.LANCZOS)
    return image.convert("RGB")


args.output_dir.mkdir(parents=True, exist_ok=True)
name = "selfcamp-client-journey" + ("-mobile" if mobile else "") + "-v11"
if args.preview:
    thumb = (270, 360) if mobile else (640, 360)
    cols = 4 if mobile else 3
    rows = (len(SCENES) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb[0], rows * (thumb[1] + 32)), v.BG)
    for i, (start, end, fn, _) in enumerate(SCENES):
        t = start + (end - start) * 0.62
        image = frame(t)
        image.save(args.output_dir / f"{name}-scene-{i + 1}.jpg", quality=94)
        x, y = i % cols * thumb[0], i // cols * (thumb[1] + 32)
        sheet.paste(image.resize(thumb, Image.Resampling.LANCZOS), (x, y))
        ImageDraw.Draw(sheet).text((x + 10, y + thumb[1] + 4),
                                  f"{t:.1f}s {fn.__name__}", font=c.font(18), fill=v.INK)
    sheet.save(args.output_dir / f"{name}-storyboard.jpg", quality=94)
    print("Preview ready:", name, flush=True)
else:
    target = args.output_dir / f"{name}.mp4"
    command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo",
               "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an",
               "-c:v", "libx264", "-preset", "medium", "-crf", "19" if mobile else "18",
               "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(target)]
    proc = subprocess.Popen(command, stdin=subprocess.PIPE)
    try:
        for n in range(round(FPS * DURATION)):
            proc.stdin.write(frame(n / FPS).tobytes())
            if n % (FPS * 5) == 0:
                print(f"{args.format}: {n // FPS}/{DURATION:g}s", flush=True)
    finally:
        proc.stdin.close()
    if proc.wait() != 0:
        raise RuntimeError("Encoding failed")
    frame(1.2).save(args.output_dir / f"{name}-poster.jpg", quality=94)
    metadata = {"version": "v11", "brand": "Selfcamp", "duration": DURATION, "fps": FPS, "size": [W, H],
                "phraseArrivalSeconds": 0.34, "phrases": PHRASES,
                "phraseLeadSeconds": PHRASE_LEAD, "pageTransitionSeconds": PAGE_TRANSITION,
                "formScrollSeconds": 0.9,
                "scenes": [{"start": s, "end": e, "name": fn.__name__}
                           for s, e, fn, _ in SCENES], "sourceFilesModified": False,
                "authoredLabels": sorted(DRAWN_LABELS)}
    (args.output_dir / f"{name}.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(target, flush=True)
