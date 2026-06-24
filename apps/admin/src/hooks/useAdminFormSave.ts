import { useCallback, useEffect, useMemo, useState } from "react";

import { jsonSnapshot } from "@admin/utils/jsonSnapshot";

export type UseAdminFormSaveOptions<T> = {
  initialValue: T;
  loadValue: () => Promise<T>;
  saveValue: (value: T) => Promise<void>;
  prepareBeforeSave?: (value: T) => Promise<AdminFormPrepareResult<T>>;
};

export type AdminFormSavePreparation<T> = {
  value: T;
  onSaveSuccess?: () => Promise<void> | void;
  onSaveError?: () => Promise<void> | void;
};

type AdminFormPrepareResult<T> = T | AdminFormSavePreparation<T>;

function isSavePreparation<T>(
  result: AdminFormPrepareResult<T>,
): result is AdminFormSavePreparation<T> {
  return (
    typeof result === "object" &&
    result !== null &&
    "value" in result &&
    ("onSaveSuccess" in result || "onSaveError" in result)
  );
}

function normalizeSavePreparation<T>(
  result: AdminFormPrepareResult<T>,
): AdminFormSavePreparation<T> {
  return isSavePreparation(result) ? result : { value: result };
}

function getAdminSaveErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Nie udało się zapisać zmian. Spróbuj ponownie.";
}

async function rollbackPreparedSave<T>(
  preparation: AdminFormSavePreparation<T>,
): Promise<void> {
  try {
    await preparation.onSaveError?.();
  } catch (rollbackError) {
    console.error("Save failed and cleanup rollback failed:", rollbackError);
  }
}

async function savePreparedValue<T>(
  preparation: AdminFormSavePreparation<T>,
  saveValue: (value: T) => Promise<void>,
): Promise<void> {
  try {
    await saveValue(preparation.value);
  } catch (saveValueError) {
    await rollbackPreparedSave(preparation);
    throw saveValueError;
  }
}

async function runPostSaveCleanup<T>(
  preparation: AdminFormSavePreparation<T>,
): Promise<boolean> {
  try {
    await preparation.onSaveSuccess?.();
    return true;
  } catch (error) {
    console.error("Save succeeded but post-save cleanup failed:", error);
    return false;
  }
}

async function reloadSavedValue<T>(
  loadFromDatabase: () => Promise<T>,
  applyLoadedValue: (loadedValue: T) => void,
  fallbackValue: T,
  setSaveError: (message: string) => void,
): Promise<boolean> {
  try {
    const loadedValue = await loadFromDatabase();
    applyLoadedValue(loadedValue);
    return true;
  } catch (reloadError) {
    console.error("Save succeeded but failed to reload:", reloadError);
    applyLoadedValue(fallbackValue);
    setSaveError(
      "Zapisano zmiany, ale nie udało się odświeżyć danych z bazy. Odśwież stronę.",
    );
    return false;
  }
}

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
      const preparation = normalizeSavePreparation(
        prepareBeforeSave ? await prepareBeforeSave(value) : value,
      );
      const preparedValue = preparation.value;
      const showCleanupError = () => {
        setSaveError(
          "Zapisano zmiany, ale nie udało się posprzątać plików w storage. Sprawdź bucket.",
        );
      };

      await savePreparedValue(preparation, saveValue);
      const cleanupSucceeded = await runPostSaveCleanup(preparation);
      const reloadSucceeded = await reloadSavedValue(
        loadFromDatabase,
        applyLoadedValue,
        preparedValue,
        setSaveError,
      );

      if (!reloadSucceeded) {
        return true;
      }

      if (!cleanupSucceeded) {
        showCleanupError();
        return true;
      }

      setSaveSuccess(true);
      return true;
    } catch (error) {
      setSaveError(getAdminSaveErrorMessage(error));
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
