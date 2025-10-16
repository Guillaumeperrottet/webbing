"use client";

import Image from "next/image";

interface WaveSeparatorProps {
  className?: string;
  /** Couleur de la vague (couleur de fond de la section suivante) */
  fillColor?: string;
  /** Source de l'image de fond */
  imageSrc?: string;
  /** Texte alternatif de l'image */
  imageAlt?: string;
  /** Hauteur de l'image en pixels */
  imageHeight?: number;
}

/**
 * Composant WaveSeparator - Crée un effet de vague responsive
 *
 * Technique utilisée :
 * 1. Image en w-full avec object-cover
 * 2. SVG en position absolute au-dessus de l'image
 * 3. viewBox SVG pour le responsive
 * 4. Ajustement du bottom selon la taille d'écran (compensant la hauteur du SVG)
 */
export function WaveSeparator({
  className = "",
  fillColor = "hsl(var(--background))", // Utilise la couleur de fond du thème
  imageSrc = "/hero-image.jpg",
  imageAlt = "hero",
  imageHeight = 600,
}: WaveSeparatorProps) {
  return (
    <div className={`hero_image relative w-full overflow-hidden ${className}`}>
      {/* Image de fond - prend toute la largeur avec hauteur responsive */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={1440}
        height={imageHeight}
        className="w-full h-[350px] sm:h-[420px] md:h-[520px] lg:h-[600px] object-cover object-bottom"
        priority
      />

      {/* SVG de la vague - positionné au-dessus de l'image */}
      {/* Le viewBox définit un système de coordonnées virtuel de 1440x390 */}
      {/* Le SVG s'adapte automatiquement à la largeur grâce à w-full */}
      {/* Ajustement responsive du positionnement bottom pour toutes les tailles d'écran */}
      <svg
        viewBox="0 0 1440 390"
        className="absolute bottom-[-1px] sm:bottom-[-8px] md:bottom-[-12px] lg:bottom-[-30px] xl:bottom-[-50px] left-0 w-full"
        preserveAspectRatio="none"
        style={{ height: "auto" }}
      >
        <path
          d="M 0,400 L 0,150 C 122.26666666666671,136.39999999999998 244.53333333333342,122.79999999999998 404,136 C 563.4666666666666,149.20000000000002 760.1333333333332,189.2 939,196 C 1117.8666666666668,202.8 1278.9333333333334,176.4 1440,150 L 1440,400 L 0,400 Z"
          fill={fillColor}
          fillOpacity="1"
          className="transition-all duration-300 ease-in-out delay-150"
        />
      </svg>
    </div>
  );
}
