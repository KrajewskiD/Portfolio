import { useEffect, useId, useRef, useState } from "react";

type ProfileDescriptionProps = {
  text: string;
  expandLabel: string;
  collapseLabel: string;
};

const MOBILE_MEDIA_QUERY = "(max-width: 639px)";
const COLLAPSE_CHAR_THRESHOLD = 180;

function ProfileDescription({
  text,
  expandLabel,
  collapseLabel,
}: ProfileDescriptionProps) {
  const contentId = useId();
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const update = () => {
      setIsMobile(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setIsExpanded(false);
      }
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const isCollapsible =
    isMobile && text.trim().length > COLLAPSE_CHAR_THRESHOLD;
  const descriptionState = isExpanded ? "expanded" : "collapsed";

  const handleToggle = () => {
    setIsExpanded((current) => {
      const nextIsExpanded = !current;

      if (!nextIsExpanded) {
        window.requestAnimationFrame(() => {
          contentRef.current?.scrollIntoView({ block: "nearest" });
        });
      }

      return nextIsExpanded;
    });
  };

  return (
    <div
      className="site-hero-description"
      data-collapsible={isCollapsible ? "true" : "false"}
      data-state={descriptionState}
    >
      <p
        ref={contentRef}
        id={contentId}
        className="site-hero-description__text"
      >
        {text}
      </p>

      {isCollapsible ? (
        <button
          type="button"
          className="site-hero-description__toggle"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={handleToggle}
        >
          {isExpanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ProfileDescription;
