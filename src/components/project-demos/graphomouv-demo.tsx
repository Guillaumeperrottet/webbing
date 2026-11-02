"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { type PreviewScreen } from "@/components/project-preview";
import { type DemoSequence } from "@/components/use-demo-motion";
import { DemoFrame, useProjectDemo } from "./demo-frame";

const sequence: DemoSequence = [];

export function GraphomouvDemo({ screen, active }: { screen: PreviewScreen; active: boolean }) {
  const motion = useProjectDemo("graphomouv", active, sequence);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (motion.running) void element.play().then(() => { if (cancelled) element.pause(); }).catch(() => { /* Retain the supplied poster when autoplay is unavailable. */ });
    else element.pause();
    return () => { cancelled = true; element.pause(); };
  }, [motion.running, motion.started, motion.reduced]);

  return <DemoFrame id="graphomouv" motion={motion}>
    <div className="graphomouv-notebook">
      <div className="graphomouv-film">
        <Image src={screen.src} alt="" width={screen.width} height={screen.height} sizes="(max-width: 960px) 55vw, 450px" />
        <video ref={video} src={motion.started && !motion.reduced ? screen.videoSrc : undefined} muted loop playsInline preload="none" poster={screen.src} hidden={!motion.started || motion.reduced} />
      </div>
    </div>
  </DemoFrame>;
}
