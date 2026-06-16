import AdminButton from "../components/ui/AdminButton";
import AdminField from "../components/ui/AdminField";
import AdminInput from "../components/ui/AdminInput";
import AdminPanel from "../components/ui/AdminPanel";
import AdminSelect from "../components/ui/AdminSelect";
import type { AdminFormProps } from "../types/adminForms";

type FooterLinkDraft = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
};

const footerLinkDrafts: FooterLinkDraft[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "#",
    displayOrder: 1,
  },
  {
    id: "github",
    label: "GitHub",
    href: "#",
    displayOrder: 2,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "#",
    displayOrder: 3,
  },
];

function FooterLinksForm({ language }: AdminFormProps) {
  const activeLink = footerLinkDrafts[0];

  return (
    <section className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Footer</h2>
          <p className="mt-2 text-white/60">
            Edycja linków społecznościowych w stopce.
          </p>
        </div>

        <AdminButton type="button" className="px-5 py-2 text-xl font-black">
          +
        </AdminButton>
      </header>

      <AdminPanel className="grid gap-5">
        <p className="font-mono text-sm text-white/40">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <AdminField id="footer-link-select" label="Link">
          <AdminSelect id="footer-link-select" defaultValue={activeLink.id}>
            {footerLinkDrafts.map((link) => (
              <option key={link.id} value={link.id}>
                {link.label}
              </option>
            ))}
          </AdminSelect>
        </AdminField>

        <AdminField id="footer-link-label" label="Nazwa">
          <AdminInput id="footer-link-label" defaultValue={activeLink.label} />
        </AdminField>

        <AdminField id="footer-link-href" label="Adres URL">
          <AdminInput id="footer-link-href" defaultValue={activeLink.href} />
        </AdminField>

        <AdminField id="footer-link-order" label="Kolejność">
          <AdminInput
            id="footer-link-order"
            type="number"
            min={1}
            defaultValue={activeLink.displayOrder}
          />
        </AdminField>
      </AdminPanel>
    </section>
  );
}

export default FooterLinksForm;
