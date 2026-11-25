import Image from "next/image";
import { ProjectLink } from "@/components/project-link";
import styles from "./mypapers-app-store.module.css";

export function AppStoreBadge({ app }: { app: "mypapers" | "openwind" }) {
  const name = app === "mypapers" ? "Mypapers" : "OpenWind";
  const href = app === "mypapers"
    ? "https://apps.apple.com/ch/app/mypapers/id6836844314?l=fr-FR"
    : "https://apps.apple.com/app/id6831617323?l=fr-FR";
  return <ProjectLink href={href} name={name} category={app === "mypapers" ? "Application iPhone" : "Application iPhone et iPad"} application
    className={styles.badge} ariaLabel={`Télécharger ${name} sur l’App Store${app === "mypapers" ? " suisse" : ""} (nouvel onglet)`} showArrow={false}>
    <Image src="/marketing/app-store-fr.svg" alt="Télécharger dans l’App Store" width={127} height={40} unoptimized />
  </ProjectLink>;
}

export function MypapersAppStore() {
  return (
    <div className={styles.promo}>
      <p>Également sur iPhone.<br /><span>Votre espace web, avec le même compte.</span></p>
      <AppStoreBadge app="mypapers" />
      <span className={styles.availability}>Disponible en Suisse.</span>
    </div>
  );
}
