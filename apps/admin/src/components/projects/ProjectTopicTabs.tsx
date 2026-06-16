import {
  projectTopicLabels,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
import type { Language } from "@shared/types/language";
import type { ProjectTopicId } from "@shared/types/projectTopic";

type ProjectTopicTabsProps = {
  activeTopicId: ProjectTopicId;
  language: Language;
  labelledBy: string;
  onChange: (topicId: ProjectTopicId) => void;
};

function ProjectTopicTabs({
  activeTopicId,
  language,
  labelledBy,
  onChange,
}: ProjectTopicTabsProps) {
  return (
    <div
      role="tablist"
      aria-labelledby={labelledBy}
      className="grid grid-cols-4 gap-2"
    >
      {projectTopicOrder.map((topicId) => {
        const isActive = topicId === activeTopicId;

        return (
          <button
            key={topicId}
            type="button"
            onClick={() => onChange(topicId)}
            className={[
              "cursor-pointer whitespace-nowrap rounded-full border px-3 py-2 text-sm font-bold transition",
              isActive
                ? "border-white/30 bg-neutral-700 text-white"
                : "border-white/10 bg-neutral-800 text-white/60 hover:border-white/20 hover:bg-neutral-700 hover:text-white",
            ].join(" ")}
          >
            {projectTopicLabels[topicId][language]}
          </button>
        );
      })}
    </div>
  );
}

export default ProjectTopicTabs;
