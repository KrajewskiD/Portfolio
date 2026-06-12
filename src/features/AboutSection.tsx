import ProfileContent from "../components/about/ProfileContent";
import ProfileImage from "../components/about/ProfileImage";
import type { Profile } from "../types/profile";

type AboutSectionProps = {
  profile: Profile;
  label: string;
};

function AboutSection({ profile, label }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="flex scroll-mt-24 items-center py-16"
    >
      <div className="grid w-full items-center gap-12 rounded-3xl border p-6 sm:p-10 lg:grid-cols-2 lg:p-16">
        <ProfileImage
          imageUrl={profile.imageUrl}
          alt={profile.imageAlt}
        />

        <ProfileContent
          name={profile.name}
          role={profile.role}
        >
          <p>{profile.description}</p>
        </ProfileContent>
      </div>
    </section>
  );
}

export default AboutSection;