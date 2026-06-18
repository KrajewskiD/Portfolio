function ProjectShowcaseSkeleton() {
  return (
    <div className="site-showcase-strip" aria-hidden="true">
      <div className="site-showcase-strip__viewport">
        <div className="site-showcase-strip__track site-showcase-strip__track--static">
          <div className="site-showcase-strip__tile site-skeleton" />
          <div className="site-showcase-strip__tile site-skeleton" />
          <div className="site-showcase-strip__tile site-skeleton" />
        </div>
      </div>
    </div>
  );
}

export default ProjectShowcaseSkeleton;
