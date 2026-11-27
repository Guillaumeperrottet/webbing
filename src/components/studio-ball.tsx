"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BALL_IDLE_DELAY, chooseBallRoute, createBallIdleHop, createBallEntrance, createBallFlight, createMethodBallFlight, METHOD_DOT_FALL_DURATION, restingPose, sampleBallFlight, sampleMethodDotFall, selectBallStop, type BallFlight, type BallPose, type BallRoute, type BallStop } from "@/lib/studio-ball";

const StudioPlayground = dynamic(() => import("./studio-playground"), { ssr: false });

export function StudioBall() {
  const ref = useRef<HTMLButtonElement>(null);
  const resume = useRef(() => {});
  const [secretOpen, setSecretOpen] = useState(false);

  useEffect(() => {
    const ball = ref.current;
    const site = ball?.closest<HTMLElement>(".studio-site");
    const portfolio = site?.querySelector<HTMLElement>(".project-index");
    if (!ball || !site || !portfolio) return;
    const methodDot = site.querySelector<HTMLElement>("[data-method-dot]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose = () => {};
    let entrancePlayed = false;

    const start = () => {
      dispose();
      site.removeAttribute("data-ball-ready");
      ball.style.opacity = "0";
      let stopped = false;
      let suspended = false;
      let grab: { id: number; dx: number; dy: number } | null = null;
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
      let idleTimer: ReturnType<typeof setTimeout> | null = null;
      const clearIdleTimer = () => {
        if (idleTimer !== null) clearTimeout(idleTimer);
        idleTimer = null;
      };
      const canIdle = () => {
        if (stopped || suspended || grab || motion.matches || document.hidden || document.activeElement === ball || flight || dotFall || !destination) return false;
        const y = destination.y - window.scrollY;
        return y >= headerBottom + size && y <= window.innerHeight - size * 2;
      };
      const scheduleIdle = () => {
        if (idleTimer !== null || !canIdle()) return;
        idleTimer = setTimeout(() => {
          idleTimer = null;
          if (!canIdle() || !destination) return;
          flight = { plan: createBallIdleHop(destination, document.documentElement.clientWidth), start: performance.now() };
          requestPaint();
        }, BALL_IDLE_DELAY);
      };
      let dotState: "present" | "falling" | "replaced" = "present";
      let dotFall: { start: number; direction: number } | null = null;
      const restoreMethodDot = () => {
        dotState = "present";
        dotFall = null;
        methodDot?.style.removeProperty("transform");
        methodDot?.style.removeProperty("opacity");
        site.dataset.methodPeriod = "present";
      };
      const resetMethodDotIfHidden = () => {
        const stop = stops.find((entry) => entry.id === "method");
        if (dotState === "present" || destination?.id === "method" || !stop) return;
        const y = stop.y - window.scrollY;
        if (y < headerBottom - size || y > window.innerHeight + size) restoreMethodDot();
      };

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
        ball.style.pointerEvents = top * bottom > 0.5 ? "auto" : "none";
        ball.tabIndex = top * bottom > 0.5 ? 0 : -1;
        ball.dataset.stage = pose.stage;
        ball.dataset.motion = flight ? (flight.plan.idle ? "idle" : flight.plan.entry ? "entrance" : "flight") : "rest";
        ball.dataset.route = String(flight?.plan.route ?? previousRoute ?? 0);
        lastPose = pose;
      };
      const paint = (now: number) => {
        frame = 0;
        if (stopped || suspended || grab) return;
        if (flight) {
          const elapsed = now - flight.start;
          const collision = flight.plan.collision;
          if (methodDot && collision && elapsed >= collision.impactAt && dotState === "present") {
            dotState = "falling";
            dotFall = { start: flight.start + collision.impactAt, direction: -Math.sign(collision.side) || 1 };
            site.dataset.methodPeriod = "falling";
          }
          const pose = sampleBallFlight(flight.plan, elapsed);
          if (elapsed >= flight.plan.duration) flight = null;
          draw(pose);
        } else if (destination) draw(restingPose(destination));
        if (dotFall && methodDot) {
          const elapsed = now - dotFall.start;
          const pose = sampleMethodDotFall(elapsed, dotFall.direction);
          methodDot.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0)`;
          methodDot.style.opacity = String(pose.opacity);
          if (elapsed >= METHOD_DOT_FALL_DURATION) {
            dotFall = null;
            dotState = "replaced";
            site.dataset.methodPeriod = "replaced";
          }
        }
        if (flight || dotFall) frame = requestAnimationFrame(paint);
        else scheduleIdle();
      };
      const requestPaint = () => { if (!frame) frame = requestAnimationFrame(paint); };
      const launch = (target: BallStop, categoryHop: boolean) => {
        clearIdleTimer();
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
        const plan = target.id === "method" && methodDot && dotState === "present"
          ? createMethodBallFlight(from, target, document.documentElement.clientWidth, route)
          : createBallFlight(from, target, document.documentElement.clientWidth, categoryHop, route);
        flight = { plan, start: now };
        destination = target;
        requestPaint();
      };
      const syncTarget = (animate: boolean, reset = false) => {
        if (suspended || grab) return;
        const target = selectBallStop(stops, window.scrollY, window.innerHeight, destination?.id);
        if (!target) return;
        if (!destination || reset || !lastPose) {
          clearIdleTimer();
          flight = null;
          destination = target;
          if (reset && target.id === "method" && methodDot) {
            dotFall = null;
            dotState = "replaced";
            methodDot.style.opacity = "0";
            site.dataset.methodPeriod = "replaced";
          }
          draw(restingPose(target));
        } else if (target.id !== destination.id) {
          clearIdleTimer();
          const categoryHop = ["applications", "websites"].includes(destination.id) && ["applications", "websites"].includes(target.id);
          if (animate && !motion.matches) launch(target, categoryHop);
          else { flight = null; destination = target; draw(restingPose(target)); }
        } else if (Math.hypot(target.x - destination.x, target.y - destination.y) > 1) {
          clearIdleTimer();
          if (flight) launch(target, false);
          else { destination = target; draw(restingPose(target)); }
        } else requestPaint();
      };
      const measure = (animate = false, reset = false) => {
        if (stopped || suspended || grab) return;
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
        resetMethodDotIfHidden();
        if (firstMeasure && !motion.matches && destination?.id === "method" && methodDot) {
          lastPose = restingPose({ ...destination, x: gutter, y: window.scrollY + headerBottom + 22 });
          draw(lastPose);
          launch(destination, false);
        }
        if (firstMeasure && !entrancePlayed) {
          entrancePlayed = true;
          const hero = stops[0];
          if (!motion.matches && window.scrollY <= 8 && hero?.id === "hero") {
            flight = { plan: createBallEntrance(hero, document.documentElement.clientWidth), start: performance.now() };
            draw(sampleBallFlight(flight.plan, 0));
            requestPaint();
          }
        }
      };
      const onScroll = () => {
        if (suspended || grab) return;
        clearIdleTimer();
        syncTarget(true);
        if (flight?.plan.idle && destination) {
          flight = null;
          draw(restingPose(destination));
        }
        resetMethodDotIfHidden();
        scheduleIdle();
      };
      const onVisibility = () => {
        if (document.hidden && grab) cancelGrab();
        clearIdleTimer();
        if (flight?.plan.idle && destination) {
          flight = null;
          draw(restingPose(destination));
        }
        if (!document.hidden) { requestPaint(); scheduleIdle(); }
      };
      const resumeBall = () => {
        suspended = false; grab = null;
        delete ball.dataset.held;
        measure(false, true); scheduleIdle();
      };
      resume.current = resumeBall;
      const cancelGrab = () => {
        const id = grab?.id; grab = null;
        if (id !== undefined && ball.hasPointerCapture(id)) ball.releasePointerCapture(id);
        resumeBall();
      };
      const revealSecret = () => {
        clearIdleTimer(); cancelAnimationFrame(frame); frame = 0;
        suspended = true; flight = null;
        ball.style.opacity = "0"; ball.style.pointerEvents = "none";
        setSecretOpen(true);
      };
      const onGrab = (event: PointerEvent) => {
        if (!event.isPrimary || event.button !== 0 || suspended || grab || Number(ball.style.opacity) < 0.5) return;
        event.preventDefault();
        const rect = ball.getBoundingClientRect();
        grab = { id: event.pointerId, dx: event.clientX - rect.left - rect.width / 2, dy: event.clientY - rect.top - rect.height / 2 };
        clearIdleTimer(); cancelAnimationFrame(frame); frame = 0; flight = null;
        if (dotFall) restoreMethodDot();
        ball.setPointerCapture(event.pointerId); ball.dataset.held = "true"; ball.dataset.motion = "held";
      };
      const onDrag = (event: PointerEvent) => {
        if (!grab || event.pointerId !== grab.id) return;
        const x = Math.max(size / 2, Math.min(document.documentElement.clientWidth - size / 2, event.clientX - grab.dx));
        const y = Math.max(size / 2, Math.min(window.innerHeight - size / 2, event.clientY - grab.dy));
        ball.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      };
      const onRelease = (event: PointerEvent) => {
        if (!grab || event.pointerId !== grab.id) return;
        grab = null;
        if (ball.hasPointerCapture(event.pointerId)) ball.releasePointerCapture(event.pointerId);
        revealSecret();
      };
      const onCancel = (event: PointerEvent) => { if (grab?.id === event.pointerId) cancelGrab(); };
      const onKey = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault(); revealSecret();
      };
      const onLayout = () => {
        if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure(); scheduleIdle(); });
      };
      const onResize = () => {
        clearIdleTimer();
        if (measureFrame) cancelAnimationFrame(measureFrame);
        measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure(false, true); scheduleIdle(); });
      };
      const resize = new ResizeObserver(onLayout);
      resize.observe(site.querySelector("main") ?? site);
      resize.observe(site.querySelector("footer") ?? site);
      const selection = new MutationObserver(() => measure(true));
      selection.observe(portfolio, { attributes: true, attributeFilter: ["data-project-kind", "data-enhanced"] });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      ball.addEventListener("pointerdown", onGrab); ball.addEventListener("pointermove", onDrag);
      ball.addEventListener("pointerup", onRelease); ball.addEventListener("pointercancel", onCancel); ball.addEventListener("lostpointercapture", onCancel);
      ball.addEventListener("keydown", onKey); ball.addEventListener("focus", clearIdleTimer); ball.addEventListener("blur", scheduleIdle);
      site.addEventListener("animationend", onLayout);
      measure();
      scheduleIdle();
      void document.fonts.ready.then(() => { if (!stopped) { measure(); scheduleIdle(); } });

      dispose = () => {
        stopped = true;
        resume.current = () => {};
        clearIdleTimer();
        cancelAnimationFrame(frame);
        cancelAnimationFrame(measureFrame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        ball.removeEventListener("pointerdown", onGrab); ball.removeEventListener("pointermove", onDrag);
        ball.removeEventListener("pointerup", onRelease); ball.removeEventListener("pointercancel", onCancel); ball.removeEventListener("lostpointercapture", onCancel);
        ball.removeEventListener("keydown", onKey); ball.removeEventListener("focus", clearIdleTimer); ball.removeEventListener("blur", scheduleIdle);
        site.removeEventListener("animationend", onLayout);
        resize.disconnect();
        selection.disconnect();
        restoreMethodDot();
        site.removeAttribute("data-method-period");
      };
    };
    start();
    motion.addEventListener("change", start);
    return () => { dispose(); motion.removeEventListener("change", start); site.removeAttribute("data-ball-ready"); };
  }, []);

  return <><button ref={ref} type="button" tabIndex={-1} className="studio-ball" aria-label="Attraper la balle rose" aria-haspopup="dialog" aria-expanded={secretOpen} />
    {secretOpen && <StudioPlayground onClose={() => { setSecretOpen(false); resume.current(); requestAnimationFrame(() => ref.current?.focus({ preventScroll: true })); }} />}
  </>;
}
