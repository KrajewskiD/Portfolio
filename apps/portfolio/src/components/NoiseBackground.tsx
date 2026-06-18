function NoiseBackground() {
  return (
    <div aria-hidden className="site-noise">
      <svg
        className="site-noise__grain"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="site-noise-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <pattern
            id="site-noise-grain-pattern"
            width="220"
            height="220"
            patternUnits="userSpaceOnUse"
          >
            <rect width="220" height="220" filter="url(#site-noise-grain)" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#site-noise-grain-pattern)"
        />
      </svg>

      <svg
        className="site-noise__fog"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="site-noise-fog">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.35
                      0 0 0 0 0.38
                      0 0 0 0 0.41
                      0 0 0 0 0.55 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#site-noise-fog)" />
      </svg>
    </div>
  );
}

export default NoiseBackground;
