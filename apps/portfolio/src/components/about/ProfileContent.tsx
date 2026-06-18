import type { ReactNode } from "react";

type ProfileContentProps = {
  name: string;
  role: string;
  label: string;
  children: ReactNode;
};

function ProfileContent({ name, role, label, children }: ProfileContentProps) {
  return (
    <div className="site-profile">
      <p className="site-label mb-6">{label}</p>

      <h1 className="site-title--hero">{name}</h1>

      <p className="site-subtitle">{role}</p>

      <div className="site-body mt-8">{children}</div>
    </div>
  );
}

export default ProfileContent;
