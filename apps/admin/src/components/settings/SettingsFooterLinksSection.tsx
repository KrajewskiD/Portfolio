import AdminAddButton from "@admin/components/ui/AdminAddButton";
import AdminExpandableSettingRow from "@admin/components/ui/AdminExpandableSettingRow";
import AdminField from "@admin/components/ui/AdminField";
import AdminInput from "@admin/components/ui/AdminInput";
import AdminSortableList from "@admin/components/ui/AdminSortableList";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { FooterLinkData } from "@shared/database/types/link";

type SettingsFooterLinksSectionProps = {
  footerLinks: FooterLinkData[];
  expandedIds: Set<string>;
  isLoading: boolean;
  disabled: boolean;
  onToggleLink: (rowId: string) => void;
  onAddLink: () => void;
  onReorder: (links: FooterLinkData[]) => void;
  onDeleteLink: (linkId: string) => void;
  onUpdateLabel: (linkId: string, value: string) => void;
  onUpdateHref: (linkId: string, value: string) => void;
  onUpdatePlatform: (linkId: string, value: string) => void;
};

function SettingsFooterLinksSection({
  footerLinks,
  expandedIds,
  isLoading,
  disabled,
  onToggleLink,
  onAddLink,
  onReorder,
  onDeleteLink,
  onUpdateLabel,
  onUpdateHref,
  onUpdatePlatform,
}: SettingsFooterLinksSectionProps) {
  return (
    <div className="admin-stack border-t border-white/10 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-stack">
          <h3 className="text-lg font-bold">Linki w stopce</h3>
          <p className="text-sm text-white/40">
            Przeciągnij uchwyt, aby zmienić kolejność linków.
          </p>
        </div>
        <AdminAddButton
          label="Dodaj link"
          disabled={disabled}
          onClick={onAddLink}
        />
      </div>

      {footerLinks.length === 0 ? (
        <p className="text-white/50">
          Brak linków w stopce. Kliknij +, aby dodać pierwszy link.
        </p>
      ) : (
        <AdminSortableList
          items={footerLinks}
          getItemId={(link) => link.id}
          disabled={disabled}
          onReorder={onReorder}
        >
          {(link, dragHandle) => {
            const rowId = `footer-${link.id}`;

            return (
              <AdminExpandableSettingRow
                title={link.label}
                isExpanded={expandedIds.has(rowId)}
                disabled={disabled}
                dragHandle={dragHandle}
                deleteLabel="Usuń link"
                onDelete={() => onDeleteLink(link.id)}
                onToggle={() => onToggleLink(rowId)}
              >
                <div className="admin-stack">
                  <AdminField
                    id={`settings-footer-link-${link.id}`}
                    label="Etykieta linku"
                    hint={`Maksymalnie ${ADMIN_NAME_MAX_LENGTH} znaków.`}
                  >
                    <AdminInput
                      id={`settings-footer-link-${link.id}`}
                      maxLength={ADMIN_NAME_MAX_LENGTH}
                      value={link.label}
                      disabled={isLoading}
                      onChange={(event) =>
                        onUpdateLabel(link.id, event.target.value)
                      }
                    />
                  </AdminField>

                  <AdminField
                    id={`settings-footer-link-href-${link.id}`}
                    label="Adres URL"
                  >
                    <AdminInput
                      id={`settings-footer-link-href-${link.id}`}
                      type="url"
                      value={link.href}
                      disabled={isLoading}
                      onChange={(event) =>
                        onUpdateHref(link.id, event.target.value)
                      }
                    />
                  </AdminField>

                  <AdminField
                    id={`settings-footer-link-platform-${link.id}`}
                    label="Platforma"
                    hint="Np. linkedin, github, youtube. Używane w bazie danych."
                  >
                    <AdminInput
                      id={`settings-footer-link-platform-${link.id}`}
                      value={link.platform}
                      disabled={isLoading}
                      onChange={(event) =>
                        onUpdatePlatform(link.id, event.target.value)
                      }
                    />
                  </AdminField>
                </div>
              </AdminExpandableSettingRow>
            );
          }}
        </AdminSortableList>
      )}
    </div>
  );
}

export default SettingsFooterLinksSection;
