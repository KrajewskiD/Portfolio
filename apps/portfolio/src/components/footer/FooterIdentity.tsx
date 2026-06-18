type FooterIdentityProps = {
  name: string;
  description: string;
};

function FooterIdentity({ name, description }: FooterIdentityProps) {
  return (
    <div>
      <p className="font-semibold text-foreground">{name}</p>
      <p className="site-body--compact mt-2 text-muted">{description}</p>
    </div>
  );
}

export default FooterIdentity;
