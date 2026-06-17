import AdminModal from "./AdminModal";

import type { TranslationOverlayState } from "@admin/context/TranslationOverlayContext";

type AdminTranslationOverlayProps = {
  state: TranslationOverlayState | null;
  onCancel: () => void;
  onDismiss: () => void;
};

function AdminTranslationOverlay({
  state,
  onCancel,
  onDismiss,
}: AdminTranslationOverlayProps) {
  if (!state) {
    return null;
  }

  const isLoading = state.phase === "loading";
  const closeLabel = isLoading ? "Anuluj tłumaczenie" : "Zamknij";

  return (
    <AdminModal isOpen labelledBy="translation-overlay-title" busy={isLoading}>
      <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900 px-8 py-10 text-center shadow-2xl">
        <button
          type="button"
          className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-neutral-800 text-lg text-white/70 transition hover:border-white/25 hover:bg-neutral-700 hover:text-white"
          aria-label={closeLabel}
          onClick={isLoading ? onCancel : onDismiss}
        >
          ×
        </button>

        {isLoading ? (
          <>
            <div
              className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-white/80"
              aria-hidden
            />
            <p
              id="translation-overlay-title"
              className="text-base font-bold text-white"
            >
              Tłumaczenie w toku…
            </p>
          </>
        ) : state.phase === "success" ? (
          <>
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/15"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p
              id="translation-overlay-title"
              className="text-base font-bold text-white"
            >
              {state.message}
            </p>
          </>
        ) : (
          <>
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-400/40 bg-red-500/15"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <p
              id="translation-overlay-title"
              className="text-base font-bold text-white"
            >
              Błąd tłumaczenia
            </p>
            <p className="mt-2 text-sm text-white/60">{state.message}</p>
          </>
        )}
      </div>
    </AdminModal>
  );
}

export default AdminTranslationOverlay;
