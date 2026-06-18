import FooterIdentity from "./footer/FooterIdentity";
import FooterLink from "./footer/FooterLink";
import FooterLinksGroup from "./footer/FooterLinksGroup";
import FooterSkeleton from "./footer/FooterSkeleton";
import type { FooterData } from "@shared/database/types/footer";

type FooterProps = {
  footer?: FooterData;
  isLoading: boolean;
  isError: boolean;
  socialLinksLabel: string;
};

function Footer({ footer, isLoading, isError, socialLinksLabel }: FooterProps) {
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
