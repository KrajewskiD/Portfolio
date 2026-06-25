type TranslateTextErrorBody = {
  error?: string;
};

function mapEdgeFunctionError(error: string): string {
  switch (error) {
    case "Unauthorized":
      return "Brak autoryzacji. Zaloguj się ponownie do panelu admina.";
    case "Invalid request":
      return "Nieprawidłowe żądanie tłumaczenia.";
    case "Text too long":
      return "Tekst jest za długi (maks. 5000 znaków).";
    case "Batch too large":
      return "Za dużo treści do tłumaczenia w jednym żądaniu.";
    case "Too many requests":
      return "Zbyt wiele żądań. Spróbuj za chwilę.";
    case "Translation service unavailable":
      return "Usługa Gemini niedostępna. Sprawdź GEMINI_API_KEY i logi funkcji.";
    case "Translation failed":
      return "Gemini nie zwróciło tłumaczenia.";
    case "Internal Server Error":
      return "Błąd serwera tłumaczenia. Sprawdź sekrety i logi Edge Function.";
    default:
      return error;
  }
}

export async function getTranslationResponseErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const body = (await response.json()) as TranslateTextErrorBody;

    if (body.error) {
      return mapEdgeFunctionError(body.error);
    }
  } catch {
    // response body not JSON
  }

  return `Błąd Edge Function (HTTP ${response.status}).`;
}
