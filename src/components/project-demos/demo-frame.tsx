"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { type PreviewScreen } from "@/components/project-preview";
import { useDemoMotion, type DemoSequence, type MotionFrame } from "@/components/use-demo-motion";
import { demoStories, type StoryDemoId } from "@/data/demo-stories";

export function useProjectDemo(id: StoryDemoId, active: boolean, sequence: DemoSequence) {
  const root = useRef<HTMLDivElement>(null);
  return { root, ...useDemoMotion(root, active, sequence, demoStories[id].duration) };
}

export function DemoFrame({ id, motion, children }: { id: StoryDemoId; motion: ReturnType<typeof useProjectDemo>; children: ReactNode }) {
  return <div ref={motion.root} className={`portfolio-demo project-demo-${id}`} data-demo={id} data-started={motion.started} data-running={motion.running}>
    <p className="visually-hidden">{demoStories[id].description}</p>
    <div className="project-demo-scene" aria-hidden="true">{children}</div>
    <p className="portfolio-demo-caption">{demoStories[id].caption}</p>
  </div>;
}

export function DemoScreen({ screen }: { screen: PreviewScreen }) {
  return <div className="demo-site-screen"><Image src={screen.src} alt="" width={screen.width} height={screen.height} sizes="(max-width: 960px) 100vw, 800px" /></div>;
}

// Individual objects share arrival mechanics; each project defines its own composition and story.
export function reveal(at: number, from: string, pose = "none", end = 0.9): MotionFrame[] {
  return [
    { opacity: 0, transform: from, offset: 0 },
    { opacity: 0, transform: from, offset: at },
    { opacity: 1, transform: pose, offset: at + 0.08, curve: "soft" },
    { opacity: 1, transform: pose, offset: end },
    { opacity: 0, transform: pose, offset: 0.99 },
    { opacity: 0, transform: from, offset: 1 },
  ];
}
