import { useMemo, useState } from "react";

import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminButton from "@admin/components/ui/AdminButton";
import AdminCustomSelect from "@admin/components/ui/AdminCustomSelect";
import AdminDeleteButton from "@admin/components/ui/AdminDeleteButton";
import AdminField from "@admin/components/ui/AdminField";
import AdminFormActions from "@admin/components/ui/AdminFormActions";
import AdminFormHeader from "@admin/components/ui/AdminFormHeader";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminPanel from "@admin/components/ui/AdminPanel";
import { footerLinkDrafts } from "@admin/data/adminDrafts";
import { useAdminFormSave } from "@admin/hooks/useAdminFormSave";
import {
  getAdminFooterLinks,
  saveAdminFooterLinks,
} from "@admin/services/footerContentService";
import type { AdminFormProps } from "@admin/types/adminForms";
import type { FooterLinkData } from "@shared/database/types/link";

function FooterLinksForm({ language }: AdminFormProps) {
  const {
    value: footerLinks,
    setValue: setFooterLinks,
    isLoading,
    isSaving,
    loadError,
    saveError,
    saveSuccess,
    save,
  } = useAdminFormSave<FooterLinkData[]>({
    initialValue: footerLinkDrafts,
    loadValue: getAdminFooterLinks,
    saveValue: saveAdminFooterLinks,
  });

  const [activeLinkId, setActiveLinkId] = useState(
    footerLinkDrafts[0]?.id ?? "",
  );

  const activeLink = useMemo(
    () =>
      footerLinks.find((link) => link.id === activeLinkId) ?? footerLinks[0],
    [activeLinkId, footerLinks],
  );

  function updateActiveLink(
    field: keyof Pick<FooterLinkData, "label" | "href" | "displayOrder">,
    value: string | number,
  ) {
    setFooterLinks((current) =>
      current.map((link) =>
        link.id === activeLink.id ? { ...link, [field]: value } : link,
      ),
    );
  }

  function addFooterLink() {
    const nextIndex = footerLinks.length + 1;
    const nextId = `link-${String(nextIndex).padStart(2, "0")}`;

    const nextLink: FooterLinkData = {
      id: nextId,
      label: "Nowy link",
      href: "#",
      displayOrder: nextIndex,
    };

    setFooterLinks((current) => [...current, nextLink]);
    setActiveLinkId(nextId);
  }

  function deleteFooterLink() {
    if (footerLinks.length <= 1) {
      return;
    }

    const remainingLinks = footerLinks.filter(
      (link) => link.id !== activeLink.id,
    );

    setFooterLinks(remainingLinks);
    setActiveLinkId(remainingLinks[0]?.id ?? "");
  }

  if (!activeLink) {
    return null;
  }

  return (
    <section className="admin-stack">
      <AdminFormHeader
        title="Linki w stopce"
        description="Zarządzaj linkami do mediów społecznościowych wyświetlanymi w stopce strony."
        actions={
          <AdminFormActions>
            <AdminAddButton label="Dodaj link" onClick={addFooterLink} />
            <AdminButton
              type="button"
              variant="secondary"
              disabled={isLoading || isSaving}
              onClick={() => void save()}
            >
              {isSaving ? "Zapisywanie..." : "Zapisz"}
            </AdminButton>
          </AdminFormActions>
        }
      />

      {loadError ? (
        <p role="status" className="text-sm text-amber-300">
          {loadError}
        </p>
      ) : null}

      {saveError ? (
        <p role="alert" className="text-sm text-red-300">
          {saveError}
        </p>
      ) : null}

      {saveSuccess ? (
        <p role="status" className="text-sm text-emerald-300">
          Zmiany zostały zapisane.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <AdminField id="footer-link-select" label="Link">
            <AdminCustomSelect
              id="footer-link-select"
              value={activeLink.id}
              disabled={isLoading}
              options={footerLinks.map((link) => ({
                value: link.id,
                label: link.label,
              }))}
              onChange={setActiveLinkId}
            />
          </AdminField>
        </div>

        <AdminDeleteButton
          label="Usuń link"
          disabled={isLoading || isSaving || footerLinks.length <= 1}
          onClick={deleteFooterLink}
        />
      </div>

      <AdminPanel>
        <p className="font-mono text-sm font-bold text-white/35">
          Aktywny język edycji: {language.toUpperCase()}
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminField id="footer-link-label" label="Etykieta">
            <AdminInput
              id="footer-link-label"
              value={activeLink.label}
              disabled={isLoading}
              onChange={(event) =>
                updateActiveLink("label", event.target.value)
              }
            />
          </AdminField>

          <AdminField id="footer-link-order" label="Kolejność">
            <AdminInput
              id="footer-link-order"
              type="number"
              min={1}
              value={activeLink.displayOrder}
              disabled={isLoading}
              onChange={(event) =>
                updateActiveLink("displayOrder", Number(event.target.value))
              }
            />
          </AdminField>
        </div>

        <AdminField id="footer-link-href" label="Adres URL">
          <AdminInput
            id="footer-link-href"
            value={activeLink.href}
            disabled={isLoading}
            onChange={(event) => updateActiveLink("href", event.target.value)}
          />
        </AdminField>
      </AdminPanel>
    </section>
  );
}

export default FooterLinksForm;
