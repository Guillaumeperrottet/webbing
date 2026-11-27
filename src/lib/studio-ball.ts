export type BallPoint = { x: number; y: number };
export type BallStop = BallPoint & { id: string };
export type BallPose = BallPoint & { scaleX: number; scaleY: number; stage: string; velocityX: number; velocityY: number };
export type BallRoute = 0 | 1 | 2 | 3 | 4;
export type BallFlight = { from: BallPoint; duration: number; target: BallStop; height: number; sway: number; curl: number; waves: number; viaX: number | null; route: BallRoute; velocityX: number; velocityY: number; entry?: { fallDuration: number; bounces: readonly { height: number; duration: number }[] } };

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
export const restingPose = (stop: BallStop): BallPose => ({ x: stop.x, y: stop.y, scaleX: 1, scaleY: 1, stage: stop.id, velocityX: 0, velocityY: 0 });

/** Choose once per journey, never twice in a row; sampling a flight stays deterministic. */
export function chooseBallRoute(previous: BallRoute | null, random = Math.random()): BallRoute {
  const choice = Math.floor(Math.max(0, Math.min(0.999999, random)) * (previous === null ? 5 : 4));
  return (previous !== null && choice >= previous ? choice + 1 : choice) as BallRoute;
}

const ROUTES = [
  { sway: 1, curl: 1, waves: 2, height: 1, pace: 1 },
  { sway: -1, curl: 1.35, waves: 2, height: 1.15, pace: 1.05 },
  { sway: 0, curl: 0.6, waves: 2, height: 1.1, pace: 1.08 },
  { sway: 0, curl: 1.5, waves: 2, height: 0.95, pace: 1.04 },
  { sway: 0.9, curl: 1.2, waves: 4, height: 1.2, pace: 1.06 },
] as const;

/** Scroll chooses the destination, never the flight's clock. Hysteresis avoids fidgeting. */
export function selectBallStop(stops: readonly BallStop[], scrollY: number, viewportHeight: number, currentId?: string): BallStop | null {
  if (!stops.length) return null;
  if (scrollY <= 8) return stops[0];
  const portrait = stops.find((stop) => stop.id === "studio");
  const portraitY = portrait ? portrait.y - scrollY : -1;
  // Preserve the joke in both scroll directions, including on a tall viewport.
  if (portrait && portraitY > viewportHeight * 0.24 && portraitY <= viewportHeight * 0.68) return portrait;
  let index = Math.max(0, stops.findIndex((stop) => stop.id === currentId));
  while (index + 1 < stops.length && stops[index + 1].y - scrollY <= viewportHeight * (stops[index + 1].id === "footer" ? 0.82 : 0.68)) {
    index++;
  }
  while (index > 0 && stops[index].y - scrollY > viewportHeight * (stops[index].id === "footer" ? 0.94 : index === 1 ? 0.78 : 0.86)) index--;
  return stops[index];
}

/** Gentle curved detours between sections; a direct route beside the contact form. */
export function createBallFlight(from: BallPoint & Partial<Pick<BallPose, "velocityX" | "velocityY">>, target: BallStop, viewportWidth: number, categoryHop = false, route: BallRoute = 0): BallFlight {
  const mobile = viewportWidth <= 640;
  const distance = Math.hypot(target.x - from.x, target.y - from.y);
  const playful = !categoryHop && !["contact", "footer"].includes(target.id);
  const profile = ROUTES[route];
  const duration = categoryHop ? Math.min(1100, Math.max(800, distance * 1.6)) : Math.min(2300, Math.max(1400, 1150 + Math.sqrt(distance) * 23));
  const height = target.id === "studio" ? (mobile ? 30 : 42) : categoryHop ? (mobile ? 30 : 54) : (mobile ? 46 : 70);
  return {
    from, target,
    duration: Math.min(categoryHop ? 1100 : 2450, duration * profile.pace),
    height: height * profile.height,
    sway: playful ? Math.min(mobile ? 72 : 210, Math.max(0, Math.min(from.x, target.x, viewportWidth - from.x, viewportWidth - target.x) - 14)) * (target.id === "studio" ? 1 : -1) * profile.sway : 0,
    curl: playful ? (mobile ? 14 : 26) * profile.curl : 0,
    waves: profile.waves,
    viaX: !playful ? null : route === 2 ? Math.max(14, Math.min(from.x, target.x) * 0.2) : route === 3 ? Math.min(viewportWidth - 14, Math.max(from.x, target.x) + (mobile ? 64 : 200)) : null,
    route,
    velocityX: from.velocityX ?? 0,
    velocityY: from.velocityY ?? 0,
  };
}

