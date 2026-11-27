"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { advancePlaygroundBall, constrainPlaygroundBall, playgroundThrowVelocity, type PlaygroundBall } from "@/lib/studio-playground";

function PlaygroundCourt() {
  const court = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLButtonElement>(null);
  const [bounces, setBounces] = useState(0);

  useEffect(() => {
    const area = court.current, node = ball.current;
    if (!area || !node) return;
    let bounds = { width: area.clientWidth, height: area.clientHeight, radius: 21 };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pose: PlaygroundBall = { x: bounds.width / 2, y: reduced ? bounds.height - 21 : 42, vx: reduced ? 0 : 180, vy: 0 };
    let frame = 0, lastTime = 0, resting = reduced, disposed = false;
    let drag: { id: number; dx: number; dy: number; last: number; previous: PlaygroundBall; interval: number } | null = null;
    const draw = () => { node.style.transform = `translate3d(${pose.x - 21}px, ${pose.y - 21}px, 0)`; };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || drag || document.hidden) return;
      const step = advancePlaygroundBall(pose, bounds, lastTime ? now - lastTime : 16);
      pose = step.ball; resting = step.resting; lastTime = now;
      if (step.bounces) setBounces((count) => count + step.bounces);
      draw();
      if (!resting) frame = requestAnimationFrame(tick);
    };
    const play = () => { lastTime = 0; resting = false; if (!frame && !document.hidden) frame = requestAnimationFrame(tick); };
    const release = (event: PointerEvent, cancelled = false) => {
      if (!drag || event.pointerId !== drag.id) return;
      const held = drag; drag = null;
      node.dataset.held = "false";
      const velocity = cancelled ? { vx: 0, vy: 0 } : playgroundThrowVelocity(pose.x - held.previous.x, pose.y - held.previous.y, held.interval, performance.now() - held.last);
      pose = { ...pose, ...velocity };
      if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
      play();
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || drag) return;
      event.preventDefault();
      const rect = area.getBoundingClientRect();
      drag = { id: event.pointerId, dx: event.clientX - rect.left - pose.x, dy: event.clientY - rect.top - pose.y, last: performance.now(), previous: { ...pose }, interval: 16 };
      cancelAnimationFrame(frame); frame = 0;
      node.setPointerCapture(event.pointerId); node.dataset.held = "true";
    };
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const rect = area.getBoundingClientRect(), now = performance.now();
      drag.previous = { ...pose }; drag.interval = now - drag.last; drag.last = now;
      pose = constrainPlaygroundBall({ x: event.clientX - rect.left - drag.dx, y: event.clientY - rect.top - drag.dy, vx: 0, vy: 0 }, bounds);
      draw();
    };
    const cancel = (event: PointerEvent) => release(event, true);
    const key = (event: KeyboardEvent) => {
      if (![" ", "Enter", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      pose.vx = event.key === "ArrowLeft" ? -500 : event.key === "ArrowRight" ? 500 : (pose.x > bounds.width / 2 ? -260 : 260);
      pose.vy = -650; play();
    };
    const resize = new ResizeObserver(() => {
      bounds = { width: area.clientWidth, height: area.clientHeight, radius: 21 };
      pose = constrainPlaygroundBall(pose, bounds); draw(); if (!drag) play();
    });
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame); frame = 0;
        if (drag) {
          const id = drag.id; drag = null; node.dataset.held = "false";
          pose.vx = 0; pose.vy = 0; resting = false;
          if (node.hasPointerCapture(id)) node.releasePointerCapture(id);
        }
      }
      else if (!resting && !drag) play();
    };
    node.addEventListener("pointerdown", down); node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", release); node.addEventListener("pointercancel", cancel); node.addEventListener("lostpointercapture", cancel);
    node.addEventListener("keydown", key); document.addEventListener("visibilitychange", visibility);
    resize.observe(area); draw(); if (!reduced) play();
    return () => {
      disposed = true; cancelAnimationFrame(frame); resize.disconnect();
      node.removeEventListener("pointerdown", down); node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", release); node.removeEventListener("pointercancel", cancel); node.removeEventListener("lostpointercapture", cancel);
      node.removeEventListener("keydown", key); document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <div className="playground-court" ref={court} aria-label="Terrain de jeu de la balle rose">
    <span className="playground-counter" aria-hidden="true">{String(bounces).padStart(2, "0")} {bounces > 1 ? "rebonds" : "rebond"}</span>
    <button ref={ball} type="button" className="playground-ball" aria-label="Lancer la balle rose" aria-describedby="playground-instructions" />
    <span className="playground-floor" aria-hidden="true" />
  </div>;
}

export default function StudioPlayground({ onClose }: { onClose: () => void }) {
  return <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
    <Dialog.Portal>
      <Dialog.Overlay className="playground-overlay" />
      <Dialog.Content className="studio-playground" aria-modal="true" onCloseAutoFocus={(event) => event.preventDefault()}>
        <div className="playground-top"><span>Webbing · Passage secret</span><Dialog.Close className="playground-close">Retour au studio <X size={18} aria-hidden="true" /></Dialog.Close></div>
        <header className="playground-intro"><div><p>Bien trouvé.</p><Dialog.Title>La récré.</Dialog.Title></div><Dialog.Description>Vous étiez censé regarder<br />nos réalisations.</Dialog.Description></header>
        <PlaygroundCourt />
        <footer className="playground-bottom"><p id="playground-instructions">Attrapez. Lancez. Recommencez.<span> Au clavier : espace ou flèches.</span></p><span>Les meilleures idées commencent parfois par une pause.</span></footer>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
