import { markdownFieldHint } from "@shared/content/markdownHint";

import AdminMarkdownPreview from "./AdminMarkdownPreview";
import {
  AdminLocalizedTextarea,
  type AdminLocalizedTextareaProps,
} from "./AdminLocalizedField";

type AdminLocalizedMarkdownFieldProps<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
> = Omit<AdminLocalizedTextareaProps<TPl, TEn, TSource>, "after">;

export function AdminLocalizedMarkdownField<
  TPl extends string,
  TEn extends string,
  TSource extends Record<TPl | TEn, string>,
>({
  hint = markdownFieldHint,
  rows = 8,
  ...props
}: AdminLocalizedMarkdownFieldProps<TPl, TEn, TSource>) {
  return (
    <AdminLocalizedTextarea
      {...props}
      hint={hint}
      rows={rows}
      after={(localizedValue) => (
        <AdminMarkdownPreview content={localizedValue} />
      )}
    />
  );
}
