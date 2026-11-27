"use client";

import { useEffect, useRef } from "react";
import { chooseBallRoute, createBallEntrance, createBallFlight, restingPose, sampleBallFlight, selectBallStop, type BallFlight, type BallPose, type BallRoute, type BallStop } from "@/lib/studio-ball";

export function StudioBall() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ball = ref.current;
    const site = ball?.closest<HTMLElement>(".studio-site");
    const portfolio = site?.querySelector<HTMLElement>(".project-index");
    if (!ball || !site || !portfolio) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    let entrancePlayed = false;

    const start = () => {
      dispose();
      site.removeAttribute("data-ball-ready");
      ball.style.opacity = "0";
      if (motion.matches) return;

      let stopped = false;
      let frame = 0;
      let measureFrame = 0;
      let stops: BallStop[] = [];
      let size = 10;
      let gutter = 20;
      let headerBottom = 80;
      let destination: BallStop | null = null;
      let lastPose: BallPose | null = null;
      let flight: { plan: BallFlight; start: number } | null = null;
      let previousRoute: BallRoute | null = null;

      const anchor = (id: string): BallStop | null => {
        const node = site.querySelector<HTMLElement>(`[data-ball-anchor="${id}"]`);
        if (!node || !node.getClientRects().length) return null;
        const rect = node.getBoundingClientRect();
        return { id, x: rect.left + rect.width / 2, y: rect.top + window.scrollY + rect.height / 2 };
      };
      const draw = (pose: BallPose) => {
        const y = pose.y - window.scrollY;
        const top = flight?.plan.entry ? 1 : Math.max(0, Math.min(1, (y - headerBottom - 5) / 14));
        const bottom = Math.max(0, Math.min(1, (window.innerHeight - y - size) / 14));
        ball.style.transform = `translate3d(${pose.x - size / 2}px, ${y - size / 2}px, 0) scale(${pose.scaleX}, ${pose.scaleY})`;
        ball.style.opacity = String(top * bottom);
        ball.dataset.stage = pose.stage;
        ball.dataset.motion = flight ? (flight.plan.entry ? "entrance" : "flight") : "rest";
        ball.dataset.route = String(flight?.plan.route ?? previousRoute ?? 0);
        lastPose = pose;
      };
      const paint = (now: number) => {
        frame = 0;
        if (stopped) return;
        if (flight) {
          const elapsed = now - flight.start;
          const pose = sampleBallFlight(flight.plan, elapsed);
          if (elapsed >= flight.plan.duration) flight = null;
          draw(pose);
          if (flight) frame = requestAnimationFrame(paint);
        } else if (destination) draw(restingPose(destination));
      };
      const requestPaint = () => { if (!frame) frame = requestAnimationFrame(paint); };
      const launch = (target: BallStop, categoryHop: boolean) => {
        const now = performance.now();
        let from = flight ? sampleBallFlight(flight.plan, now - flight.start) : lastPose;
        if (!from) { destination = target; draw(restingPose(target)); return; }
        const y = from.y - window.scrollY;
        if (y < headerBottom + 12 || y > window.innerHeight - 20) {
          // A fast scroll re-enters quietly from the margin, rather than flying across copy.
          from = { ...from, x: gutter, y: window.scrollY + headerBottom + 22, velocityX: 0, velocityY: 0 };
        }
        const route = flight && target.id === destination?.id ? flight.plan.route : chooseBallRoute(previousRoute);
        previousRoute = route;
        flight = { plan: createBallFlight(from, target, document.documentElement.clientWidth, categoryHop, route), start: now };
        destination = target;
        requestPaint();
      };
      const syncTarget = (animate: boolean, reset = false) => {
        const target = selectBallStop(stops, window.scrollY, window.innerHeight, destination?.id);
        if (!target) return;
        if (!destination || reset || !lastPose) {
          flight = null;
          destination = target;
          draw(restingPose(target));
        } else if (target.id !== destination.id) {
          const categoryHop = ["applications", "websites"].includes(destination.id) && ["applications", "websites"].includes(target.id);
          if (animate) launch(target, categoryHop);
          else { flight = null; destination = target; draw(restingPose(target)); }
        } else if (Math.hypot(target.x - destination.x, target.y - destination.y) > 1) {
          if (flight) launch(target, false);
          else { destination = target; draw(restingPose(target)); }
        } else requestPaint();
      };
      const measure = (animate = false, reset = false) => {
        if (stopped) return;
        const category = portfolio.dataset.projectKind ?? "applications";
        size = site.querySelector<HTMLElement>('[data-ball-anchor="hero"]')?.getBoundingClientRect().width || 10;
        const container = site.querySelector<HTMLElement>(".home-hero .site-container");
        const inset = container ? container.getBoundingClientRect().left + parseFloat(getComputedStyle(container).paddingLeft) : 24;
        gutter = Math.max(size / 2 + 2, inset * 0.45);
        headerBottom = site.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 80;
        stops = [anchor("hero"), anchor(category), anchor("studio"), anchor("method"), anchor("contact"), anchor("footer")].filter((stop): stop is BallStop => stop !== null);
        const firstMeasure = !destination;
        syncTarget(animate, reset);
        site.setAttribute("data-ball-ready", "true");
        if (firstMeasure && !entrancePlayed) {
          entrancePlayed = true;
          const hero = stops[0];
          if (window.scrollY <= 8 && hero?.id === "hero") {
            flight = { plan: createBallEntrance(hero, document.documentElement.clientWidth), start: performance.now() };
            draw(sampleBallFlight(flight.plan, 0));
            requestPaint();
          }
        }
      };
      const onScroll = () => syncTarget(true);
      const onLayout = () => {
        if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure(); });
      };
      const onResize = () => {
        if (measureFrame) cancelAnimationFrame(measureFrame);
        measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure(false, true); });
      };
      const resize = new ResizeObserver(onLayout);
      resize.observe(site.querySelector("main") ?? site);
      resize.observe(site.querySelector("footer") ?? site);
      const selection = new MutationObserver(() => measure(true));
      selection.observe(portfolio, { attributes: true, attributeFilter: ["data-project-kind", "data-enhanced"] });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      site.addEventListener("animationend", onLayout);
      measure();
      void document.fonts.ready.then(() => { if (!stopped) measure(); });

      dispose = () => {
        stopped = true;
        cancelAnimationFrame(frame);
        cancelAnimationFrame(measureFrame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        site.removeEventListener("animationend", onLayout);
        resize.disconnect();
        selection.disconnect();
      };
    };
    start();
    motion.addEventListener("change", start);
    return () => { dispose(); motion.removeEventListener("change", start); site.removeAttribute("data-ball-ready"); };
  }, []);

  return <span ref={ref} className="studio-ball" aria-hidden="true" />;
}
