import { profileDraft } from "@admin/data/adminDrafts";
import { useProfileEditor } from "@admin/forms/profile/useProfileEditor";
import { useAdminForm } from "@admin/hooks/useAdminForm";
import { useProfileImageDraft } from "@admin/hooks/useProfileImageDraft";
import { useTranslationOverlay } from "@admin/context/useTranslationOverlay";
import {
  getAdminProfile,
  saveAdminProfile,
} from "@admin/services/profileContentService";
import type { Language } from "@shared/database/types/language";

export function useProfileForm(language: Language) {
  const imageDraft = useProfileImageDraft();
  const { isOverlayOpen } = useTranslationOverlay();

  const form = useAdminForm({
    initialValue: profileDraft,
    loadValue: getAdminProfile,
    saveValue: saveAdminProfile,
    prepareBeforeSave: imageDraft.prepareBeforeSave,
    extraDirty: imageDraft.hasPendingEdits,
    onDiscard: imageDraft.discardPending,
  });

  const formDisabled = form.isLoading || form.isSaving || isOverlayOpen;

  const editor = useProfileEditor({
    language,
    profile: form.value,
    setProfile: form.setValue,
    formDisabled,
  });

  return {
    profile: form.value,
    isLoading: form.isLoading,
    isSaving: form.isSaving,
    loadError: form.loadError,
    saveError: form.saveError,
    saveSuccess: form.saveSuccess,
    isDirty: form.isDirty,
    save: form.save,
    formDisabled,
    imageDraft,
    editor,
  };
}
