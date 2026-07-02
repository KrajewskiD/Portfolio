function FooterSkeleton() {
  return (
    <div className="site-footer__inner animate-pulse" aria-hidden="true">
      <div className="site-footer__links">
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
        <div className="site-skeleton h-[2.625rem] w-[2.625rem] rounded-full" />
      </div>
    </div>
  );
}

export default FooterSkeleton;
