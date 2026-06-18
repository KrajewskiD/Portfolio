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
    <footer className="border-t" aria-busy={isLoading}>
      {isLoading ? (
        <FooterSkeleton />
      ) : isError || !footer?.links.length ? null : (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
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
