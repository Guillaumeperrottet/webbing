"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useDemoMotion, type DemoSequence, type MotionFrame } from "@/components/use-demo-motion";
import { demoStories } from "@/data/demo-stories";

const DURATION = demoStories.mypapers.duration;
const chapters = [
  { id: "plan", title: "Un lieu. Son suivi.", start: 0, end: 3600, desktop: [1156, 608], mobile: [386, 399] },
  { id: "documents", title: "La bonne notice.", start: 3600, end: 7200, desktop: [462, 470], mobile: [386, 415] },
  { id: "task", title: "Chacun sait quoi faire.", start: 7200, end: 11600, desktop: [936, 600], mobile: [386, 557] },
  { id: "agenda", title: "Au bon moment.", start: 11600, end: 15700, desktop: [844, 584], mobile: [354, 359] },
  { id: "notes", title: "Les décisions restent.", start: 15700, end: 20000, desktop: [1156, 592], mobile: [386, 557] },
  { id: "communication", title: "Et la suite se prépare.", start: 20000, end: 24400, desktop: [844, 341], mobile: [354, 362] },
] as const;

function visible(start: number, end: number): MotionFrame[] {
  const fade = 260;
  return [
    { opacity: start === 0 ? 1 : 0, offset: 0 },
    ...(start ? [{ opacity: 0, offset: start / DURATION }, { opacity: 1, offset: (start + fade) / DURATION, curve: "soft" as const }] : []),
    { opacity: 1, offset: (end - fade) / DURATION },
    { opacity: 0, offset: end / DURATION },
    { opacity: 0, offset: (DURATION - fade) / DURATION },
    { opacity: start === 0 ? 1 : 0, offset: 1 },
  ];
}

const sequence: DemoSequence = [
  ...[...chapters, { id: "close", start: 24400, end: DURATION - 260 }].flatMap(({ id, start, end }) => [
    { selector: `.mypapers-chapter--${id}`, frames: visible(start, end) },
    { selector: `.mypapers-chapter--${id} .mypapers-story-title`, frames: visible(start, end).map((frame) => ({ ...frame, transform: frame.opacity === 1 ? "translateY(0)" : "translateY(14px)" })) },
  ]),
  { selector: ".mypapers-story-context", frames: [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: 24140 / DURATION },
    { opacity: 0, offset: 24400 / DURATION }, { opacity: 0, offset: (DURATION - 260) / DURATION }, { opacity: 1, offset: 1 },
  ] },
];

export function MypapersDemo({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const ready = useCallback((id: string) => setLoaded((current) => current.has(id) ? current : new Set([...current, id])), []);
  const { started, running } = useDemoMotion(root, active && loaded.size === chapters.length, sequence, DURATION);

  return <div ref={root} className="portfolio-demo mypapers-story" data-demo="mypapers" data-ready={loaded.size === chapters.length} data-started={started} data-running={running}>
    <p className="visually-hidden">{demoStories.mypapers.description}</p>
    <div className="mypapers-story-stage" aria-hidden="true">
      <p className="mypapers-story-context">La Clairière</p>
      {chapters.map((chapter) => <div key={chapter.id} className={`mypapers-story-chapter mypapers-chapter--${chapter.id}`}>
        <p className="mypapers-story-title">{chapter.title}</p>
        <div className="mypapers-story-window">
          <picture>
            <source media="(max-width: 639px)" srcSet={`/projects/mypapers/${chapter.id}-mobile.jpg`} width={chapter.mobile[0]} height={chapter.mobile[1]} />
            <Image src={`/projects/mypapers/${chapter.id}-desktop.jpg`} alt="" width={chapter.desktop[0]} height={chapter.desktop[1]} unoptimized loading="eager" onLoad={() => ready(chapter.id)} onError={() => ready(chapter.id)} />
          </picture>
        </div>
      </div>)}
      <div className="mypapers-story-chapter mypapers-chapter--close">
        <p className="mypapers-story-title">Au bureau. Sur le terrain.</p>
        <div className="mypapers-story-closing">
          <Image src="/projects/mypapers/app-icon.png" alt="" width={192} height={192} sizes="96px" loading="eager" />
          <p>Mypapers</p>
          <span>Sur le web et sur iPhone.</span>
        </div>
      </div>
    </div>
    <p className="mypapers-story-note">Captures de la démo publique du 25 novembre 2026. Données d’exemple.</p>
  </div>;
}
