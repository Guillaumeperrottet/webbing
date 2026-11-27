"use client";

import { useState } from "react";
import Image from "next/image";
import { projectPresentations, type Presentation, type PresentedProjectId } from "@/data/project-presentations";

export function ProjectScreenshot({ projectId, projectName, priority = false }: { projectId: PresentedProjectId; projectName: string; priority?: boolean }) {
  const [selected, setSelected] = useState(0);
  const presentation: Presentation = projectPresentations[projectId];
  const screenshots = presentation.secondaryScreenshot ? [presentation.screenshot, presentation.secondaryScreenshot] : [presentation.screenshot];
  const screenshot = screenshots[selected];
  const mobile = screenshot.mobile;
  const multiple = screenshots.length > 1;
  const imageId = `project-image-${projectId}`;

  return (
    <div className={`project-gallery${multiple ? " project-gallery--multiple" : ""}`}>
      <figure id={imageId} className={`project-screenshot${projectId === "graphomouv" ? " project-screenshot--teaching" : ""}${screenshot.framing === "plan" ? " project-screenshot--plan" : ""}`}>
        <picture key={screenshot.src}>
          {mobile && <source media="(max-width: 639px)" srcSet={mobile.src} width={mobile.width} height={mobile.height} />}
          <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height}
            sizes="(max-width: 640px) calc(100vw - 64px), (max-width: 960px) calc(100vw - 96px), 60vw" priority={priority && selected === 0} />
        </picture>
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
