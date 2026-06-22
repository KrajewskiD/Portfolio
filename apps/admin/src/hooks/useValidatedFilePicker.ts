import { useCallback, useRef, useState, type ChangeEvent } from "react";

type ValidationResult =
  | { valid: true }
  | { valid: false; message: string };

type UseValidatedFilePickerOptions = {
  validate: (file: File) => Promise<ValidationResult> | ValidationResult;
  onValidFile: (file: File) => void;
  onClear?: () => void;
};

export function useValidatedFilePicker({
  validate,
  onValidFile,
  onClear,
}: UseValidatedFilePickerOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>();

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const resetInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const handleInputChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      event.target.value = "";

      if (!file) {
        return;
      }

      const validation = await validate(file);

      if (!validation.valid) {
        setFileError(validation.message);
        return;
      }

      setFileError(undefined);
      onValidFile(file);
    },
    [onValidFile, validate],
  );

  const clearSelection = useCallback(() => {
    setFileError(undefined);
    onClear?.();
    resetInput();
  }, [onClear, resetInput]);

  return {
    inputRef,
    fileError,
    openPicker,
    resetInput,
    handleInputChange,
    clearSelection,
    setFileError,
  };
}
