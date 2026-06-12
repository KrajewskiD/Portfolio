import type { ReactNode } from "react";

type ProfileContentProps = {
  name: string;
  role: string;
  label: string;
  children: ReactNode;
};

function ProfileContent({ name, role, label, children }: ProfileContentProps) {
  return (
    <div className="max-w-2xl">
      <p className="mb-6 font-mono">{label}</p>

      <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{name}</h1>

      <p className="mt-4 text-xl">{role}</p>

      <div className="mt-8 text-lg leading-8">{children}</div>
    </div>
  );
}

export default ProfileContent;
