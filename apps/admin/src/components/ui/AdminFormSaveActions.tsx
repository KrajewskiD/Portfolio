import type { Language } from "@shared/database/types/language";

import AdminSaveButton from "./AdminSaveButton";
import AdminTranslateButton from "./AdminTranslateButton";

type AdminFormSaveActionsProps = {
  language: Language;
  saveDisabled?: boolean;
  isSaving?: boolean;
  onSave: () => void | Promise<unknown>;
  translateDisabled?: boolean;
  isBulkTranslating?: boolean;
  onTranslateAll?: () => void | Promise<void>;
  translateTitle?: string;
};

function AdminFormSaveActions({
  language,
  saveDisabled = false,
  isSaving = false,
  onSave,
  translateDisabled = false,
  isBulkTranslating = false,
  onTranslateAll,
  translateTitle,
}: AdminFormSaveActionsProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <AdminSaveButton
        disabled={saveDisabled}
        isSaving={isSaving}
        onSave={onSave}
      />

      {onTranslateAll ? (
        <AdminTranslateButton
          language={language}
          disabled={translateDisabled}
          isLoading={isBulkTranslating}
          title={translateTitle}
          onClick={() => void onTranslateAll()}
        />
      ) : null}
    </div>
  );
}

export default AdminFormSaveActions;
