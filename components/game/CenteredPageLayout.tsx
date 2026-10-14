type Props = {
  /** The top bar: usually a `PageHeader`. */
  header: React.ReactNode;
  children: React.ReactNode;
};

/** A page whose content sits in the middle of the screen, the header staying at the top. */
export default function CenteredPageLayout({ header, children }: Props) {
  return (
    // Equal rows above and below center the content on the whole screen; on a short screen they shrink to the header instead of overlapping it
    <main className="mx-auto grid w-full max-w-lg flex-1 grid-rows-[1fr_auto_1fr] gap-6 px-4 py-8">
      <div className="self-start">{header}</div>
      <div>{children}</div>
    </main>
  );
}
