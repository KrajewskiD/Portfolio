import AdminModal from "./AdminModal";

type UnsavedChangesDecision = "save" | "discard" | "cancel";

type AdminUnsavedChangesDialogProps = {
  isOpen: boolean;
  onDecision: (decision: UnsavedChangesDecision) => void;
};

function AdminUnsavedChangesDialog({
  isOpen,
  onDecision,
}: AdminUnsavedChangesDialogProps) {
  return (
    <AdminModal
      isOpen={isOpen}
      labelledBy="unsaved-changes-title"
      onBackdropClick={() => onDecision("cancel")}
    >
      <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
        <h2
          id="unsaved-changes-title"
          className="text-xl font-black text-white"
        >
          Niezapisane zmiany
        </h2>
        <p className="mt-3 text-sm text-white/60">
          Dokonano zmian. Czy chcesz je zapisać?
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="admin-button admin-button-secondary cursor-pointer"
            onClick={() => onDecision("discard")}
          >
            Nie
          </button>
          <button
            type="button"
            className="admin-button admin-button-success cursor-pointer"
            onClick={() => onDecision("save")}
          >
            Tak
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

export default AdminUnsavedChangesDialog;
export type { UnsavedChangesDecision };
