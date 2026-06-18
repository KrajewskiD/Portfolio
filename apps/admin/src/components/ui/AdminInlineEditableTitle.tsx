import { useEffect, useRef, useState } from "react";

import AdminInput from "./AdminInput";

type AdminInlineEditableTitleProps = {
  id: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function AdminInlineEditableTitle({
  id,
  value,
  placeholder = "Kliknij, aby edytować",
  maxLength,
  disabled = false,
  onChange,
}: AdminInlineEditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing]);

  if (isEditing && !disabled) {
    return (
      <AdminInput
        ref={inputRef}
        id={id}
        value={value}
        maxLength={maxLength}
        className="admin-inline-editable-title__input"
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }

          if (event.key === "Escape") {
            setIsEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      id={id}
      className="admin-inline-editable-title"
      disabled={disabled}
      title="Kliknij, aby edytować"
      onClick={() => setIsEditing(true)}
    >
      {value || placeholder}
    </button>
  );
}

export default AdminInlineEditableTitle;
