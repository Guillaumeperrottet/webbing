"use client";

import Image from "next/image";
import { MousePointer2 } from "lucide-react";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { type PreviewScreen } from "@/components/project-preview";
import { useDemoMotion, type DemoSequence, type MotionFrame } from "@/components/use-demo-motion";
import { demoStories } from "@/data/demo-stories";

const DURATION = demoStories.wisp.duration;
const chapters = [
  { id: "upload", title: "Vos fichiers.", start: 0, end: 4500 },
  { id: "link", title: "Un lien. C’est partagé.", start: 4500, end: 9000 },
  { id: "receive", title: "Prêts à être récupérés.", start: 9000, end: 13200 },
  { id: "library", title: "Et pour les retrouver ?", start: 13200, end: 21400 },
  { id: "close", title: "Simple. Hébergé en Suisse.", start: 21400, end: DURATION },
] as const;
type Gesture = "create" | "copy" | "folder" | "search";
type Shot = { id: string; chapter: string; file: string; desktop: readonly [number, number]; mobile: readonly [number, number]; gesture?: Gesture };
const shots: readonly Shot[] = [
  { id: "empty", chapter: "upload", file: "transfer-empty", desktop: [432, 488], mobile: [350, 414] },
  { id: "selected", chapter: "upload", file: "transfer-selected", desktop: [432, 330], mobile: [350, 330], gesture: "create" },
  { id: "ready", chapter: "link", file: "link-ready", desktop: [432, 450], mobile: [350, 450], gesture: "copy" },
  { id: "copied", chapter: "link", file: "link-copied", desktop: [432, 450], mobile: [350, 450] },
  { id: "received", chapter: "receive", file: "received", desktop: [768, 359], mobile: [340, 359] },
  { id: "root", chapter: "library", file: "library-root", desktop: [680, 450], mobile: [390, 480], gesture: "folder" },
  { id: "project", chapter: "library", file: "library-project", desktop: [680, 450], mobile: [380, 480], gesture: "search" },
  { id: "focus", chapter: "library", file: "library-search-focus", desktop: [680, 450], mobile: [380, 480] },
  { id: "p", chapter: "library", file: "library-search-p", desktop: [680, 450], mobile: [380, 480] },
  ...["ph", "pho", "phot", "photo"].map((id) => ({ id, chapter: "library", file: `library-search-${id}`, desktop: [680, 450] as const, mobile: [390, 480] as const })),
  { id: "filtered", chapter: "library", file: "library-filtered", desktop: [680, 450], mobile: [390, 480] },
];
// Points refer to the actual captured control pixels, before the contain-fit scale.
const targets: Record<Gesture, { desktop: readonly [number, number]; mobile: readonly [number, number] }> = {
  create: { desktop: [336.96, 298], mobile: [273, 298] },
  copy: { desktop: [336.96, 370], mobile: [273, 370] },
  folder: { desktop: [121.6, 296.8], mobile: [111.5, 344.8] },
  search: { desktop: [170, 114.8], mobile: [120, 110.8] },
};
function planeStyle(shot: Shot): CSSProperties {
  const target = shot.gesture ? targets[shot.gesture] : undefined;
  return {
    "--wisp-ratio-desktop": shot.desktop[0] / shot.desktop[1],
    "--wisp-ratio-mobile": shot.mobile[0] / shot.mobile[1],
    ...(target ? {
      "--wisp-target-x-desktop": `${target.desktop[0] / shot.desktop[0] * 100}%`,
      "--wisp-target-y-desktop": `${target.desktop[1] / shot.desktop[1] * 100}%`,
      "--wisp-target-x-mobile": `${target.mobile[0] / shot.mobile[0] * 100}%`,
      "--wisp-target-y-mobile": `${target.mobile[1] / shot.mobile[1] * 100}%`,
    } : {}),
  } as CSSProperties;
}
function visible(start: number, end: number): MotionFrame[] {
  if (start === 0) return [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: (end - 260) / DURATION },
    { opacity: 0, offset: end / DURATION }, { opacity: 0, offset: (DURATION - 260) / DURATION }, { opacity: 1, offset: 1 },
  ];
  return [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: start / DURATION },
    { opacity: 1, offset: (start + 260) / DURATION }, { opacity: 1, offset: (end - 260) / DURATION },
    { opacity: 0, offset: end / DURATION }, { opacity: 0, offset: 1 },
  ];
}
const swap = (at: number, outgoing: boolean, fade = 300): MotionFrame[] => [
  { opacity: outgoing ? 1 : 0, offset: 0 },
  { opacity: outgoing ? 1 : 0, offset: at / DURATION },
  { opacity: outgoing ? 0 : 1, offset: (at + fade) / DURATION, curve: "soft" },
  { opacity: outgoing ? 0 : 1, offset: 0.94 },
  { opacity: outgoing ? 1 : 0, offset: 0.97 },
  { opacity: outgoing ? 1 : 0, offset: 1 },
];
const typing = [
  { id: "focus", start: 16880, end: 17400 },
  ...["p", "ph", "pho", "phot", "photo"].map((id, index) => ({ id, start: 17400 + index * 180, end: 17580 + index * 180 })),
];
const gestures = [
  { id: "create", enter: 3000, click: 3900 },
  { id: "copy", enter: 5200, click: 6100 },
  { id: "folder", enter: 13500, click: 14500 },
  { id: "search", enter: 15800, click: 16700 },
] as const;
const sequence: DemoSequence = [
  ...chapters.flatMap(({ id, start, end }) => [
    { selector: `.wisp-chapter--${id}`, frames: visible(start, id === "close" ? end - 260 : end) },
    { selector: `.wisp-chapter--${id} .wisp-story-title`, frames: visible(start, id === "close" ? end - 260 : end).map((frame) => ({ ...frame, transform: frame.opacity === 1 ? "translateY(0)" : "translateY(14px)" })) },
  ]),
  { selector: ".wisp-story-project", frames: [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: 21140 / DURATION },
    { opacity: 0, offset: 21400 / DURATION }, { opacity: 0, offset: (DURATION - 260) / DURATION }, { opacity: 1, offset: 1 },
  ] },
  { selector: ".wisp-shot--empty", frames: swap(1100, true) },
  { selector: ".wisp-shot--selected", frames: swap(1100, false).map((frame) => ({ ...frame, transform: frame.opacity === 1 ? "translateY(0)" : "translateY(12px)" })) },
  { selector: ".wisp-shot--ready", frames: swap(6450, true) },
  { selector: ".wisp-shot--copied", frames: swap(6450, false) },
  { selector: ".wisp-shot--root", frames: swap(15000, true) },
  { selector: ".wisp-shot--project", frames: [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: 15000 / DURATION },
    { opacity: 1, offset: 15300 / DURATION }, { opacity: 1, offset: 16880 / DURATION },
    { opacity: 0, offset: 16960 / DURATION }, { opacity: 0, offset: 1 },
  ] },
  ...typing.map(({ id, start, end }) => ({ selector: `.wisp-shot--${id}`, frames: [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: start / DURATION },
    { opacity: 1, offset: (start + 80) / DURATION }, { opacity: 1, offset: end / DURATION },
    { opacity: 0, offset: (end + 80) / DURATION }, { opacity: 0, offset: 1 },
  ] })),
  { selector: ".wisp-shot--filtered", frames: swap(18300, false, 80) },
  ...gestures.flatMap(({ id, enter, click }) => [
    { selector: `.wisp-cursor--${id}`, frames: [
      { opacity: 0, transform: "translate(26px, 18px) scale(1)", offset: 0 },
      { opacity: 0, transform: "translate(26px, 18px) scale(1)", offset: enter / DURATION },
      { opacity: 1, transform: "translate(26px, 18px) scale(1)", offset: (enter + 100) / DURATION, curve: "soft" },
      { opacity: 1, transform: "translate(0, 0) scale(1)", offset: (click - 180) / DURATION },
      { opacity: 1, transform: "translate(0, 0) scale(1)", offset: click / DURATION },
      { opacity: 1, transform: "translate(0, 0) scale(0.78)", offset: (click + 100) / DURATION },
      { opacity: 1, transform: "translate(0, 0) scale(1)", offset: (click + 180) / DURATION },
      { opacity: 0, transform: "translate(0, 0) scale(1)", offset: (click + 350) / DURATION },
      { opacity: 0, transform: "translate(26px, 18px) scale(1)", offset: 1 },
    ] as MotionFrame[] },
    { selector: `.wisp-pulse--${id}`, frames: [
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.6)", offset: 0 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.6)", offset: click / DURATION },
      { opacity: 0.7, transform: "translate(-50%, -50%) scale(0.7)", offset: (click + 50) / DURATION },
      { opacity: 0, transform: "translate(-50%, -50%) scale(1.3)", offset: (click + 300) / DURATION },
      { opacity: 0, transform: "translate(-50%, -50%) scale(0.6)", offset: 1 },
    ] as MotionFrame[] },
  ]),
];

