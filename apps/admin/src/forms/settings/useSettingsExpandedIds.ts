import { useCallback, useState } from "react";

function toggleExpandedId(expandedIds: Set<string>, id: string) {
  const next = new Set(expandedIds);

  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }

  return next;
}

export function useSettingsExpandedIds() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const addExpandedId = useCallback((id: string) => {
    setExpandedIds((current) => new Set(current).add(id));
  }, []);

  const removeExpandedId = useCallback((id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((current) => toggleExpandedId(current, id));
  }, []);

  return {
    expandedIds,
    addExpandedId,
    removeExpandedId,
    toggleExpanded,
  };
}
