type NavigationNameProps = {
  children: string;
};

function NavigationName({
  children,
}: NavigationNameProps) {
  return (
    <span className="px-3 py-2 font-semibold">
      {children}
    </span>
  );
}

export default NavigationName;