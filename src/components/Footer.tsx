const links = [
  { label: "LinkedIn", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "YouTube", href: "#" },
];

function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Dawid Krajewski</p>
          <p className="mt-2 text-sm">React · TypeScript · Supabase</p>
        </div>

        <nav className="flex flex-row items-center gap-4">
            {links.map((link) => (
                <a
                key={link.label}
                href={link.href}
                className="py-2 text-sm sm:rounded-full sm:border sm:px-5 sm:py-3 sm:text-base"
                >
                {link.label} ↗
                </a>
            ))}
        </nav>
      </div>
    </footer>
  );
}

export default Footer;