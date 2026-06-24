import useNoiseTextures from "@portfolio/hooks/useNoiseTextures";

function NoiseBackground() {
  const { fogRef, grainRef } = useNoiseTextures();

  return (
    <div aria-hidden className="site-noise">
      <div className="site-noise__gradient" />
      <div className="site-noise__stains">
        <span className="site-noise__stain site-noise__stain--one" />
        <span className="site-noise__stain site-noise__stain--two" />
        <span className="site-noise__stain site-noise__stain--three" />
        <span className="site-noise__stain site-noise__stain--four" />
      </div>
      <div ref={grainRef} className="site-noise__grain" />
      <div ref={fogRef} className="site-noise__fog" />
    </div>
  );
}

export default NoiseBackground;
