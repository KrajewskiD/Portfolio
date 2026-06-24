import FooterIdentity from "./footer/FooterIdentity";
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
          {footer.name || footer.description ? (
            <FooterIdentity
              name={footer.name}
              description={footer.description}
              emailLabel={emailText.emailLabel}
              copyEmailLabel={emailText.copyEmailLabel}
              emailCopiedMessage={emailText.emailCopiedMessage}
              emailEmptyMessage={emailText.emailEmptyMessage}
              emailLoadErrorMessage={emailText.emailLoadErrorMessage}
              email={email}
              panelState={panelState}
              isCopied={isCopied}
              isMailLoading={isMailLoading}
              onMailClick={() => void handleMailClick()}
              onCopyEmail={() => void handleCopyEmail()}
            />
          ) : null}

          <FooterLinksGroup label={socialLinksLabel}>
            {footer.links.map((link) => (
              <FooterLink key={link.id} label={link.label} href={link.href} />
            ))}
          </FooterLinksGroup>
        </div>
      )}
    </footer>
  );
}

export default Footer;
