import { useEffect, useState } from "react";

import { isAnimatedWebpFile } from "@shared/utils/webpImage";

export function useAnimatedWebpCheck(selectedFile?: File | null) {
  const [animatedWebpCheck, setAnimatedWebpCheck] = useState<{
    file: File;
    isAnimated: boolean;
  } | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    let isCancelled = false;

    void isAnimatedWebpFile(selectedFile).then((isAnimated) => {
      if (!isCancelled) {
        setAnimatedWebpCheck({ file: selectedFile, isAnimated });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedFile]);

  const isAnimatedWebp =
    selectedFile && animatedWebpCheck?.file === selectedFile
      ? animatedWebpCheck.isAnimated
      : null;

  const selectedFileHint =
    isAnimatedWebp === true
      ? "Wykryto animowany WebP — na stronie odtworzy się w przeglądarce."
      : isAnimatedWebp === false
        ? "To jest statyczny WebP (bez animacji). Jeśli oczekujesz ruchu, wyeksportuj ponownie jako animated WebP albo użyj WebM."
        : undefined;

  return {
    isAnimatedWebp,
    selectedFileHint,
  };
}
