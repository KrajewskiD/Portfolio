import { skillGroupDrafts } from "@admin/data/adminDrafts";
import { useSkillsEditor } from "@admin/forms/skills/useSkillsEditor";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminSkillGroups,
  saveAdminSkillGroups,
} from "@admin/services/skillContentService";
import type { SkillGroupData } from "@shared/database/types/skill";

export function useSkillsForm() {
  const { isOverlayOpen } = useTranslationOverlay();

  const form = useAdminForm<SkillGroupData[]>({
    initialValue: skillGroupDrafts,
    loadValue: getAdminSkillGroups,
    saveValue: saveAdminSkillGroups,
  });

  const editor = useSkillsEditor({
    skillGroups: form.value,
    setSkillGroups: form.setValue,
  });

  const formDisabled = form.isLoading || form.isSaving || isOverlayOpen;

  return {
    skillGroups: form.value,
    activeGroup: editor.activeGroup,
    activeGroupId: editor.activeGroupId,
    setActiveGroupId: editor.setActiveGroupId,
    updateSkillLevel: editor.updateSkillLevel,
    updateSkillShowLevel: editor.updateSkillShowLevel,
    isLoading: form.isLoading,
    isSaving: form.isSaving,
    loadError: form.loadError,
    saveError: form.saveError,
    saveSuccess: form.saveSuccess,
    save: form.save,
    formDisabled,
  };
}
