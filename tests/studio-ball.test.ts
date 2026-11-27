import assert from "node:assert/strict";
import test from "node:test";
import { chooseBallRoute, createBallEntrance, createBallFlight, createMethodBallFlight, METHOD_DOT_FALL_DURATION, restingPose, sampleBallFlight, sampleMethodDotFall, selectBallStop, type BallRoute, type BallStop } from "../src/lib/studio-ball";

const stops: BallStop[] = [
  { id: "hero", x: 620, y: 430 },
  { id: "applications", x: 104, y: 860 },
  { id: "studio", x: 215, y: 2700 },
  { id: "contact", x: 104, y: 4200 },
  { id: "footer", x: 400, y: 4800 },
];

test("scroll selects a destination with hysteresis and restores the hero at the top", () => {
  assert.equal(selectBallStop(stops, 200, 900, "hero")?.id, "hero");
  assert.equal(selectBallStop(stops, 260, 900, "hero")?.id, "applications");
  for (const scroll of [250, 220, 180]) assert.equal(selectBallStop(stops, scroll, 900, "applications")?.id, "applications");
  assert.equal(selectBallStop(stops, 50, 900, "applications")?.id, "hero");
  assert.equal(selectBallStop(stops, 0, 1300, "contact")?.id, "hero");
  assert.equal(selectBallStop([], 0, 900), null);
});

test("a flight advances after scrolling stops and comes to complete rest", () => {
  const flight = createBallFlight(stops[0], stops[1], 1440);
  assert.notDeepEqual(sampleBallFlight(flight, 300), sampleBallFlight(flight, 900));
  assert.deepEqual(sampleBallFlight(flight, flight.duration), restingPose(stops[1]));
  assert.deepEqual(sampleBallFlight(flight, flight.duration + 60_000), restingPose(stops[1]));
});

test("contacts and the final landing have continuous position and velocity", () => {
  for (const target of [stops[1], stops[0], stops[2], stops[4]]) {
    const flight = createBallFlight(stops[3], target, 1440);
    for (const fraction of [0.72, 0.91, 1]) {
      const before = sampleBallFlight(flight, fraction * flight.duration - 0.01);
      const after = sampleBallFlight(flight, fraction * flight.duration + 0.01);
      assert.ok(Math.hypot(before.x - after.x, before.y - after.y) < 0.01);
      assert.ok(Math.hypot(before.velocityX - after.velocityX, before.velocityY - after.velocityY) < 0.01);
      assert.ok(Math.abs(before.scaleX - after.scaleX) < 0.001);
    }
  }
});

test("retargeting preserves both the position and incoming momentum", () => {
  const flight = createBallFlight(stops[0], stops[1], 1440);
  const current = sampleBallFlight(flight, flight.duration * 0.35);
  const next = sampleBallFlight(createBallFlight(current, stops[2], 1440), 0);
  assert.equal(next.x, current.x);
  assert.equal(next.y, current.y);
  assert.ok(Math.abs(next.velocityX - current.velocityX) < 0.001);
  assert.ok(Math.abs(next.velocityY - current.velocityY) < 0.001);
});

test("the footer path stays on the left, without touring the form or overshooting below the logo", () => {
  const flight = createBallFlight(stops[3], stops[4], 1440);
  for (let time = 0; time < flight.duration; time += 8) {
    const pose = sampleBallFlight(flight, time);
    assert.ok(pose.x >= stops[3].x && pose.x <= stops[4].x);
    assert.ok(pose.y <= stops[4].y);
  }
  assert.deepEqual(sampleBallFlight(flight, flight.duration), restingPose(stops[4]));
});

test("the two settling rebounds lose height and stay at the final punctuation", () => {
  const flight = createBallFlight(stops[3], stops[4], 1440);
  const first = sampleBallFlight(flight, flight.duration * 0.815);
  const second = sampleBallFlight(flight, flight.duration * 0.955);
  assert.equal(first.x, stops[4].x);
  assert.equal(second.x, stops[4].x);
  assert.ok(first.y < second.y && second.y < stops[4].y);
});

test("mobile category changes stay inside the viewport with ample hang time", () => {
  const from = { x: 65, y: 1080 }, to = { id: "websites", x: 270, y: 1080 };
  const flight = createBallFlight(from, to, 375, true);
  assert.ok(flight.duration >= 800 && flight.duration <= 1100);
  for (let time = 0; time <= flight.duration; time += 8) {
    const pose = sampleBallFlight(flight, time);
    assert.ok(pose.x >= 65 && pose.x <= 270);
    assert.ok(Number.isFinite(pose.y));
  }
  assert.ok(sampleBallFlight(flight, flight.duration * 0.36).y < from.y - 25);
});

