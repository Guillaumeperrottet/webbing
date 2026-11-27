/** A deliberate horizontal gesture changes project; vertical/diagonal scrolling does not. */
export function projectSwipeDirection(deltaX: number, deltaY: number, width: number): -1 | 1 | null {
  const distance = Math.min(72, Math.max(44, width * 0.14));
  if (![deltaX, deltaY, width].every(Number.isFinite) || width <= 0) return null;
  if (Math.abs(deltaX) < distance || Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return null;
  return deltaX < 0 ? 1 : -1;
}
