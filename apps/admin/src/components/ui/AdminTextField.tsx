import type { ComponentProps } from "react";

import AdminField from "./AdminField";
import AdminInput from "./AdminInput";

type AdminTextFieldProps = {
  id: string;
  label: string;
  hint?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
} & Pick<
  ComponentProps<typeof AdminInput>,
  "type" | "placeholder" | "maxLength" | "min" | "max" | "className" | "aria-label"
>;

function AdminTextField({
  id,
  label,
  hint,
  value,
  disabled = false,
  onChange,
  type,
  placeholder,
  maxLength,
  min,
  max,
  className,
  "aria-label": ariaLabel,
}: AdminTextFieldProps) {
  return (
    <AdminField id={id} label={label} hint={hint}>
      <AdminInput
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        max={max}
        className={className}
        aria-label={ariaLabel}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </AdminField>
  );
}

export default AdminTextField;
