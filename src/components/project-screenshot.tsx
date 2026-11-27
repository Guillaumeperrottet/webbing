"use client";

import { useRef, useState, type PointerEvent } from "react";
import { projectSwipeDirection } from "@/lib/project-swipe";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { projectPresentations, type Presentation, type PresentedProjectId } from "@/data/project-presentations";

export function ProjectScreenshot({ projectId, projectName, priority = false, onNavigate }: { projectId: PresentedProjectId; projectName: string; priority?: boolean; onNavigate?: (direction: -1 | 1) => void }) {
  const [selected, setSelected] = useState(0);
  const gesture = useRef<{ id: number; x: number; y: number; axis: "horizontal" | "vertical" | null } | null>(null);
  const resetGesture = (node: HTMLElement) => {
    gesture.current = null;
    node.removeAttribute("data-swiping");
    node.style.removeProperty("--swipe-offset");
  };
  const startGesture = (event: PointerEvent<HTMLElement>) => {
    if (!onNavigate || !event.isPrimary || event.button !== 0 || !window.matchMedia("(max-width: 640px)").matches) return;
    if ((event.target as Element).closest("a, button")) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: null };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveGesture = (event: PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(y) > 8 && Math.abs(y) > Math.abs(x)) start.axis = "vertical";
      else if (Math.abs(x) > 10 && Math.abs(x) > Math.abs(y) * 1.5) start.axis = "horizontal";
    }
    if (start.axis !== "horizontal") return;
    event.currentTarget.dataset.swiping = "true";
    event.currentTarget.style.setProperty("--swipe-offset", `${Math.max(-80, Math.min(80, x * 0.65))}px`);
  };
  const endGesture = (event: PointerEvent<HTMLElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const direction = start.axis === "horizontal" ? projectSwipeDirection(event.clientX - start.x, event.clientY - start.y, event.currentTarget.clientWidth) : null;
    resetGesture(event.currentTarget);
    if (direction) onNavigate?.(direction);
  };
  const presentation: Presentation = projectPresentations[projectId];
  const screenshots = presentation.secondaryScreenshot ? [presentation.screenshot, presentation.secondaryScreenshot] : [presentation.screenshot];
  const screenshot = screenshots[selected];
  const multiple = screenshots.length > 1;
  const imageId = `project-image-${projectId}`;

  return (
    <div className={`project-gallery${multiple ? " project-gallery--multiple" : ""}`}>
      <figure id={imageId} onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={(event) => resetGesture(event.currentTarget)} onLostPointerCapture={(event) => resetGesture(event.currentTarget)} className={`project-screenshot${projectId === "graphomouv" ? " project-screenshot--teaching" : ""}${screenshot.framing === "plan" ? " project-screenshot--plan" : ""}`}>
        <picture key={screenshot.src}>
          <Image draggable={false} src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height}
            sizes="(max-width: 640px) 100vw, (max-width: 960px) calc(100vw - 96px), 60vw" priority={priority && selected === 0} />
        </picture>
        <a className="project-capture-expand" href={screenshot.src} target="_blank" rel="noopener noreferrer" aria-label={`Voir la capture de ${projectName} en grand (nouvel onglet)`}>
          <Maximize2 size={17} aria-hidden="true" />
        </a>
      </figure>
      {multiple && <>
        <div className="project-gallery-nav" role="group" aria-label={`Captures de ${projectName}`}>
          {screenshots.map((view, index) => (
            <button key={view.src} type="button" aria-pressed={selected === index} aria-controls={imageId} onClick={() => setSelected(index)}>
              {view.label ?? "Accueil"}
            </button>
          ))}
          <span className="project-gallery-count" aria-hidden="true">{String(selected + 1).padStart(2, "0")} / 02</span>
        </div>
        <p className="visually-hidden" role="status">{projectName} : {screenshot.label ?? "Accueil"}, vue {selected + 1} sur 2.</p>
      </>}
    </div>
  );
}
