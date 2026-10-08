type Props = {
  children: React.ReactNode;
};

/** The heading at the top of a page. */
export default function PageTitle({ children }: Props) {
  return (
    <h1 className="font-heading text-4xl break-words text-extruded">
      {children}
    </h1>
  );
}
