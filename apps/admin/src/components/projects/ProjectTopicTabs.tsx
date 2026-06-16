import {
  projectTopicLabels,
  projectTopicOrder,
} from "@shared/constants/projectTopics";
import type { Language } from "@shared/types/language";
import type { ProjectTopicId } from "@shared/types/project";

type ProjectTopicTabsProps = {
  activeTopicId: ProjectTopicId;
  language: Language;
  onChange: (topicId: ProjectTopicId) => void;
};

function ProjectTopicTabs({
  activeTopicId,
  language,
  onChange,
}: ProjectTopicTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4">
      {projectTopicOrder.map((topicId) => {
        const isActive = topicId === activeTopicId;

        return (
          <button
            key={topicId}
            type="button"
            onClick={() => onChange(topicId)}
            className={[
              "cursor-pointer rounded-full border px-5 py-3 font-bold transition",
              isActive
                ? "border-white/30 bg-neutral-700 text-white"
                : "border-white/10 bg-neutral-900 text-white/50 hover:bg-neutral-800 hover:text-white",
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