test("the portrait stop and footer remain reachable", () => {
  assert.equal(selectBallStop(stops, 2200, 900, "applications")?.id, "studio");
  assert.equal(selectBallStop(stops, 4100, 900, "contact")?.id, "footer");
  const flight = createBallFlight(stops[1], stops[2], 390);
  assert.deepEqual(sampleBallFlight(flight, flight.duration), restingPose(stops[2]));
});

test("the nose keeps its stop while the portrait is central, even with the next section visible", () => {
  const visible = [...stops.slice(0, 3), { id: "method", x: 104, y: 3150 }];
  assert.equal(selectBallStop(visible, 2320, 1300, "applications")?.id, "studio");
  assert.equal(selectBallStop(visible, 2320, 1300, "method")?.id, "studio");
  assert.equal(selectBallStop(visible, 2500, 1300, "studio")?.id, "method");
});

test("section flights bend both ways without leaving the viewport or changing the landing", () => {
  for (const width of [375, 1440]) {
    const from = { x: width * 0.4, y: 120 }, target = { id: "studio", x: width * 0.35, y: 800 };
    const flight = createBallFlight(from, target, width);
    const straight = { ...flight, sway: 0, curl: 0 };
    const early = sampleBallFlight(flight, flight.duration * 0.18).x - sampleBallFlight(straight, flight.duration * 0.18).x;
    const later = sampleBallFlight(flight, flight.duration * 0.54).x - sampleBallFlight(straight, flight.duration * 0.54).x;
    assert.ok(early > 10 && later < -10);
    for (let time = 0; time <= flight.duration; time += 8) {
      const pose = sampleBallFlight(flight, time);
      assert.ok(pose.x >= 8 && pose.x <= width - 8);
    }
    assert.deepEqual(sampleBallFlight(flight, flight.duration), restingPose(target));
  }
});

test("the home entrance arrives from above and can hand over its momentum to scrolling", () => {
  for (const width of [375, 1440]) {
    const hero = { id: "hero", x: width * 0.6, y: 380 };
    const entrance = createBallEntrance(hero, width);
    const initial = sampleBallFlight(entrance, 0);
    assert.ok(initial.y < 0);
    assert.equal(initial.x, hero.x);
    const moving = sampleBallFlight(entrance, entrance.duration * 0.3);
    const interrupted = sampleBallFlight(createBallFlight(moving, stops[1], width), 0);
    assert.equal(interrupted.x, moving.x);
    assert.equal(interrupted.y, moving.y);
    assert.ok(Math.abs(interrupted.velocityX - moving.velocityX) < 0.001);
    assert.deepEqual(sampleBallFlight(entrance, entrance.duration + 60_000), restingPose(hero));
  }
});

test("the entrance accelerates straight down, makes two small rebounds, then stays on the period", () => {
  const hero = { id: "hero", x: 620, y: 430 };
  const entrance = createBallEntrance(hero, 1440);
  const { fallDuration, bounces } = entrance.entry!;
  const quarter = sampleBallFlight(entrance, fallDuration / 4);
  const half = sampleBallFlight(entrance, fallDuration / 2);
  assert.ok(Math.abs((half.y - entrance.from.y) / (quarter.y - entrance.from.y) - 4) < 0.001);
  assert.equal(bounces.length, 2);
  let elapsed = fallDuration;
  for (const bounce of bounces) {
    const apex = sampleBallFlight(entrance, elapsed + bounce.duration / 2);
    assert.equal(apex.x, hero.x);
    assert.ok(Math.abs(hero.y - apex.y - bounce.height) < 0.001);
    elapsed += bounce.duration;
    assert.ok(Math.abs(sampleBallFlight(entrance, elapsed).y - hero.y) < 0.001);
  }
  assert.ok(bounces[0].height > bounces[1].height && bounces[0].height <= 28);
  assert.deepEqual(sampleBallFlight(entrance, elapsed + 60_000), restingPose(hero));
});

const routes: BallRoute[] = [0, 1, 2, 3, 4];

test("random selection covers all paths and never repeats the preceding one", () => {
  assert.deepEqual(new Set([0, 0.2, 0.4, 0.6, 0.8].map((seed) => chooseBallRoute(null, seed))), new Set(routes));
  for (const previous of routes) {
    const possible = new Set([0, 0.25, 0.5, 0.75, 1].map((seed) => chooseBallRoute(previous, seed)));
    assert.equal(possible.size, 4);
    assert.ok(!possible.has(previous));
    for (const selected of possible) assert.ok(routes.includes(selected));
  }
});

