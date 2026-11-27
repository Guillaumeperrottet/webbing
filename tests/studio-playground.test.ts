import assert from "node:assert/strict";
import test from "node:test";
import { advancePlaygroundBall, constrainPlaygroundBall, playgroundThrowVelocity } from "../src/lib/studio-playground";

const bounds = { width: 320, height: 260, radius: 21 };

test("throws stay inside the court and eventually come to rest", () => {
  let ball = { x: 120, y: 70, vx: 1400, vy: -1300 };
  let contacts = 0, resting = false;
  for (let frame = 0; frame < 3000 && !resting; frame++) {
    const step = advancePlaygroundBall(ball, bounds, 16);
    ball = step.ball; contacts += step.bounces; resting = step.resting;
    assert.ok(ball.x >= 21 && ball.x <= 299);
    assert.ok(ball.y >= 21 && ball.y <= 239);
  }
  assert.ok(contacts > 2);
  assert.ok(resting);
  assert.equal(ball.vx, 0); assert.equal(ball.vy, 0);
  assert.equal(ball.y, 239);
});

test("floor contacts lose energy and count a single bounce", () => {
  const step = advancePlaygroundBall({ x: 100, y: 238, vx: 0, vy: 500 }, bounds, 16);
  assert.equal(step.bounces, 1);
  assert.ok(step.ball.vy < 0 && Math.abs(step.ball.vy) < 500);
});

test("long frames are bounded and resizing constrains a held ball", () => {
  const ball = { x: 100, y: 100, vx: 1200, vy: 500 };
  assert.deepEqual(advancePlaygroundBall(ball, bounds, 60000), advancePlaygroundBall(ball, bounds, 48));
  assert.deepEqual(constrainPlaygroundBall({ x: -50, y: 400, vx: 0, vy: 0 }, bounds), { x: 21, y: 239, vx: 0, vy: 0 });
});

test("holding before release cancels momentum and fast gestures are capped", () => {
  assert.deepEqual(playgroundThrowVelocity(100, -100, 10, 101), { vx: 0, vy: 0 });
  assert.deepEqual(playgroundThrowVelocity(1000, -1000, 0, 0), { vx: 1500, vy: -1500 });
  assert.deepEqual(playgroundThrowVelocity(20, -10, 20, 5), { vx: 1000, vy: -500 });
});
