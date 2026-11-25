import styles from "./mypapers-app-store.module.css";

export function MypapersAppStore() {
  return (
    <div className={styles.promo}>
      <p>Également sur iPhone.<br /><span>Votre espace web, avec le même compte.</span></p>
      <a href="https://apps.apple.com/ch/app/mypapers/id6836844314?l=fr-FR" target="_blank" rel="noopener noreferrer"
        className={styles.badge} aria-label="Télécharger Mypapers sur l’App Store suisse (nouvel onglet)">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marketing/app-store-fr.svg" alt="Télécharger dans l’App Store" width={127} height={40} />
      </a>
      <span className={styles.availability}>Disponible en Suisse.</span>
    </div>
  );
}
