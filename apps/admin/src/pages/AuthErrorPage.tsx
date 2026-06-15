function AuthErrorPage() {
  return (
    <main role="alert">
      <h1>Nie udało się sprawdzić uprawnień</h1>
      <p>Sprawdź połączenie i spróbuj ponownie.</p>

      <button type="button" onClick={() => window.location.reload()}>
        Spróbuj ponownie
      </button>
    </main>
  );
}

export default AuthErrorPage;