/** Drop from outside the screen, followed by exactly two small, diminishing rebounds. */
export function createBallEntrance(target: BallStop, viewportWidth: number): BallFlight {
  const mobile = viewportWidth <= 640;
  const gravity = 0.0013; // pixels / millisecond²
  const from = { x: target.x, y: -12 };
  const fallDuration = Math.sqrt(2 * (target.y - from.y) / gravity);
  const bounces = (mobile ? [20, 6] : [28, 8]).map((height) => ({ height, duration: Math.sqrt(8 * height / gravity) }));
  return { ...createBallFlight(from, target, viewportWidth), duration: fallDuration + bounces.reduce((sum, bounce) => sum + bounce.duration, 0), sway: 0, curl: 0, entry: { fallDuration, bounces } };
}

/** Rounded contacts keep position and velocity continuous, including between bounces. */
function positionAt(flight: BallFlight, progress: number): BallPoint {
  const t = clamp(progress);
  if (flight.entry) {
    let time = t * flight.duration;
    if (time < flight.entry.fallDuration) return { x: flight.target.x, y: mix(flight.from.y, flight.target.y, (time / flight.entry.fallDuration) ** 2) };
    time -= flight.entry.fallDuration;
    for (const bounce of flight.entry.bounces) {
      if (time < bounce.duration) {
        const phase = time / bounce.duration;
        return { x: flight.target.x, y: flight.target.y - 4 * bounce.height * phase * (1 - phase) };
      }
      time -= bounce.duration;
    }
    return flight.target;
  }
  const firstLanding = 0.72;
  const phase = t < firstLanding ? t / firstLanding : t < 0.91 ? (t - firstLanding) / 0.19 : (t - 0.91) / 0.09;
  const amplitude = t < firstLanding ? 1 : t < 0.91 ? 0.23 : 0.045;
  const lift = flight.height * amplitude * Math.sin(Math.PI * phase) ** 2;
  // Retargeting preserves incoming momentum, which fades smoothly before landing.
  const travel = clamp(t / firstLanding);
  const momentum = flight.duration * t * (1 - travel) ** 3;
  // This S-shaped excursion has zero position, velocity and acceleration at both ends.
  const envelope = Math.sin(Math.PI * travel) ** 3;
  const bend = Math.sin(flight.waves * Math.PI * travel);
  const baselineX = mix(flight.from.x, flight.target.x, ease(travel));
  const curvedX = flight.viaX === null ? baselineX : mix(baselineX, flight.viaX, envelope);
  return {
    x: curvedX + flight.velocityX * momentum + flight.sway * envelope * bend,
    y: mix(flight.from.y, flight.target.y, ease(travel)) - lift + flight.velocityY * momentum - flight.curl * envelope * bend ** 2,
  };
}

/** Time continues after scrolling stops; the ball eventually becomes completely still. */
export function sampleBallFlight(flight: BallFlight, elapsed: number): BallPose {
  if (elapsed >= flight.duration) return restingPose(flight.target);
  const t = clamp(elapsed / flight.duration);
  const point = positionAt(flight, t);
  const step = 0.00001;
  const before = positionAt(flight, Math.max(0, t - step));
  const after = positionAt(flight, Math.min(1, t + step));
  const interval = (Math.min(1, t + step) - Math.max(0, t - step)) * flight.duration;
  const firstImpact = flight.entry ? flight.entry.fallDuration / flight.duration : 0.72;
  const secondImpact = flight.entry ? (flight.entry.fallDuration + flight.entry.bounces[0].duration) / flight.duration : 0.91;
  const impact = Math.exp(-(((t - firstImpact) / 0.025) ** 2)) * 0.12 + Math.exp(-(((t - secondImpact) / 0.018) ** 2)) * 0.045;
  const stretch = Math.sin(Math.PI * t) ** 2 * 0.055;
  return { ...point, scaleX: 1 + impact - stretch / 2, scaleY: 1 - impact + stretch, stage: flight.target.id, velocityX: (after.x - before.x) / interval, velocityY: (after.y - before.y) / interval };
}
