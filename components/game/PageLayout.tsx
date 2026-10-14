import PageTitle from "@/components/game/PageTitle";
import { cn } from "@/lib/utils";

type Props = {
  /** The top bar: usually a `PageHeader`. */
  header: React.ReactNode;
  title: string;
  /** A line under the title saying what the page is for. */
  subtitle: string;
  /** Extra classes for the page, like room for a fixed bottom bar. */
  className?: string;
  children: React.ReactNode;
};

/** A page that reads top to bottom: the header, the title and its subtitle, then the content. */
export default function PageLayout({
  header,
  title,
  subtitle,
  className,
  children,
}: Props) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-8",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-2">
        {header}
        <PageTitle>{title}</PageTitle>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </main>
  );
}
