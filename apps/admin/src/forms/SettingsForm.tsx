import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminPanel from "@admin/components/ui/AdminPanel";
import type { AdminFormProps } from "@admin/types/adminForms";

function SettingsForm({ language }: AdminFormProps) {
  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Ustawienia"
        description="Konfiguracja panelu administratora i globalnych opcji strony."
      />

      <AdminPanel>
        <p className="font-mono text-sm font-bold text-white/35">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <p className="text-white/50">Ta sekcja będzie dostępna wkrótce.</p>
      </AdminPanel>
    </section>
  );
}

export default SettingsForm;
