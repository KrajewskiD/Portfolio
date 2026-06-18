import AdminSegmentedControl from "@admin/components/ui/AdminSegmentedControl";
import type { Language } from "@shared/database/types/language";

type LanguageEditSwitchProps = {
  value: Language;
  disabled?: boolean;
  onChange: (language: Language) => void;
};

const languages = [
  { id: "pl" as const, label: "PL" },
  { id: "en" as const, label: "ENG" },
];

function LanguageEditSwitch({
  value,
  disabled = false,
  onChange,
}: LanguageEditSwitchProps) {
  return (
    <AdminSegmentedControl
      items={languages}
      activeId={value}
      disabled={disabled}
      onChange={onChange}
      variant="toggle"
    />
  );
}

export default LanguageEditSwitch;
