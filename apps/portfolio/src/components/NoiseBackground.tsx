import { useEffect, useRef } from "react";

const GRAIN_SIZE = 180;
const FOG_SIZE = 256;

function createGrainTexture(): string {
  const canvas = document.createElement("canvas");
  canvas.width = GRAIN_SIZE;
  canvas.height = GRAIN_SIZE;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  const imageData = context.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  const { data } = imageData;

  for (let index = 0; index < data.length; index += 4) {
    const value = Math.random() * 255;
    data[index] = value;
    data[index + 1] = value;
    data[index + 2] = value;
    data[index + 3] = 255;
  }

  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

function createFogTexture(): string {
  const canvas = document.createElement("canvas");
  canvas.width = FOG_SIZE;
  canvas.height = FOG_SIZE;

  const context = canvas.getContext("2d");

  if (!context) {
    return "";
  }

  const imageData = context.createImageData(FOG_SIZE, FOG_SIZE);
  const { data } = imageData;
  const cell = 6;

  for (let y = 0; y < FOG_SIZE; y += cell) {
    for (let x = 0; x < FOG_SIZE; x += cell) {
      const value = 110 + Math.random() * 145;

      for (let offsetY = 0; offsetY < cell; offsetY += 1) {
        for (let offsetX = 0; offsetX < cell; offsetX += 1) {
          const pixelY = y + offsetY;
          const pixelX = x + offsetX;

          if (pixelY >= FOG_SIZE || pixelX >= FOG_SIZE) {
            continue;
          }

          const index = (pixelY * FOG_SIZE + pixelX) * 4;
          data[index] = value;
          data[index + 1] = value;
          data[index + 2] = value;
          data[index + 3] = 255;
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);

  return canvas.toDataURL("image/png");
}

function NoiseBackground() {
  const grainRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grainUrl = createGrainTexture();
    const fogUrl = createFogTexture();

    if (grainRef.current && grainUrl) {
      grainRef.current.style.backgroundImage = `url("${grainUrl}")`;
    }

    if (fogRef.current && fogUrl) {
      fogRef.current.style.backgroundImage = `url("${fogUrl}")`;
    }
  }, []);

  return (
    <div aria-hidden className="site-noise">
      <div className="site-noise__gradient" />
      <div ref={grainRef} className="site-noise__grain" />
      <div ref={fogRef} className="site-noise__fog" />
    </div>
  );
}

export default NoiseBackground;
