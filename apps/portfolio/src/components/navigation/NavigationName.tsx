type NavigationNameProps = {
  children: string;
};

function NavigationName({ children }: NavigationNameProps) {
  return <span className="site-island__name">{children}</span>;
}

export default NavigationName;
