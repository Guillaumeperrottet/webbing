// Registration of the original landscape against /selfcamp_accueil.png.
// Keep the capture's actual pixels outside its interface. The original photo
// fills only the pixels uncovered beneath the fixed logo, text and search UI.
const SOURCE_WIDTH = 3004;
const SOURCE_HEIGHT = 1922;

const textRegions = [
  [0.07, 0.02, 0.29, 0.28], // Supplied white logo and wordmark.
  [0.8, 0.02, 1, 0.08], // Original navigation.
  [0.31, 0.475, 0.99, 0.56], // Main heading and its shadow.
  [0.4, 0.71, 0.87, 0.765], // Search heading.
] as const;

function roundedInside(x: number, y: number, left: number, top: number, width: number, height: number, radius: number) {
  if (x < left || y < top || x > left + width || y > top + height) return false;
  const dx = x - Math.max(left + radius, Math.min(x, left + width - radius));
  const dy = y - Math.max(top + radius, Math.min(y, top + height - radius));
  return dx * dx + dy * dy <= radius * radius;
}

const byte = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

export function prepareSelfcampLayers(capture: HTMLImageElement, photo: HTMLImageElement) {
  const width = Math.min(capture.naturalWidth, 1600);
  const height = Math.round(width * SOURCE_HEIGHT / SOURCE_WIDTH);
  const scale = width / SOURCE_WIDTH;
  const scratch = document.createElement("canvas");
  scratch.width = width;
  scratch.height = height;
  const ctx = scratch.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(capture, 0, 0, width, height);
  const original = ctx.getImageData(0, 0, width, height);
  const landscape = ctx.getImageData(0, 0, width, height);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(photo, -236 * scale, -6 * scale, 2400 * 1.624 * scale, 1185 * 1.624 * scale);
  const reference = ctx.getImageData(0, 0, width, height);
  // Match the photo to the grade already present in the supplied capture.
  for (let i = 0; i < reference.data.length; i += 4) {
    const [r, g, b] = [reference.data[i], reference.data[i + 1], reference.data[i + 2]];
    reference.data[i] = byte(0.674057 * r + 0.132468 * g - 0.009394 * b + 48.140529);
    reference.data[i + 1] = byte(0.037665 * r + 0.769375 * g - 0.004635 * b + 47.802781);
    reference.data[i + 2] = byte(-0.037757 * r + 0.241777 * g + 0.589495 * b + 46.749291);
    reference.data[i + 3] = 255;
  }

  const coverage = new Uint8Array(width * height);
  const opaque = new Uint8Array(width * height);
  const feather = Math.max(1, 16 * scale);
  for (const [x0, y0, x1, y1] of textRegions) {
    for (let y = Math.floor(y0 * height); y < Math.ceil(y1 * height); y++) {
      for (let x = Math.floor(x0 * width); x < Math.min(width, Math.ceil(x1 * width)); x++) {
        const p = y * width + x;
        // Include translucent strokes, thin lettering and shadows in full.
        // Feather only the surrounding photograph, outside the actual glyphs.
        const distance = Math.min(x - x0 * width, x1 * width - x, y - y0 * height, y1 * height - y);
        coverage[p] = Math.max(coverage[p], byte(Math.min(1, Math.max(0, distance) / feather) * 255));
      }
    }
  }
  // Copy genuine opaque UI, including its placeholder and partner credit.
  for (const [left, top, w, h, radius] of [[1056, 1488, 1312, 132, 41], [96, 1616, 120, 274, 0], [27, 1616, 55, 274, 18]]) {
    for (let y = Math.floor(top * scale); y <= Math.min(height - 1, Math.ceil((top + h) * scale)); y++) {
      for (let x = Math.floor(left * scale); x <= Math.min(width - 1, Math.ceil((left + w) * scale)); x++) {
        if (roundedInside(x, y, left * scale, top * scale, w * scale, h * scale, radius * scale)) {
          coverage[y * width + x] = 255;
          opaque[y * width + x] = 1;
        }
      }
    }
  }

  // Preserve the control's border antialiasing and original drop shadow.
  const radius = Math.max(1, Math.ceil(7 * scale));
  for (let p = 0; p < opaque.length; p++) {
    if (!opaque[p]) continue;
    const x = p % width;
    const y = Math.floor(p / width);
    for (let yy = Math.max(0, y - radius); yy <= Math.min(height - 1, y + radius); yy++) {
      for (let xx = Math.max(0, x - radius); xx <= Math.min(width - 1, x + radius); xx++) {
        const weight = Math.max(0, 1 - Math.hypot(xx - x, yy - y) / (radius + 1));
        const target = yy * width + xx;
        coverage[target] = Math.max(coverage[target], byte(weight * 255));
      }
    }
  }
  const foreground = ctx.createImageData(width, height);
  for (let p = 0; p < coverage.length; p++) {
    if (!coverage[p]) continue;
    const i = p * 4;
    const weight = coverage[p] / 255;
    for (let channel = 0; channel < 3; channel++) {
      reference.data[i + channel] = byte(weight * reference.data[i + channel] + (1 - weight) * original.data[i + channel]);
    }
    let alpha = opaque[p] ? 1 : 0;
    for (let channel = 0; channel < 3 && !opaque[p]; channel++) {
      const s = original.data[i + channel];
      const b = reference.data[i + channel];
      alpha = Math.max(alpha, s >= b ? (s - b) / Math.max(1, 255 - b) : (b - s) / Math.max(1, b));
    }
    alpha = Math.ceil(alpha * 255) / 255;
    if (alpha === 0) continue;
    for (let channel = 0; channel < 3; channel++) {
      const b = reference.data[i + channel];
      foreground.data[i + channel] = byte((original.data[i + channel] - (1 - alpha) * b) / alpha);
      landscape.data[i + channel] = b;
    }
    foreground.data[i + 3] = Math.round(alpha * 255);
  }
  return { landscape, foreground };
}
