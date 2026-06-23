type FooterIdentityProps = {
  name: string;
  description: string;
};

function FooterIdentity({ name, description }: FooterIdentityProps) {
  return (
    <div>
      {name ? <p className="font-semibold text-foreground">{name}</p> : null}
      {description ? (
        <p className="site-body--compact site-footer__description mt-2 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default FooterIdentity;