export function WispDemo({ active }: { screen: PreviewScreen; active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const ready = useCallback((id: string) => setLoaded((current) => current.has(id) ? current : new Set([...current, id])), []);
  const { started, running } = useDemoMotion(root, active && loaded.size === shots.length, sequence, DURATION);

  return <div ref={root} className="portfolio-demo wisp-story" data-demo="wisp" data-ready={loaded.size === shots.length} data-started={started} data-running={running}>
    <p className="visually-hidden">{demoStories.wisp.description}</p>
    <div className="wisp-story-stage" aria-hidden="true">
      <p className="wisp-story-project">Projet camping</p>
      {chapters.map((chapter) => <div key={chapter.id} className={`wisp-story-chapter wisp-chapter--${chapter.id}`}>
        <p className="wisp-story-title">{chapter.title}</p>
        {chapter.id === "close" ? <div className="wisp-story-closing">
          <Image src="/logo_app/logo_wisp.png" alt="" width={1250} height={1250} sizes="100px" loading="eager" />
          <p>Wisp.</p>
        </div> : <div className="wisp-story-window">
          {shots.filter((shot) => shot.chapter === chapter.id).map((shot) => <div key={shot.id} className={`wisp-story-shot wisp-shot--${shot.id}`}>
            <div className="wisp-shot-plane" style={planeStyle(shot)} data-action={shot.gesture}>
              <picture>
                <source media="(max-width: 639px)" srcSet={`/projects/wisp/${shot.file}-mobile.jpg`} width={shot.mobile[0]} height={shot.mobile[1]} />
                <Image src={`/projects/wisp/${shot.file}-desktop.jpg`} alt="" width={shot.desktop[0]} height={shot.desktop[1]} unoptimized loading="eager" onLoad={() => ready(shot.id)} onError={() => ready(shot.id)} />
              </picture>
              {shot.gesture && <>
                <span className={`wisp-gesture-pulse wisp-pulse--${shot.gesture}`} />
                <span className={`wisp-gesture-cursor wisp-cursor--${shot.gesture}`}><MousePointer2 aria-hidden="true" /></span>
              </>}
            </div>
          </div>)}
        </div>}
      </div>)}
    </div>
    <p className="wisp-story-note">Démonstration avec des fichiers d’exemple.</p>
  </div>;
}
