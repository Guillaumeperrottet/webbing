"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDemoPlayback } from "@/components/demo-playback";

export type MotionFrame = Keyframe & { curve?: "soft" };
export type DemoSequence = readonly { selector: string; frames: MotionFrame[] }[];

// One native clock per scene: hidden projects retain their position without doing work.
export function useDemoMotion(root: RefObject<HTMLDivElement | null>, active: boolean, sequence: DemoSequence, durationMs?: number) {
  const paused = useDemoPlayback()?.paused ?? false;
  const animations = useRef<Animation[]>([]);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(media.matches);
    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    syncMotion();
    syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.intersectionRatio >= 0.35), { threshold: 0.35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [root]);

  const canRun = active && visible && pageVisible && !reduced && !paused;
  useEffect(() => { if (canRun) setStarted(true); }, [canRun]);
  const running = canRun && started;

  useLayoutEffect(() => {
    const node = root.current;
    if (!node || !started || reduced) return;
    const style = getComputedStyle(node);
    const easing = { enter: style.getPropertyValue("--ease-out").trim(), soft: style.getPropertyValue("--ease-selfcamp-soft").trim() };
    const duration = style.getPropertyValue("--dur-selfcamp").trim();
    const options = { duration: durationMs ?? parseFloat(duration) * (duration.endsWith("ms") ? 1 : 1000), fill: "both" as const, iterations: Infinity };
    const created = sequence.flatMap(({ selector, frames }) => {
      return [...node.querySelectorAll(selector)].map((target) => {
        const animation = target.animate(frames.map(({ curve, ...frame }) => ({ ...frame, easing: curve === "soft" ? easing.soft : easing.enter })), options);
        animation.pause();
        animation.currentTime = 0;
        return animation;
      });
    });
    animations.current = created;
    return () => {
      created.forEach((animation) => animation.cancel());
      animations.current = [];
    };
  }, [root, sequence, started, reduced, durationMs]);

  useEffect(() => {
    animations.current.forEach((animation) => { if (running) animation.play(); else animation.pause(); });
  }, [running, started, reduced]);

  return { started: started && !reduced, running, reduced };
}
