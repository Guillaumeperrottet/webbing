"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { type DemoSequence, useDemoMotion } from "@/components/use-demo-motion";
import type { PreviewScreen } from "@/components/project-preview";
import { prepareSelfcampLayers } from "@/components/selfcamp-home-layers";

const SEARCH = "Gumefens";
const DURATION = 6400;
const at = (ms: number) => ms / DURATION;
const arrival: DemoSequence = [
  { selector: ".selfcamp-home-landscape", frames: [
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1)", offset: at(450), curve: "soft" },
    { transform: "scale(1.025)", offset: at(2450) },
    { transform: "scale(1.025)", offset: 1 },
  ] },
  { selector: ".selfcamp-home-search-focus rect", frames: [
    { strokeDashoffset: 1, offset: 0 },
    { strokeDashoffset: 1, offset: at(2250), curve: "soft" },
    { strokeDashoffset: 0, offset: at(2952) },
    { strokeDashoffset: 0, offset: 1 },
  ] },
  { selector: ".selfcamp-home-search-focus", frames: [
    { opacity: 0, offset: 0 },
    { opacity: 0, offset: at(2160) },
    { opacity: 1, offset: at(2250) },
    { opacity: 1, offset: at(3132), curve: "soft" },
    { opacity: 0, offset: at(3600) },
    { opacity: 0, offset: 1 },
  ] },
  { selector: ".selfcamp-search-query", frames: [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: at(2480) },
    { opacity: 1, offset: at(2600) }, { opacity: 1, offset: 1 },
  ] },
  ...[...SEARCH].map((_, index) => ({ selector: `[data-search-character="${index}"]`, frames: [
    { opacity: 0, offset: 0 }, { opacity: 0, offset: at(2800 + index * 120) },
    { opacity: 1, offset: at(2840 + index * 120) }, { opacity: 1, offset: 1 },
  ] })),
  { selector: ".selfcamp-search-result", frames: [
    { opacity: 0, transform: "translateY(8px)", offset: 0 },
    { opacity: 0, transform: "translateY(8px)", offset: at(4100), curve: "soft" },
    { opacity: 1, transform: "translateY(0)", offset: at(4450) },
    { opacity: 1, transform: "translateY(0)", offset: 1 },
  ] },
  { selector: ".selfcamp-home-search-scene", frames: [
    { opacity: 1, offset: 0 }, { opacity: 1, offset: at(5500), curve: "soft" },
    { opacity: 0, offset: at(5850) }, { opacity: 0, offset: 1 },
  ] },
  { selector: ".selfcamp-public-preview", frames: [
    { opacity: 0, transform: "translateY(12px)", offset: 0 },
    { opacity: 0, transform: "translateY(12px)", offset: at(5750), curve: "soft" },
    { opacity: 1, transform: "translateY(0)", offset: at(6200) },
    { opacity: 1, transform: "translateY(0)", offset: 1 },
  ] },
];

export function SelfcampHomePreview({ screen, active, priority, open, onOpen, onReserve }: {
  screen: PreviewScreen; active: boolean; priority: boolean; open: boolean;
  onOpen: () => void; onReserve: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const capture = useRef<HTMLImageElement>(null);
  const landscape = useRef<HTMLCanvasElement>(null);
  const foreground = useRef<HTMLCanvasElement>(null);
  const preparedSource = useRef("");
  const [captureSource, setCaptureSource] = useState("");
  const [depthReady, setDepthReady] = useState(false);
  const [layerFailed, setLayerFailed] = useState(false);
  const [ficheReady, setFicheReady] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState<boolean | null>(null);
  const { started, running, completed, reduced } = useDemoMotion(root, active && !open && !!captureSource && ficheReady && (depthReady || layerFailed), arrival, DURATION, 1);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => { if (completed || motionAllowed === false) onOpen(); }, [completed, motionAllowed, onOpen]);

  useEffect(() => {
    if (!active || reduced || !captureSource || preparedSource.current === captureSource) return;
    let disposed = false;
    const photo = new window.Image();
    photo.src = "/projects/selfcamp-home-landscape.jpg";
    void photo.decode().then(() => {
      if (disposed || !capture.current || !landscape.current || !foreground.current) return;
      const layers = prepareSelfcampLayers(capture.current, photo);
      if (!layers) { setLayerFailed(true); return; }
      for (const [canvas, pixels] of [[landscape.current, layers.landscape], [foreground.current, layers.foreground]] as const) {
        canvas.width = pixels.width;
        canvas.height = pixels.height;
        canvas.getContext("2d")?.putImageData(pixels, 0, 0);
      }
      preparedSource.current = captureSource;
      setDepthReady(true);
    }).catch(() => { if (!disposed) setLayerFailed(true); });
    return () => { disposed = true; };
  }, [active, reduced, captureSource]);

  return <div ref={root} className="selfcamp-home-preview" data-demo="selfcamp-home" data-depth-ready={depthReady && !reduced} data-started={started} data-running={running} data-completed={completed} data-open={open}>
    <div className="selfcamp-home-search-scene" aria-hidden={open}>
    <Image ref={capture} className="selfcamp-home-capture" src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} priority={priority}
      sizes="(max-width: 959px) 100vw, 880px" onLoad={(event) => setCaptureSource(event.currentTarget.currentSrc)} />
    <canvas ref={landscape} className="selfcamp-home-landscape" aria-hidden="true" />
    <canvas ref={foreground} className="selfcamp-home-interface" aria-hidden="true" />
    <svg className="selfcamp-home-search-focus" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="996" height="96" rx="30" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
    </svg>
    <div className="selfcamp-search-query" aria-hidden="true"><Search size={14} /><span>{[...SEARCH].map((letter, index) => <span key={index} data-search-character={index}>{letter}</span>)}</span></div>
    <div className="selfcamp-search-result" aria-hidden="true">
      <Image src="/projects/selfcamp-camping-du-lac-photo.webp" alt="" width={96} height={72} sizes="96px" />
      <div><strong>Camping du Lac</strong><span>Gumefens, Fribourg</span></div>
    </div>
    </div>
    <section className="selfcamp-public-preview" aria-label="Fiche publique du Camping du Lac" aria-hidden={!open} inert={!open}>
      <Image className="selfcamp-establishment-photo" src="/projects/selfcamp-camping-du-lac-photo.webp" alt="Le Camping du Lac au bord du lac de la Gruyère" width={1920} height={1080} sizes="(max-width: 639px) 400px, 880px" onLoad={() => setFicheReady(true)} onError={() => setFicheReady(true)} />
      <div className="selfcamp-establishment-body">
        <h4>Camping du Lac</h4>
        <p className="selfcamp-establishment-location">Gumefens, Fribourg</p>
        <p className="selfcamp-establishment-description">Au bord du lac de la Gruyère.</p>
        <button type="button" className="selfcamp-reserve" onClick={onReserve} disabled={!open} aria-label="Réserver : voir la démonstration à partir des dates">Réserver</button>
        <a className="selfcamp-public-link" href="https://www.selfcamp.ch/establishment/camping-du-lac" target="_blank" rel="noopener noreferrer">Voir la fiche complète<span className="visually-hidden"> (nouvel onglet)</span></a>
      </div>
    </section>
    <noscript><a className="selfcamp-discovery-fallback" href="https://www.selfcamp.ch/establishment/camping-du-lac">Voir la fiche du Camping du Lac</a></noscript>
  </div>;
}
