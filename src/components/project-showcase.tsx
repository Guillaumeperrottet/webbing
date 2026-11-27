"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { showcaseProjects, projectContributions } from "@/data/portfolio";
import { ProjectContactLink, ProjectLink } from "@/components/project-link";
import { ProjectScreenshot } from "@/components/project-screenshot";
import { projectPresentations } from "@/data/project-presentations";
import { ChevronDown } from "lucide-react";
import { ProjectCaseStudy } from "@/components/project-case-study";
import { caseStudies } from "@/data/case-studies";
import { AppStoreBadge } from "@/components/mypapers-app-store";

const sectionAliases: Record<string, number> = {
  realisations: 0,
  applications: 0,
  plannikeeper: showcaseProjects.findIndex((project) => project.id === "mypapers"),
  "sites-web": showcaseProjects.findIndex((project) => !project.application),
};

const projectGroups = [
  { id: "applications", label: "Applications web", application: true },
  { id: "websites", label: "Sites web", application: false },
] as const;

export function ProjectShowcase() {
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"next" | "previous" | undefined>();
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hashUpdate = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHashUpdate = useRef(0);
  const current = showcaseProjects[selected];

  useEffect(() => {
    let frame = 0;
    const followLocation = () => {
      if (hashUpdate.current) clearTimeout(hashUpdate.current);
      hashUpdate.current = null;
      const id = window.location.hash.slice(1);
      const study = caseStudies.find((entry) => entry.id === id);
      const projectIndex = showcaseProjects.findIndex((project) => project.id === (study?.projectId ?? id));
      const index = projectIndex >= 0 ? projectIndex : sectionAliases[id];
      if (index === undefined) return;
      setSwipeDirection(undefined);
      setSelected(index);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const studyDetails = study ? document.getElementById(study.id) : null;
        if (studyDetails instanceof HTMLDetailsElement) {
          studyDetails.open = true;
          studyDetails.scrollIntoView({ block: "start", behavior: "instant" });
        } else {
          sectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });
    };
    followLocation();
    setEnhanced(true);
    window.addEventListener("hashchange", followLocation);
    window.addEventListener("popstate", followLocation);
    return () => {
      cancelAnimationFrame(frame);
      if (hashUpdate.current) clearTimeout(hashUpdate.current);
      window.removeEventListener("hashchange", followLocation);
      window.removeEventListener("popstate", followLocation);
    };
  }, []);

  useEffect(() => {
    // Keep a selected mobile tab visible without scrolling the page vertically.
    const tab = tabRefs.current[selected];
    const rail = tab?.parentElement;
    if (!tab || !rail || !rail.clientWidth || rail.scrollWidth <= rail.clientWidth) return;
    const left = tab.offsetLeft - rail.offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < rail.scrollLeft || right > rail.scrollLeft + rail.clientWidth) {
      rail.scrollTo({ left: Math.max(0, left - 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [selected]);

  const selectProject = (index: number, focus = false, swipe?: -1 | 1) => {
    setSwipeDirection(swipe ? (swipe === 1 ? "next" : "previous") : undefined);
    setSelected(index);
    // Safari limits History calls. Keep selection immediate and coalesce rapid key repeats.
    if (hashUpdate.current) clearTimeout(hashUpdate.current);
    const syncHash = () => {
      const hash = `#${showcaseProjects[index].id}`;
      if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
      lastHashUpdate.current = performance.now();
      hashUpdate.current = null;
    };
    const delay = Math.max(0, 250 - (performance.now() - lastHashUpdate.current));
    if (delay) hashUpdate.current = setTimeout(syncHash, delay);
    else syncHash();
    if (focus) {
      tabRefs.current[index]?.focus({ preventScroll: true });
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % showcaseProjects.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + showcaseProjects.length) % showcaseProjects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = showcaseProjects.length - 1;
    else return;
    event.preventDefault();
    selectProject(next, true);
  };

  const swipeProject = (direction: -1 | 1) => {
    const top = document.getElementById(`project-image-${current.id}`)?.getBoundingClientRect().top;
    const next = (selected + direction + showcaseProjects.length) % showcaseProjects.length;
    selectProject(next, false, direction);
    requestAnimationFrame(() => {
      // Different wordmarks have different heights: keep the image under the finger.
      const nextTop = document.getElementById(`project-image-${showcaseProjects[next].id}`)?.getBoundingClientRect().top;
      if (top !== undefined && nextTop !== undefined) window.scrollBy({ top: nextTop - top, behavior: "instant" });
    });
  };

  const stepProject = (direction: number) => {
    const next = (selected + direction + showcaseProjects.length) % showcaseProjects.length;
    selectProject(next);
    requestAnimationFrame(() => {
      document.getElementById(`panel-${showcaseProjects[next].id}`)?.focus({ preventScroll: true });
      sectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };

  return (
    <section ref={sectionRef} id="realisations" className="project-showcase project-index" aria-labelledby="showcase-title" data-enhanced={enhanced} data-swipe-direction={swipeDirection} data-project-kind={current.application ? "applications" : "websites"}>
      <div className="site-container">
        <div id="applications" className="anchor-target" />
        <div id="sites-web" className="anchor-target" />
        <div className="section-intro">
          <div><p className="section-kicker">Les réalisations</p><h2 id="showcase-title" className="section-heading">Du concret, à découvrir.</h2></div>
          <p>Des sites pour présenter une activité.<br />Des applications pour faciliter le quotidien.</p>
        </div>
        <div className="project-index-categories" role="group" aria-label="Type de réalisation" hidden={!enhanced}>
          {projectGroups.map((group) => (
            <button key={group.id} id={`project-type-${group.id}`} type="button" className="project-index-category"
              aria-pressed={current.application === group.application}
              onClick={() => { if (current.application !== group.application) selectProject(showcaseProjects.findIndex((project) => project.application === group.application)); }}>
              <span className="studio-ball-label">{group.label}<span className="studio-ball-stop" data-ball-anchor={group.id} aria-hidden="true" /></span>
            </button>
          ))}
        </div>
        <div className="project-index-tabs" role="tablist" aria-label="Choisir une réalisation" hidden={!enhanced}>
          {projectGroups.map((group) => (
            <div key={group.id} className="project-index-group" data-project-group={group.id} role="presentation">
              <div role="presentation">
                {showcaseProjects.map((project, index) => project.application === group.application ? (
                  <button key={project.id} ref={(node) => { tabRefs.current[index] = node; }} id={`tab-${project.id}`} type="button" role="tab"
                    aria-label={project.name} aria-describedby={`project-type-${group.id}`} aria-selected={selected === index}
                    aria-controls={`panel-${project.id}`} tabIndex={selected === index ? 0 : -1}
                    onClick={() => selectProject(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
                    {project.name}
                  </button>
                ) : null)}
              </div>
            </div>
          ))}
        </div>
        <div className="project-index-mobile" hidden={!enhanced}>
          <label htmlFor="project-picker">Choisir une réalisation</label>
          <div className="project-select-wrap">
            <select id="project-picker" aria-label="Choisir une réalisation" value={selected} onChange={(event) => selectProject(Number(event.target.value))} aria-controls={`panel-${current.id}`}>
              {projectGroups.map((group) => <optgroup key={group.id} label={group.label}>
                {showcaseProjects.map((project, index) => project.application === group.application ? <option key={project.id} value={index}>{project.name}</option> : null)}
              </optgroup>)}
            </select>
            <ChevronDown size={18} aria-hidden="true" />
          </div>
        </div>
        <div className="project-stage">
            {showcaseProjects.map((project, index) => (
              <div
                key={project.id}
                id={`panel-${project.id}`}
                role={enhanced ? "tabpanel" : undefined}
                aria-labelledby={enhanced ? `title-${project.id}` : undefined}
                hidden={enhanced && selected !== index}
                data-case-study={caseStudies.some((study) => study.projectId === project.id)}
                tabIndex={enhanced ? 0 : undefined}
                className="project-panel" style={{ "--project-accent": `var(--project-${project.id})` } as CSSProperties}
              >
                <details id={project.id} open={selected === index}>
                  <summary className="project-fallback-summary">{project.name}</summary>
                  <article className="project-panel-body" aria-labelledby={`title-${project.id}`}>
                    <header className="project-panel-heading">
                      <p className="project-category">{project.category}</p>
                      <h3 id={`title-${project.id}`} className={project.application ? `project-wordmark project-wordmark--${project.id}` : undefined}>
                        {project.id === "selfcamp" ? <Image src="/brands/selfcamp.png" alt="Selfcamp" width={4500} height={4500} sizes="205px" />
                          : project.id === "openwind" ? <Image src="/brands/openwind.png" alt="Openwind" width={2000} height={300} sizes="240px" />
                          : project.id === "mypapers" ? <Image src="/brands/mypapers.svg" alt="Mypapers" width={558} height={160} />
                          : project.name}
                      </h3>
                      <ProjectLink href={project.url} name={project.name} category={project.category} application={project.application} showArrow={false}>
                        {project.application ? `Ouvrir ${project.name}` : `Visiter ${project.name}`}
                      </ProjectLink>
                    </header>
                    <div className="project-panel-preview">
                      <ProjectScreenshot key={selected === index ? "active" : "inactive"} projectId={project.id} projectName={project.name} priority={index === 0} onNavigate={swipeProject} />
                    </div>
                    <div className="project-panel-summary">
                      <p>{projectPresentations[project.id].description}</p>
                      <p className="project-contribution"><span>Notre contribution</span>{projectContributions[project.id]}</p>
                      <ul className="project-capabilities" aria-label={`Fonctionnalités de ${project.name}`}>
                        {projectPresentations[project.id].features.map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
                      {(project.id === "openwind" || project.id === "mypapers") && <p className="showcase-partner"><AppStoreBadge app={project.id} /></p>}
                      {project.id === "selfcamp" && <p className="showcase-partner">En collaboration avec <a href="https://fribourg.ch/fr/uft-ftv/" target="_blank" rel="noopener noreferrer">l’Union fribourgeoise du Tourisme</a>.</p>}
                      {"year" in project && <p className="project-year">Réalisation {project.year}</p>}
                      <ProjectContactLink section="realisation" project={project.name}>Parlons de votre besoin</ProjectContactLink>
                    </div>
                  </article>
                  <ProjectCaseStudy projectId={project.id} projectName={project.name} application={project.application} />
                </details>
              </div>
            ))}
        </div>
        <nav className="project-index-pagination" aria-label="Parcourir les réalisations" hidden={!enhanced}>
          <button type="button" onClick={() => stepProject(-1)} aria-label={`Projet précédent : ${showcaseProjects[(selected + showcaseProjects.length - 1) % showcaseProjects.length].name}`}>Précédent</button>
          <p aria-live="polite" aria-atomic="true"><span className="visually-hidden">{current.name}, projet </span>{String(selected + 1).padStart(2, "0")}<span aria-hidden="true"> / </span><span className="visually-hidden"> sur </span>{String(showcaseProjects.length).padStart(2, "0")}</p>
          <button type="button" onClick={() => stepProject(1)} aria-label={`Projet suivant : ${showcaseProjects[(selected + 1) % showcaseProjects.length].name}`}>Suivant</button>
        </nav>
      </div>
    </section>
  );
}
