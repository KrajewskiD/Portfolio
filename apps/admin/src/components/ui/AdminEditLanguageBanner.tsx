import type { Language } from "@shared/database/types/language";

type AdminEditLanguageBannerProps = {
  language: Language;
};

function AdminEditLanguageBanner({ language }: AdminEditLanguageBannerProps) {
  return (
    <p className="font-mono text-sm font-bold text-white/35">
      Aktywny język edycji: {language.toUpperCase()}
    </p>
  );
}

export default AdminEditLanguageBanner;
