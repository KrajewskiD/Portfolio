type FooterIdentityProps = {
  name: string;
  description: string;
};

function FooterIdentity({ name, description }: FooterIdentityProps) {
  return (
    <div>
      <p className="font-semibold">{name}</p>
      <p className="mt-2 text-sm">{description}</p>
    </div>
  );
}

export default FooterIdentity;
