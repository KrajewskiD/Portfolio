import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  projectTopicIcons,
  projectTopicLabels,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
import RichTextContent from "@shared/components/RichTextContent";
import type { Language } from "@shared/database/types/language";
import type {
  ProjectTopicContent,
  ProjectTopicId,
  ProjectTopics,
} from "@shared/database/types/project";
import { getLocalizedField } from "@shared/utils/localizedField";
import ProjectTopic from "./ProjectTopic";

type ProjectTopicsGroupProps = {
  topics: ProjectTopics;
  activeId: ProjectTopicId;
  onTopicChange: (id: ProjectTopicId) => void;
  language: Language;
  sectionLabel: string;
};

const SCROLLBAR_TRACK_INSET = 10;
const SCROLLBAR_MIN_THUMB_HEIGHT = 44;

function ProjectTopicsGroup({
  topics,
  activeId,
  onTopicChange,
  language,
  sectionLabel,
}: ProjectTopicsGroupProps) {
  const groupId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const [scrollbar, setScrollbar] = useState({
    isVisible: false,
    thumbHeight: 0,
    thumbTop: 0,
  });

  const orderedTopics = projectTopicOrder
    .map((id) => topics.find((topic) => topic.id === id))
    .filter((topic): topic is ProjectTopicContent => topic !== undefined);

  const activeTopic =
    orderedTopics.find((topic) => topic.id === activeId) ?? orderedTopics[0];

  const updateScrollbar = useCallback(() => {
    const panel = panelRef.current;
    const content = panelContentRef.current;

    if (!panel || !content) {
      return;
    }

    const contentBottom = content.offsetTop + content.scrollHeight;
    const isScrollable = contentBottom > panel.clientHeight + 1;

    if (!isScrollable) {
      setScrollbar((current) =>
        current.isVisible
          ? { isVisible: false, thumbHeight: 0, thumbTop: 0 }
          : current,
      );
      return;
    }

    const trackHeight = Math.max(
      panel.clientHeight - SCROLLBAR_TRACK_INSET * 2,
      SCROLLBAR_MIN_THUMB_HEIGHT,
    );
    const thumbHeight = Math.max(
      SCROLLBAR_MIN_THUMB_HEIGHT,
      (panel.clientHeight / panel.scrollHeight) * trackHeight,
    );
    const maxThumbTop = Math.max(trackHeight - thumbHeight, 0);
    const maxScrollTop = Math.max(panel.scrollHeight - panel.clientHeight, 1);
    const thumbTop = (panel.scrollTop / maxScrollTop) * maxThumbTop;

    setScrollbar((current) => {
      const next = {
        isVisible: true,
        thumbHeight,
        thumbTop,
      };

      if (
        current.isVisible === next.isVisible &&
        Math.abs(current.thumbHeight - next.thumbHeight) < 0.5 &&
        Math.abs(current.thumbTop - next.thumbTop) < 0.5
      ) {
        return current;
      }

      return next;
    });
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    panel.scrollTo({ top: 0 });
    updateScrollbar();
  }, [activeId, updateScrollbar]);

  useLayoutEffect(() => {
    updateScrollbar();

    const panel = panelRef.current;
    const content = panelContentRef.current;

    if (!panel) {
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScrollbar);
      return () => {
        window.removeEventListener("resize", updateScrollbar);
      };
    }

    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(panel);

    if (content) {
      resizeObserver.observe(content);
    }

    window.addEventListener("resize", updateScrollbar);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollbar);
    };
  }, [activeTopic, language, updateScrollbar]);

  if (!activeTopic) {
    return null;
  }

  return (
    <div className="site-topic-group">
      <div role="group" aria-label={sectionLabel} className="site-topic-list">
        {orderedTopics.map((topic) => (
          <ProjectTopic
            key={topic.id}
            id={`${groupId}-${topic.id}-tab`}
            label={projectTopicLabels[topic.id][language]}
            iconSrc={projectTopicIcons[topic.id]}
            active={topic.id === activeTopic.id}
            onSelect={() => onTopicChange(topic.id)}
          />
        ))}
      </div>

      <div
        className="site-topic-panel-shell"
        data-scrollable={scrollbar.isVisible ? "true" : undefined}
      >
        <div
          ref={panelRef}
          className="site-topic-panel"
          onScroll={updateScrollbar}
        >
          <div ref={panelContentRef} className="site-topic-panel__content">
            <p className="site-label text-sm">
              {projectTopicLabels[activeTopic.id][language]}
            </p>

            <RichTextContent
              className="site-body--panel"
              content={getLocalizedField(
                activeTopic,
                language,
                "contentPl",
                "contentEn",
              )}
            />
          </div>
        </div>

        {scrollbar.isVisible ? (
          <span aria-hidden className="site-topic-panel__scrollbar">
            <span
              className="site-topic-panel__scrollbar-thumb"
              style={{
                height: `${scrollbar.thumbHeight}px`,
                transform: `translate3d(0, ${scrollbar.thumbTop}px, 0)`,
              }}
            />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default ProjectTopicsGroup;
