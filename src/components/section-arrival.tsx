"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function SectionArrival({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (!ref.current || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setArrived(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={className} data-section-arrived={arrived}>{children}</div>;
}
