import { useCallback, useEffect, useState } from "react";

type UseAdminFormSaveOptions<T> = {
  initialValue: T;
  loadValue: () => Promise<T>;
  saveValue: (value: T) => Promise<void>;
  prepareBeforeSave?: (value: T) => Promise<T>;
};

export function useAdminFormSave<T>({
  initialValue,
  loadValue,
  saveValue,
  prepareBeforeSave,
}: UseAdminFormSaveOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [saveError, setSaveError] = useState<string>();
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setLoadError(undefined);

      try {
        const loadedValue = await loadValue();

        if (isMounted) {
          setValue(loadedValue);
        }
      } catch {
        if (isMounted) {
          setLoadError(
            "Nie udało się wczytać danych z bazy. Wyświetlono wersję roboczą.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [loadValue]);

  const save = useCallback(async () => {
    setIsSaving(true);
    setSaveError(undefined);
    setSaveSuccess(false);

    try {
      const preparedValue = prepareBeforeSave
        ? await prepareBeforeSave(value)
        : value;

      await saveValue(preparedValue);
      setValue(preparedValue);
      setSaveSuccess(true);
    } catch {
      setSaveError("Nie udało się zapisać zmian. Spróbuj ponownie.");
    } finally {
      setIsSaving(false);
    }
  }, [prepareBeforeSave, saveValue, value]);

  return {
    value,
    setValue,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  };
}
