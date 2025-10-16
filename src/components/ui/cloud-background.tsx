"use client";

import { useEffect, useRef } from "react";

export function CloudBackground() {
  const cloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cloudsRef.current) {
        const scrollY = window.scrollY;
        // Les nuages montent plus lentement que le scroll (effet parallaxe)
        cloudsRef.current.style.transform = `translateY(-${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      <div ref={cloudsRef} className="absolute inset-0">
        {/* Nuages SVG - positionnés aléatoirement */}
        <svg
          className="absolute top-[15%] left-[8%] w-28 h-18"
          viewBox="0 0 200 120"
          fill="currentColor"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ellipse cx="60" cy="70" rx="50" ry="30" />
          <ellipse cx="100" cy="60" rx="60" ry="35" />
          <ellipse cx="140" cy="70" rx="45" ry="28" />
        </svg>

        <svg
          className="absolute top-[35%] right-[12%] w-32 h-20"
          viewBox="0 0 200 120"
          fill="currentColor"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ellipse cx="50" cy="70" rx="45" ry="28" />
          <ellipse cx="95" cy="55" rx="55" ry="32" />
          <ellipse cx="135" cy="65" rx="50" ry="30" />
        </svg>

        <svg
          className="absolute top-[60%] left-[15%] w-30 h-20"
          viewBox="0 0 200 120"
          fill="currentColor"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ellipse cx="70" cy="65" rx="48" ry="30" />
          <ellipse cx="110" cy="70" rx="52" ry="32" />
          <ellipse cx="150" cy="68" rx="42" ry="26" />
        </svg>

        <svg
          className="absolute top-[85%] right-[18%] w-34 h-22"
          viewBox="0 0 200 120"
          fill="currentColor"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <ellipse cx="58" cy="70" rx="50" ry="30" />
          <ellipse cx="108" cy="62" rx="62" ry="37" />
          <ellipse cx="152" cy="71" rx="46" ry="28" />
        </svg>
      </div>
    </div>
  );
}
