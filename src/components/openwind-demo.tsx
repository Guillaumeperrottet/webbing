"use client";

import Image from "next/image";
import { BookOpen, Github } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence, type MotionFrame, useDemoMotion } from "@/components/use-demo-motion";

const DURATION = 20400;
const scenes = [
  { id: "observe", title: "Le vent maintenant.", file: "observations", start: 0, end: 5200, desktop: [937, 811], mobile: [343, 391] },
  { id: "forecast", title: "Et pour la suite ?", file: "forecast", start: 5200, end: 10400, desktop: [937, 549], mobile: [343, 561] },
  { id: "read", title: "Comprendre les conditions.", file: "article", start: 10400, end: 16800, desktop: [896, 976], mobile: [335, 895] },
] as const;

// Genuine dated captures: observation and model forecasts stay clearly distinct.
const visibleBetween = (start: number, end: number): MotionFrame[] => start === 0 ? [
  { opacity: 1, offset: 0 },
  { opacity: 1, offset: (end - 320) / DURATION },
  { opacity: 0, offset: end / DURATION },
  { opacity: 0, offset: (DURATION - 320) / DURATION },
  { opacity: 1, offset: 1 },
] : [
  { opacity: 0, offset: 0 },
  { opacity: 0, offset: start / DURATION },
  { opacity: 1, offset: (start + 320) / DURATION },
  { opacity: 1, offset: (end - 320) / DURATION },
  { opacity: 0, offset: end / DURATION },
  { opacity: 0, offset: 1 },
];

const panels = [...scenes, { id: "open", start: 16800, end: DURATION - 320 }];
const camera = (selector: string, begin: number, end: number, initial: string, focused: string) => ({ selector, frames: [
  { transform: initial, offset: 0 },
  { transform: initial, offset: begin / DURATION, curve: "soft" },
  { transform: focused, offset: end / DURATION },
  { transform: focused, offset: 0.9 },
  { transform: initial, offset: 0.96 },
  { transform: initial, offset: 1 },
] as MotionFrame[] });

const sequence: DemoSequence = [
  ...panels.flatMap(({ id, start, end }) => [
    { selector: `.openwind-frame--${id}`, frames: visibleBetween(start, end) },
    { selector: `.openwind-frame--${id} .openwind-story-title`, frames: visibleBetween(start, end).map((frame) => ({ ...frame, transform: frame.opacity === 1 ? "translateY(0)" : "translateY(14px)" })) },
  ]),
  { selector: ".openwind-story-location", frames: [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: 10080 / DURATION },
    { opacity: 0, offset: 10400 / DURATION }, { opacity: 0, offset: (DURATION - 320) / DURATION }, { opacity: 1, offset: 1 },
  ] },
  camera(".openwind-frame--observe .openwind-story-capture", 1000, 2200, "translateY(var(--openwind-observe-crop)) scale(1)", "translateY(var(--openwind-observe-crop)) scale(1.025)"),
  camera(".openwind-frame--forecast .openwind-story-capture", 7100, 8000, "translateY(var(--openwind-forecast-start))", "translateY(var(--openwind-forecast-end))"),
  { selector: ".openwind-article-intro", frames: [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: 14100 / DURATION }, { opacity: 0, offset: 14500 / DURATION },
    { opacity: 0, offset: 0.9 }, { opacity: 1, offset: 0.96 }, { opacity: 1, offset: 1 },
  ] },
  { selector: ".openwind-article-photo-layer", frames: [
    { opacity: 0, transform: "translateY(12px)", offset: 0 },
    { opacity: 0, transform: "translateY(12px)", offset: 14100 / DURATION, curve: "soft" },
    { opacity: 1, transform: "translateY(0)", offset: 14500 / DURATION },
    { opacity: 1, transform: "translateY(0)", offset: 16800 / DURATION },
    { opacity: 0, transform: "translateY(12px)", offset: 0.9 },
    { opacity: 0, transform: "translateY(12px)", offset: 1 },
  ] },
];

export function OpenwindDemo({ active }: { screen: PreviewScreen; active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const ready = useCallback((key: string) => setLoaded((previous) => previous.has(key) ? previous : new Set([...previous, key])), []);
  const { started, running } = useDemoMotion(root, active && loaded.size === 4, sequence, DURATION);

  return <div ref={root} className="portfolio-demo openwind-story" data-demo="openwind" data-started={started} data-running={running} data-ready={loaded.size === 4}>
    <p className="visually-hidden">OpenWind : les mesures d’une balise de vent à Morlon, les prévisions du même spot, un article pour comprendre la bise, le foehn et le joran, puis le projet open source et communautaire. Captures réelles du 3 novembre 2026, sans données en direct dans cet aperçu.</p>
    <div className="openwind-story-stage" aria-hidden="true">
      <p className="openwind-story-location">Morlon, Les Laviaux</p>
      {scenes.map((scene) => <div key={scene.id} className={`openwind-story-frame openwind-frame--${scene.id}`}>
        <p className="openwind-story-title">{scene.title}</p>
        <div className="openwind-story-window">
          <picture className={scene.id === "read" ? "openwind-article-intro" : undefined}>
            <source media="(max-width: 639px)" srcSet={`/projects/openwind/${scene.file}-mobile.jpg`} width={scene.mobile[0]} height={scene.mobile[1]} />
            <Image className="openwind-story-capture" src={`/projects/openwind/${scene.file}-desktop.jpg`} alt="" width={scene.desktop[0]} height={scene.desktop[1]} loading="eager" unoptimized onLoad={() => ready(scene.id)} onError={() => ready(scene.id)} />
          </picture>
          {scene.id === "read" && <div className="openwind-article-photo-layer">
            <div className="openwind-article-photo-crop">
              <Image className="openwind-article-photo" src="/projects/openwind/article-desktop.jpg" alt="" width={896} height={976} loading="eager" unoptimized onLoad={() => ready("article-photo")} onError={() => ready("article-photo")} />
            </div>
          </div>}
        </div>
      </div>)}
      <div className="openwind-story-frame openwind-frame--open">
        <p className="openwind-story-title">Ouvert. Et partagé.</p>
        <div className="openwind-story-community">
          <Image className="openwind-story-logo" src="/logo_app/logo_openwind.png" alt="" width={2000} height={312} sizes="300px" loading="eager" />
          <p>Un projet open source,<br />construit avec sa communauté.</p>
          <Github size={28} aria-hidden="true" />
        </div>
      </div>
    </div>
    <div className="openwind-story-footer">
      <p>Captures du 3 novembre 2026.</p>
      <div>
        <a href="https://www.openwind.ch/fr/carnet/bise-foehn-joran-vents-suisse-romande" target="_blank" rel="noopener noreferrer"><BookOpen size={14} aria-hidden="true" />Le Carnet<span className="visually-hidden"> (nouvel onglet)</span></a>
        <a href="https://github.com/Guillaumeperrottet/openwind" target="_blank" rel="noopener noreferrer"><Github size={14} aria-hidden="true" />Code source<span className="visually-hidden"> (nouvel onglet)</span></a>
      </div>
    </div>
  </div>;
}
