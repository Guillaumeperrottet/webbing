"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { showcaseProjects } from "@/data/portfolio";
import { ProjectContactLink, ProjectLink } from "@/components/project-link";
import { ProjectPreview } from "@/components/project-preview";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectCaseStudy } from "@/components/project-case-study";
import { caseStudies } from "@/data/case-studies";
import { DemoPlaybackProvider } from "@/components/demo-playback";

const sectionAliases: Record<string, number> = {
  realisations: 0,
  applications: 0,
  "sites-web": showcaseProjects.findIndex((project) => !project.application),
};

const applicationCount = showcaseProjects.filter((project) => project.application).length;
const folderDepth = (index: number, selected: number) => index === selected ? 0 : index < selected ? index + 1 : index;
const folderDuration = (node: Element) => {
  const value = getComputedStyle(node).getPropertyValue("--dur-folder").trim();
  return parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
};

function FolderGroup({ id, label, first, count, selected, enhanced }: { id: string; label: string; first: number; count: number; selected: number; enhanced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const previousHeights = useRef<number[]>([]);

  useLayoutEffect(() => {
    if (!enhanced || !ref.current) return;
    // Non-scaling strokes use screen-space dash lengths, even when the SVG stretches.
    const measureInk = () => ref.current?.querySelectorAll<SVGPathElement>("path").forEach((path) => {
      const matrix = path.getScreenCTM();
      if (!matrix) return;
      const length = path.getTotalLength();
      let previous = path.getPointAtLength(0).matrixTransform(matrix);
      let renderedLength = 0;
      for (let sample = 1; sample <= 64; sample++) {
        const point = path.getPointAtLength(length * sample / 64).matrixTransform(matrix);
        renderedLength += Math.hypot(point.x - previous.x, point.y - previous.y);
        previous = point;
      }
      path.style.setProperty("--ink-length", String(Math.ceil(renderedLength) + 1));
    });
    measureInk();
    const hooks = [...ref.current.querySelectorAll<HTMLElement>(".folder-group-hook")];
    const heights = hooks.map((hook) => hook.getBoundingClientRect().height);
    const before = previousHeights.current;
    previousHeights.current = heights;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const duration = folderDuration(ref.current);
    const animations: Animation[] = [];

    if (!media.matches) hooks.forEach((hook, index) => {
      const from = before[index];
      const to = heights[index];
      if (!from || !to || Math.abs(from - to) < 0.5) return;
      const options = { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };
      const shaft = hook.querySelector(".folder-hook-shaft");
      const tip = hook.querySelector(".folder-hook-tip");
      if (shaft) animations.push(shaft.animate([{ transform: `scaleY(${from / to})` }, { transform: "scaleY(1)" }], options));
      if (tip) animations.push(tip.animate([{ transform: `translateY(${from - to}px)` }, { transform: "translateY(0)" }], options));
    });

    const stop = () => animations.forEach((animation) => animation.cancel());
    const onMotionChange = () => { if (media.matches) stop(); };
    const onResize = () => {
      stop();
      measureInk();
      previousHeights.current = hooks.map((hook) => hook.getBoundingClientRect().height);
    };
    window.addEventListener("resize", onResize);
    media.addEventListener("change", onMotionChange);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      media.removeEventListener("change", onMotionChange);
    };
  }, [selected, enhanced]);

  const style = {
    gridColumn: `${first + 1} / span ${count}`,
    "--group-count": count,
  } as CSSProperties;

  return (
    <div ref={ref} className={`folder-group folder-group--${id}`} style={style}>
      <p id={`folder-type-${id}`}>{label}</p>
      <div aria-hidden="true">
        <svg className="folder-brace-line" viewBox="0 0 100 16" preserveAspectRatio="none" fill="none">
          <path d="M0 14V9Q0 5 4 5C32 4 67 6 96 5Q100 5 100 9V14" vectorEffect="non-scaling-stroke" />
        </svg>
        {[first, first + count - 1].map((index, endpoint) => (
          <span key={index} className={`folder-group-hook folder-group-hook--${endpoint === 0 ? "first" : "last"}`} style={{ "--hook-depth": folderDepth(index, selected) } as CSSProperties}>
            <svg className="folder-hook-shaft" viewBox="0 0 12 100" preserveAspectRatio="none" fill="none"><path d="M6 0C5 34 7 68 6 100" vectorEffect="non-scaling-stroke" /></svg>
            <svg className="folder-hook-tip" viewBox="0 0 12 9" fill="none"><path d="M2 2L6 7L10 2" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

function FolderLabel({ id, name }: { id: string; name: string }) {
  if (id === "selfcamp") return <>Self<wbr />Camp</>;
  if (id === "openwind") return <>Open<wbr />Wind</>;
  if (id === "coachingbymarie") return <>Coach<wbr />ing<wbr />by<wbr />marie</>;
  if (id === "plannikeeper") return <>Planni<wbr />Keeper</>;
  if (id === "graphomouv") return <>Grapho<wbr />mouv</>;
  return <>{name}</>;
}

export function ProjectShowcase() {
  const [{ selected, settled, revision }, setSelection] = useState({ selected: 0, settled: true, revision: 0 });
  const chooseProject = useCallback((index: number) => {
    setSelection((current) => current.selected === index ? current : { selected: index, settled: false, revision: current.revision + 1 });
  }, []);
  const [enhanced, setEnhanced] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const binderRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const frontMotionRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const previousSelection = useRef(selected);
  const hashUpdate = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHashUpdate = useRef(0);

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
      chooseProject(index);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const studyDetails = study ? document.getElementById(study.id) : null;
        if (studyDetails instanceof HTMLDetailsElement) {
          studyDetails.open = true;
          studyDetails.scrollIntoView({ block: "start", behavior: "instant" });
        } else {
          sectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
          tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
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
  }, [chooseProject]);

  useEffect(() => {
    const binder = binderRef.current;
    if (!binder) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNotesVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(binder);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    let disposed = false;
    const settle = () => {
      if (disposed) return;
      setSelection((current) => current.revision === revision && !current.settled ? { ...current, settled: true } : current);
    };
    if (previousSelection.current === selected) {
      settle();
      return;
    }
    const from = previousSelection.current;
    previousSelection.current = selected;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      settle();
      return;
    }
    const style = getComputedStyle(binderRef.current!);
    const pull = parseFloat(style.getPropertyValue("--folder-pull"));
    const duration = folderDuration(binderRef.current!);
    const options = { duration, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };
    const targets = [frontMotionRef.current, tabRefs.current[selected]];
    const animations = targets.flatMap((target) => target ? [target.animate([
      { transform: "translateY(0)" },
      { transform: `translateY(${-pull}px)`, offset: 0.35 },
      { transform: "translateY(0)" },
    ], options)] : []);
    if (binderRef.current && frontRef.current) {
      const style = getComputedStyle(binderRef.current);
      const depth = selected < from ? selected + 1 : selected;
      const step = parseFloat(style.getPropertyValue("--folder-step"));
      const shrink = parseFloat(style.getPropertyValue("--folder-shrink"));
      animations.push(frontRef.current.animate([
        { transform: `translateY(${-depth * step}px) scale(${1 - depth * shrink})` },
        { transform: "translateY(0) scale(1)" },
      ], options));
    }
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(settle);
    const stop = () => {
      animations.forEach((animation) => animation.cancel());
      settle();
    };
    const cancel = () => { if (media.matches) stop(); };
    const stopOnResize = stop;
    media.addEventListener("change", cancel);
    window.addEventListener("resize", stopOnResize);
    return () => {
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener("change", cancel);
      window.removeEventListener("resize", stopOnResize);
    };
  }, [selected, revision]);

  const selectProject = (index: number, focus = false) => {
    chooseProject(index);
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
      tabRefs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
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

  const folderStyle = (index: number): CSSProperties => {
    const depth = folderDepth(index, selected);
    return {
      "--project-accent": `var(--project-${showcaseProjects[index].id})`,
      "--folder-depth": depth,
      "--folder-center-offset": (showcaseProjects.length - 1) / 2 - index,
      "--folder-paper": `var(--folder-paper-${Math.min(3, Math.ceil(depth / 3)) || 1})`,
    } as CSSProperties;
  };

  return (
    <DemoPlaybackProvider settled={settled}>
    <section ref={sectionRef} id="realisations" className="project-showcase" aria-labelledby="showcase-title" data-enhanced={enhanced} data-js={enhanced ? "true" : undefined} data-sheet-settled={settled}>
      <div className="site-container">
        <div id="applications" className="anchor-target" />
        <div id="sites-web" className="anchor-target" />
        <h2 id="showcase-title" className="visually-hidden">Nos réalisations, en action.</h2>
        <div className="showcase-shell">
          <div ref={binderRef} className="project-binder" data-notes-visible={notesVisible} style={{ "--folder-count": showcaseProjects.length } as CSSProperties}>
            <div className="folder-groups" role="group" aria-label="Types de réalisations">
              <FolderGroup id="applications" label="Applications web" first={0} count={applicationCount} selected={selected} enhanced={enhanced} />
              <FolderGroup id="websites" label="Sites web" first={applicationCount} count={showcaseProjects.length - applicationCount} selected={selected} enhanced={enhanced} />
            </div>
            <div className="folder-sheets" aria-hidden="true">
              {showcaseProjects.map((project, index) => <div key={project.id} className="folder-sheet" data-front={selected === index} style={folderStyle(index)} />)}
            </div>
          <div className="project-tabs" role="tablist" aria-label="Choisir une réalisation">
            {showcaseProjects.map((project, index) => (
              <div key={project.id} className="folder-tab-slot" role="presentation" style={folderStyle(index)}>
              <button
                ref={(node) => { tabRefs.current[index] = node; }}
                id={`tab-${project.id}`}
                type="button"
                role="tab"
                aria-label={project.name}
                aria-describedby={`folder-type-${project.application ? "applications" : "websites"}`}
                data-project-type={project.application ? "application" : "website"}
                aria-selected={selected === index}
                aria-controls={`panel-${project.id}`}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => selectProject(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className="folder-tab-label"><FolderLabel id={project.id} name={project.name} /></span>
              </button>
              </div>
            ))}
          </div>

          <div ref={frontMotionRef} className="binder-front-motion">
          <div ref={frontRef} className="showcase-frame">
            <nav className="project-mobile-navigation" aria-label="Parcourir les réalisations">
              <button
                type="button"
                aria-label={`Projet précédent : ${showcaseProjects[(selected + showcaseProjects.length - 1) % showcaseProjects.length].name}`}
                aria-controls={`panel-${showcaseProjects[(selected + showcaseProjects.length - 1) % showcaseProjects.length].id}`}
                onClick={() => selectProject((selected + showcaseProjects.length - 1) % showcaseProjects.length)}
              >
                <ChevronLeft size={18} aria-hidden="true" /><span>Précédent</span>
              </button>
              <p aria-live="polite" aria-atomic="true">
                <span className="project-current-name"><FolderLabel id={showcaseProjects[selected].id} name={showcaseProjects[selected].name} /></span>
                <span className="project-position"><span className="visually-hidden">Projet </span>{selected + 1}<span aria-hidden="true"> / </span><span className="visually-hidden"> sur </span>{showcaseProjects.length}</span>
              </p>
              <button
                type="button"
                aria-label={`Projet suivant : ${showcaseProjects[(selected + 1) % showcaseProjects.length].name}`}
                aria-controls={`panel-${showcaseProjects[(selected + 1) % showcaseProjects.length].id}`}
                onClick={() => selectProject((selected + 1) % showcaseProjects.length)}
              >
                <span>Suivant</span><ChevronRight size={18} aria-hidden="true" />
              </button>
            </nav>
            {showcaseProjects.map((project, index) => (
              <div
                key={project.id}
                id={`panel-${project.id}`}
                role={enhanced ? "tabpanel" : undefined}
                aria-labelledby={enhanced ? `tab-${project.id}` : undefined}
                hidden={enhanced && selected !== index}
                data-case-study={caseStudies.some((study) => study.projectId === project.id)}
                tabIndex={enhanced ? 0 : undefined}
                className="project-panel" style={{ "--project-accent": `var(--project-${project.id})` } as CSSProperties}
              >
                <details id={project.id} open={selected === index}>
                  <summary className="project-fallback-summary">{project.name}</summary>
                  <article className="project-panel-body" aria-labelledby={`title-${project.id}`}>
                    <header className="project-panel-heading">
                      <h3 id={`title-${project.id}`}>{project.name}</h3>
                      <ProjectLink href={project.url} name={project.name} category={project.category} application={project.application}>
                        {project.application ? `Ouvrir ${project.name}` : `Visiter ${project.name}`}
                      </ProjectLink>
                    </header>
                    <p className="project-service project-panel-benefit">{project.benefit}</p>
                    <div className="project-panel-preview">
                      <ProjectPreview name={project.name} screens={project.screens} priority={index === 0} active={!enhanced || selected === index} demo={project.id} />
                    </div>
                    <div className="project-panel-summary">
                      <p>{project.description}</p>
                      <ul className="project-capabilities" aria-label={`Fonctionnalités de ${project.name}`}>
                        {project.features.map((feature) => <li key={feature}>{feature}</li>)}
                      </ul>
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
          </div>
            <span className="binder-holes" aria-hidden="true"><span /><span /></span>
          </div>
        </div>
      </div>
    </section>
    </DemoPlaybackProvider>
  );
}
