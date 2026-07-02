import ProfileEmailAction from "@portfolio/components/about/ProfileEmailAction";
import FooterLink from "./footer/FooterLink";
import FooterLinksGroup from "./footer/FooterLinksGroup";
import FooterSkeleton from "./footer/FooterSkeleton";
import { useProfileEmailReveal } from "@portfolio/hooks/useProfileEmailReveal";
import type { Translations } from "@portfolio/locales/translations";
import type { FooterData } from "@shared/database/types/footer";

type FooterProps = {
  footer?: FooterData;
  isLoading: boolean;
  isError: boolean;
  emailText: Translations["about"];
  socialLinksLabel: string;
};

function Footer({
  footer,
  isLoading,
  isError,
  emailText,
  socialLinksLabel,
}: FooterProps) {
  const {
    email,
    panelState,
    isCopied,
    isMailExpanded,
    isMailLoading,
    handleMailClick,
    handleCopyEmail,
  } = useProfileEmailReveal();

  return (
    <footer className="site-footer" aria-busy={isLoading}>
      {isLoading ? (
        <FooterSkeleton />
      ) : isError || !footer?.links.length ? null : (
        <div className="site-footer__inner">
          <FooterLinksGroup label={socialLinksLabel}>
            {footer.links.map((link) => (
              <FooterLink key={link.id} label={link.label} href={link.href} />
            ))}

            <ProfileEmailAction
              className="site-footer__email-action"
              emailLabel={emailText.emailLabel}
              copyEmailLabel={emailText.copyEmailLabel}
              emailCopiedMessage={emailText.emailCopiedMessage}
              emailEmptyMessage={emailText.emailEmptyMessage}
              emailLoadErrorMessage={emailText.emailLoadErrorMessage}
              panelState={panelState}
              email={email}
              isCopied={isCopied}
              isMailExpanded={isMailExpanded}
              isMailLoading={isMailLoading}
              direction="right"
              size="2.625rem"
              onMailClick={() => void handleMailClick()}
              onCopyEmail={() => void handleCopyEmail()}
            />
          </FooterLinksGroup>
        </div>
      )}
    </footer>
  );
}

export default Footer;
