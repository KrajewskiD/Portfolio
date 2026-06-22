import { useCallback, useEffect, useMemo, useState } from "react";

import { jsonSnapshot } from "@admin/utils/jsonSnapshot";

export type UseAdminFormSaveOptions<T> = {
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
  const [savedValue, setSavedValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string>();
  const [saveError, setSaveError] = useState<string>();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isDirty = useMemo(
    () => !isLoading && jsonSnapshot(value) !== jsonSnapshot(savedValue),
    [isLoading, savedValue, value],
  );

  const loadFromDatabase = useCallback(async (): Promise<T> => {
    return loadValue();
  }, [loadValue]);

  const applyLoadedValue = useCallback((loadedValue: T) => {
    setValue(loadedValue);
    setSavedValue(loadedValue);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setLoadError(undefined);

      try {
        const loadedValue = await loadFromDatabase();

        if (isMounted) {
          applyLoadedValue(loadedValue);
        }
      } catch (error) {
        console.error("Failed to load admin form data:", error);

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
  }, [applyLoadedValue, loadFromDatabase]);

  const discard = useCallback(() => {
    setValue(savedValue);
    setSaveError(undefined);
    setSaveSuccess(false);
  }, [savedValue]);

  const syncSavedValue = useCallback((nextValue: T) => {
    setValue(nextValue);
    setSavedValue(nextValue);
    setSaveError(undefined);
    setSaveSuccess(false);
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(undefined);
    setSaveSuccess(false);

    try {
      const preparedValue = prepareBeforeSave
        ? await prepareBeforeSave(value)
        : value;

      await saveValue(preparedValue);

      try {
        const loadedValue = await loadFromDatabase();
        applyLoadedValue(loadedValue);
      } catch (reloadError) {
        console.error("Save succeeded but failed to reload:", reloadError);
        applyLoadedValue(preparedValue);
        setSaveError(
          "Zapisano zmiany, ale nie udało się odświeżyć danych z bazy. Odśwież stronę.",
        );
        return true;
      }

      setSaveSuccess(true);
      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "Nie udało się zapisać zmian. Spróbuj ponownie.";

      setSaveError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [applyLoadedValue, loadFromDatabase, prepareBeforeSave, saveValue, value]);

  return {
    value,
    setValue,
    isLoading,
    isSaving,
    isDirty,
    loadError,
    saveError,
    saveSuccess,
    save,
    discard,
    syncSavedValue,
  };
}
