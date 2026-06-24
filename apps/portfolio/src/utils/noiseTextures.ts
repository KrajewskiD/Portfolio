const GRAIN_SIZE = 180;
const FOG_SIZE = 256;
const FOG_CELL_SIZE = 6;

function createTextureCanvas(size: number): {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
} | null {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  return { canvas, context };
}

function writeGrayscalePixel(
  data: Uint8ClampedArray,
  index: number,
  value: number,
) {
  data[index] = value;
  data[index + 1] = value;
  data[index + 2] = value;
  data[index + 3] = 255;
}

export function createGrainTexture(): string {
  const texture = createTextureCanvas(GRAIN_SIZE);

  if (!texture) {
    return "";
  }

  const { canvas, context } = texture;
  const imageData = context.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    writeGrayscalePixel(data, index, Math.random() * 255);
  }

  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

export function createFogTexture(): string {
  const texture = createTextureCanvas(FOG_SIZE);

  if (!texture) {
    return "";
  }

  const { canvas, context } = texture;
  const imageData = context.createImageData(FOG_SIZE, FOG_SIZE);
  const { data } = imageData;

  for (let y = 0; y < FOG_SIZE; y += FOG_CELL_SIZE) {
    for (let x = 0; x < FOG_SIZE; x += FOG_CELL_SIZE) {
      const value = 110 + Math.random() * 145;

      for (let offsetY = 0; offsetY < FOG_CELL_SIZE; offsetY += 1) {
        for (let offsetX = 0; offsetX < FOG_CELL_SIZE; offsetX += 1) {
          const pixelY = y + offsetY;
          const pixelX = x + offsetX;

          if (pixelY >= FOG_SIZE || pixelX >= FOG_SIZE) {
            continue;
          }

          writeGrayscalePixel(data, (pixelY * FOG_SIZE + pixelX) * 4, value);
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}
