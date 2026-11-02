"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SelfcampDemo } from "@/components/selfcamp-demo";
import { PortfolioDemo, type PortfolioDemoId } from "@/components/portfolio-demo";
import { DemoPauseButton, useDemoPlayback } from "@/components/demo-playback";

export type PreviewScreen = { label: string; src: string; alt: string; width: number; height: number; videoSrc?: string };

export function ProjectPreview({ name, screens, priority = false, active = true, demo }: { name: string; screens: readonly PreviewScreen[]; priority?: boolean; active?: boolean; demo?: "selfcamp" | PortfolioDemoId }) {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const playback = useDemoPlayback();
  useEffect(() => setReady(true), []);
  useEffect(() => { if (!active) video.current?.pause(); }, [active]);
  const screen = screens[selected];
  const showDemo = !!demo && selected === 0;
  const canPause = showDemo && playback?.motionAllowed;

  return (
    <figure className="project-preview" aria-label={`Aperçu de ${name}`}>
      <div className={`preview-image${screen.videoSrc ? " preview-video" : ""}${showDemo ? " preview-selfcamp preview-demo" : ""}`} data-kind="product" data-orientation={screen.width < screen.height ? "portrait" : "landscape"}>
        {demo === "selfcamp" && <div hidden={!showDemo}><SelfcampDemo active={active && showDemo} /></div>}
        {demo && demo !== "selfcamp" && <div hidden={!showDemo}><PortfolioDemo id={demo} screen={screens[0]} active={active && showDemo} /></div>}
        {!showDemo && (screen.videoSrc ? <video ref={video} controls playsInline preload="none" poster={screen.src} width={screen.width} height={screen.height} aria-label={screen.alt}>
          <source src={screen.videoSrc} type="video/mp4" />
          <a href={screen.videoSrc}>Voir la vidéo : {screen.label}</a>
        </video> : <Image key={screen.src} src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} priority={priority} sizes={priority ? "(max-width: 959px) 100vw, 880px" : "(max-width: 639px) 100vw, 600px"} />)}
      </div>
      {(screens.length > 1 || canPause) && <figcaption className="preview-caption">
        <span className="preview-caption-text" aria-live="polite">{screen.label}</span>
        <div className="preview-controls" role="group" aria-label={`Commandes de l’aperçu de ${name}`}>
          {canPause && <DemoPauseButton name={name} />}
          {screens.length > 1 && screens.map((item, index) => (
            <button type="button" key={item.src} disabled={!ready} aria-pressed={selected === index} aria-label={`${name} : ${item.label}`} onClick={() => setSelected(index)}>{item.label}</button>
          ))}
        </div>
      </figcaption>}
      {screen.videoSrc && !showDemo && <figcaption className="video-caption">{screen.label}</figcaption>}

    </figure>
  );
}
