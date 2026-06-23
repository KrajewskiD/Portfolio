type SiteInfoRevealProps = {
  isOpen: boolean;
  text: string;
  emptyMessage: string;
};

function SiteInfoReveal({ isOpen, text, emptyMessage }: SiteInfoRevealProps) {
  if (!isOpen) {
    return null;
  }

  const trimmedText = text.trim();

  return (
    <div className="site-hero-email-reveal">
      <div className="site-hero-email-reveal__field">
        {trimmedText ? (
          <p className="site-hero-email-reveal__value site-hero-info-reveal__text">
            {trimmedText}
          </p>
        ) : (
          <p className="site-hero-email-reveal__message">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}

export default SiteInfoReveal;
