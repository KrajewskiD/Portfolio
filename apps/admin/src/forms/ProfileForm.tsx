import AdminEditLanguageBanner from "@admin/components/ui/AdminEditLanguageBanner";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormSaveActions from "@admin/components/ui/AdminFormSaveActions";
import AdminFormShell from "@admin/components/ui/AdminFormShell";
import ProfileDetailsFields from "@admin/components/profile/ProfileDetailsFields";
import ProfileImageSection from "@admin/components/profile/ProfileImageSection";
import { useProfileForm } from "@admin/forms/profile/useProfileForm";
import type { AdminFormProps } from "@admin/types/adminForms";

function ProfileForm({ language }: AdminFormProps) {
  const {
    profile,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    isDirty,
    save,
    formDisabled,
    imageDraft,
    editor,
  } = useProfileForm(language);

  return (
    <AdminFormShell
      title="Profil"
      description="Edytuj dane wyświetlane w sekcji „O mnie” oraz w stopce strony."
      loadError={loadError}
      saveError={saveError}
      saveSuccess={saveSuccess}
      extraErrors={editor.bulkTranslate.error ? [editor.bulkTranslate.error] : []}
      actions={
        <AdminFormActions>
          <AdminFormSaveActions
            language={language}
            saveDisabled={formDisabled || !isDirty}
            isSaving={isSaving}
            onSave={save}
            translateDisabled={formDisabled}
            isBulkTranslating={editor.bulkTranslate.isTranslating}
            translateTitle="Przetłumacz wszystkie pola przez Gemini AI"
            onTranslateAll={editor.bulkTranslate.onTranslateAll}
          />
        </AdminFormActions>
      }
    >
      <AdminEditLanguageBanner language={language} />

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <ProfileImageSection
          profile={profile}
          language={language}
          pendingFile={imageDraft.pendingFile}
          imageMarkedForRemoval={imageDraft.markedForRemoval}
          disabled={isLoading || isSaving}
          onFileSelect={imageDraft.handleFileSelect}
          onImageMarkedForRemovalChange={imageDraft.setMarkedForRemoval}
          onUpdateImageAlt={editor.updateProfile}
        />

        <ProfileDetailsFields
          profile={profile}
          language={language}
          disabled={formDisabled}
          onUpdate={editor.updateProfile}
        />
      </div>
    </AdminFormShell>
  );
}

export default ProfileForm;
