import { useNavigate } from "react-router";
import { signOut } from "../services/authService";

function DashboardPage() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Panel administratora</h1>

      <button type="button" onClick={handleSignOut}>
        Wyloguj
      </button>
    </main>
  );
}

export default DashboardPage;
