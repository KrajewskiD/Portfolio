import AdminCustomSelect from "@admin/components/ui/AdminCustomSelect";

type AdminEntitySelectProps<TItem> = {
  id: string;
  ariaLabel: string;
  className?: string;
  compact?: boolean;
  value: string;
  disabled?: boolean;
  items: TItem[];
  getItemId: (item: TItem) => string;
  getItemLabel: (item: TItem) => string;
  onChange: (id: string) => void;
};

function AdminEntitySelect<TItem>({
  id,
  ariaLabel,
  className,
  compact,
  value,
  disabled,
  items,
  getItemId,
  getItemLabel,
  onChange,
}: AdminEntitySelectProps<TItem>) {
  return (
    <AdminCustomSelect
      id={id}
      ariaLabel={ariaLabel}
      className={className}
      compact={compact}
      value={value}
      disabled={disabled}
      options={items.map((item) => ({
        value: getItemId(item),
        label: getItemLabel(item),
      }))}
      onChange={onChange}
    />
  );
}

export default AdminEntitySelect;