test("five distinct journeys remain deterministic and land at exactly the same place", () => {
  const signatures = new Set<string>();
  for (const route of routes) {
    const flight = createBallFlight({ x: 300, y: 120 }, { id: "studio", x: 600, y: 800 }, 1440, false, route);
    const sample = [0.18, 0.36, 0.54].map((phase) => sampleBallFlight(flight, flight.duration * phase));
    signatures.add(JSON.stringify(sample.map(({ x, y }) => [Math.round(x), Math.round(y)])));
    assert.deepEqual(sampleBallFlight(flight, flight.duration * 0.36), sample[1]);
    assert.deepEqual(sampleBallFlight(flight, flight.duration + 60_000), restingPose(flight.target));
  }
  assert.equal(signatures.size, 5);
});

test("every route stays on screen, joins its bounces smoothly and avoids a footer detour", () => {
  for (const width of [375, 1440]) for (const route of routes) for (const id of ["studio", "footer"]) {
    const from = { x: width * 0.2, y: 100 }, target = { id, x: width * 0.35, y: 800 };
    const flight = createBallFlight(from, target, width, false, route);
    for (let time = 0; time < flight.duration; time += 8) {
      const pose = sampleBallFlight(flight, time);
      assert.ok(pose.x >= 8 && pose.x <= width - 8);
      assert.ok(Number.isFinite(pose.y));
      if (id === "footer") assert.ok(pose.x >= from.x && pose.x <= target.x && pose.y <= target.y);
    }
    for (const phase of [0.72, 0.91]) {
      const before = sampleBallFlight(flight, flight.duration * phase - 0.01);
      const after = sampleBallFlight(flight, flight.duration * phase + 0.01);
      assert.ok(Math.hypot(before.velocityX - after.velocityX, before.velocityY - after.velocityY) < 0.01);
    }
    assert.deepEqual(sampleBallFlight(flight, flight.duration), restingPose(target));
  }
});


test("the method collision hits the punctuation before recoiling and replacing it", () => {
  for (const width of [320, 390, 1440]) {
    const target = { id: "method", x: width * 0.75, y: 900 };
    const flight = createMethodBallFlight({ x: width * 0.3, y: 300 }, target, width);
    const c = flight.collision!;
    const hit = sampleBallFlight(flight, c.impactAt);
    assert.ok(Math.hypot(hit.x - target.x, hit.y - target.y) < 0.001);
    const recoil = sampleBallFlight(flight, c.impactAt + c.reboundDuration / 2);
    assert.ok(target.y - recoil.y >= 38);
    assert.ok(recoil.x < target.x);
    for (const at of [c.impactAt, c.impactAt + c.reboundDuration, flight.duration]) {
      const a = sampleBallFlight(flight, at - 0.01), b = sampleBallFlight(flight, at + 0.01);
      assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 0.01);
      assert.ok(Math.hypot(a.velocityX - b.velocityX, a.velocityY - b.velocityY) < 0.01);
    }
    assert.deepEqual(sampleBallFlight(flight, flight.duration + 10000), restingPose(target));
  }
});

test("the displaced period falls with gravity and finishes before the red ball settles", () => {
  assert.deepEqual(sampleMethodDotFall(0), { x: 0, y: 0, opacity: 1 });
  const quarter = sampleMethodDotFall(METHOD_DOT_FALL_DURATION / 4);
  const half = sampleMethodDotFall(METHOD_DOT_FALL_DURATION / 2);
  assert.ok(half.y > quarter.y && Math.abs(half.y / quarter.y - 4) < 0.001);
  assert.equal(half.opacity, 1);
  assert.equal(sampleMethodDotFall(METHOD_DOT_FALL_DURATION).opacity, 0);
  assert.deepEqual(sampleMethodDotFall(60000), sampleMethodDotFall(METHOD_DOT_FALL_DURATION));
  assert.ok(sampleMethodDotFall(400, -1).x < 0);
  const flight = createMethodBallFlight({ x: 40, y: 100 }, { id: "method", x: 250, y: 700 }, 390);
  assert.ok(flight.duration - flight.collision!.impactAt > METHOD_DOT_FALL_DURATION);
});

test("interrupting a method recoil hands its current position and velocity to the next journey", () => {
  const flight = createMethodBallFlight({ x: 100, y: 300 }, { id: "method", x: 300, y: 900 }, 390);
  const moving = sampleBallFlight(flight, flight.collision!.impactAt + 200);
  const next = sampleBallFlight(createBallFlight(moving, { id: "contact", x: 24, y: 1500 }, 390), 0);
  assert.equal(next.x, moving.x);
  assert.equal(next.y, moving.y);
  assert.ok(Math.abs(next.velocityX - moving.velocityX) < 0.001);
  assert.ok(Math.abs(next.velocityY - moving.velocityY) < 0.001);
});
