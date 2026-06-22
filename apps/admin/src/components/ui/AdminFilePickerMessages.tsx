import type { ReactNode } from "react";

type AdminFilePickerMessagesProps = {
  fileError?: string;
  selectedFileName?: string;
  selectedFileHint?: ReactNode;
  markedForRemovalMessage?: string;
};

function AdminFilePickerMessages({
  fileError,
  selectedFileName,
  selectedFileHint,
  markedForRemovalMessage,
}: AdminFilePickerMessagesProps) {
  return (
    <>
      {fileError ? (
        <p role="alert" className="text-center text-sm text-red-300">
          {fileError}
        </p>
      ) : null}

      {selectedFileName ? (
        <p className="text-center text-sm text-white/50">
          Wybrany plik: {selectedFileName} (zapisze się po kliknięciu „Zapisz”)
          {selectedFileHint ? (
            <span className="mt-1 block">{selectedFileHint}</span>
          ) : null}
        </p>
      ) : null}

      {markedForRemovalMessage ? (
        <p className="text-center text-sm text-amber-300/80">
          {markedForRemovalMessage}
        </p>
      ) : null}
    </>
  );
}

export default AdminFilePickerMessages;
