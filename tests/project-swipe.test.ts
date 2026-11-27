import assert from "node:assert/strict";
import test from "node:test";
import { projectSwipeDirection } from "../src/lib/project-swipe";

test("left/right swipes navigate next/previous project on a phone", () => {
  assert.equal(projectSwipeDirection(-100, 5, 390), 1);
  assert.equal(projectSwipeDirection(100, -5, 390), -1);
});
test("normal page scrolling, taps and diagonal gestures do not navigate", () => {
  for (const [x, y] of [[0, 180], [30, 120], [-30, -120], [12, 4], [80, 70]]) {
    assert.equal(projectSwipeDirection(x, y, 390), null);
  }
});
test("gesture thresholds stay deliberate on small and large phones", () => {
  assert.equal(projectSwipeDirection(-43, 0, 320), null);
  assert.equal(projectSwipeDirection(-50, 0, 320), 1);
  assert.equal(projectSwipeDirection(-50, 0, 430), null);
  assert.equal(projectSwipeDirection(-70, 0, 430), 1);
  assert.equal(projectSwipeDirection(NaN, 0, 390), null);
});
