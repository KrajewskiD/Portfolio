import { useCallback } from "react";

import {
  patchSettings,
  updateFooterLink,
} from "@admin/forms/settings/settingsFormUpdates";
import type { AdminSettingsData } from "@admin/services/settingsContentService";
import { ADMIN_NAME_MAX_LENGTH } from "@shared/constants/adminSettings";
import type { FooterLinkData } from "@shared/database/types/link";
import { createFooterLinkPlatform } from "@shared/utils/footerLink";
import type { Dispatch, SetStateAction } from "react";

type UseSettingsFooterLinksEditorParams = {
  footerLinks: FooterLinkData[];
  setSettings: Dispatch<SetStateAction<AdminSettingsData>>;
  addExpandedId: (id: string) => void;
  removeExpandedId: (id: string) => void;
};

export function useSettingsFooterLinksEditor({
  footerLinks,
  setSettings,
  addExpandedId,
  removeExpandedId,
}: UseSettingsFooterLinksEditorParams) {
  const updateFooterLabel = useCallback(
    (linkId: string, value: string) => {
      const nextValue = value.slice(0, ADMIN_NAME_MAX_LENGTH);

      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          label: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const updateFooterHref = useCallback(
    (linkId: string, value: string) => {
      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          href: value,
        })),
      );
    },
    [setSettings],
  );

  const updateFooterPlatform = useCallback(
    (linkId: string, value: string) => {
      const nextValue = createFooterLinkPlatform(value);

      setSettings((current) =>
        updateFooterLink(current, linkId, (link) => ({
          ...link,
          platform: nextValue,
        })),
      );
    },
    [setSettings],
  );

  const deleteFooterLink = useCallback(
    (linkId: string) => {
      setSettings((current) =>
        patchSettings(current, {
          footerLinks: current.footerLinks.filter((link) => link.id !== linkId),
        }),
      );
      removeExpandedId(`footer-${linkId}`);
    },
    [removeExpandedId, setSettings],
  );

  const addFooterLink = useCallback(() => {
    const nextId = crypto.randomUUID();
    const nextIndex = footerLinks.length + 1;
    const label = "Nowy link";

    const nextLink: FooterLinkData = {
      id: nextId,
      label,
      href: "#",
      platform: createFooterLinkPlatform(label),
      displayOrder: nextIndex,
    };

    setSettings((current) =>
      patchSettings(current, {
        footerLinks: [...current.footerLinks, nextLink],
      }),
    );
    addExpandedId(`footer-${nextId}`);
  }, [addExpandedId, footerLinks.length, setSettings]);

  const reorderFooterLinks = useCallback(
    (nextLinks: FooterLinkData[]) => {
      setSettings((current) =>
        patchSettings(current, { footerLinks: nextLinks }),
      );
    },
    [setSettings],
  );

  return {
    updateFooterLabel,
    updateFooterHref,
    updateFooterPlatform,
    deleteFooterLink,
    addFooterLink,
    reorderFooterLinks,
  };
}
