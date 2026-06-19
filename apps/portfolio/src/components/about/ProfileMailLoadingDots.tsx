import { useEffect, useState } from "react";

const DOT_STEPS = [".", "..", "..."] as const;
const STEP_MS = 380;

function ProfileMailLoadingDots() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % DOT_STEPS.length);
    }, STEP_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <span className="site-hero-card__mail-dots" aria-hidden>
      {DOT_STEPS[stepIndex]}
    </span>
  );
}

export default ProfileMailLoadingDots;
