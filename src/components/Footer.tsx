import FooterIdentity from "./footer/FooterIdentity";
import FooterLink from "./footer/FooterLink";
import FooterLinksGroup from "./footer/FooterLinksGroup";
import type { FooterData } from "../types/footer";

type FooterProps = {
  footer: FooterData;
};

function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <FooterIdentity
          name={footer.name}
          description={footer.description}
        />

        <FooterLinksGroup>
          {footer.links.map((link) => (
            <FooterLink
              key={link.href}
              label={link.label}
              href={link.href}
            />
          ))}
        </FooterLinksGroup>
      </div>
    </footer>
  );
}

export default Footer;