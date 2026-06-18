function FooterSkeleton() {
  return (
    <div className="site-footer__inner animate-pulse" aria-hidden="true">
      <div>
        <div className="site-skeleton h-5 w-36" />
        <div className="site-skeleton mt-2 h-4 w-52" />
      </div>

      <div className="flex items-center gap-4">
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
        <div className="site-skeleton h-6 w-20 sm:h-12 sm:rounded-pill" />
      </div>
    </div>
  );
}

export default FooterSkeleton;
