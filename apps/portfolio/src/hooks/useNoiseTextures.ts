import { useEffect, useRef, type RefObject } from "react";

import {
  createFogTexture,
  createGrainTexture,
} from "@portfolio/utils/noiseTextures";

type NoiseTextures = {
  fogRef: RefObject<HTMLDivElement | null>;
  grainRef: RefObject<HTMLDivElement | null>;
};

export default function useNoiseTextures(): NoiseTextures {
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

  return { fogRef, grainRef };
}
