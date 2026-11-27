export type PlaygroundBall = { x: number; y: number; vx: number; vy: number };
export type PlaygroundBounds = { width: number; height: number; radius: number };

export function constrainPlaygroundBall(ball: PlaygroundBall, bounds: PlaygroundBounds): PlaygroundBall {
  const { radius: r, width, height } = bounds;
  return { ...ball, x: Math.max(r, Math.min(width - r, ball.x)), y: Math.max(r, Math.min(height - r, ball.y)) };
}

/** Small fixed steps keep wall contacts stable, even after a slow frame. */
export function advancePlaygroundBall(ball: PlaygroundBall, bounds: PlaygroundBounds, elapsedMs: number) {
  const next = constrainPlaygroundBall(ball, bounds);
  let remaining = Math.max(0, Math.min(48, elapsedMs)) / 1000;
  let bounces = 0;
  while (remaining > 0) {
    const dt = Math.min(1 / 120, remaining);
    remaining -= dt;
    next.vy += 1150 * dt;
    next.vx *= Math.exp(-0.12 * dt);
    next.x += next.vx * dt;
    next.y += next.vy * dt;
    if (next.x < bounds.radius || next.x > bounds.width - bounds.radius) {
      next.x = Math.max(bounds.radius, Math.min(bounds.width - bounds.radius, next.x));
      next.vx *= -0.8;
    }
    if (next.y < bounds.radius) { next.y = bounds.radius; next.vy = Math.abs(next.vy) * 0.8; }
    if (next.y >= bounds.height - bounds.radius) {
      next.y = bounds.height - bounds.radius;
      if (next.vy > 75) { next.vy *= -0.72; bounces++; }
      else { next.vy = 0; next.vx *= Math.exp(-7 * dt); }
    }
  }
  const resting = next.y >= bounds.height - bounds.radius - 0.1 && next.vy === 0 && Math.abs(next.vx) < 2;
  if (resting) next.vx = 0;
  return { ball: next, bounces, resting };
}

export function playgroundThrowVelocity(dx: number, dy: number, elapsedMs: number, ageMs: number) {
  if (ageMs > 100) return { vx: 0, vy: 0 };
  const dt = Math.max(8, elapsedMs) / 1000;
  return { vx: Math.max(-1500, Math.min(1500, dx / dt)), vy: Math.max(-1500, Math.min(1500, dy / dt)) };
}
