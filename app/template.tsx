import PageSlide from "@/components/game/PageSlide";

/** Slides pages in and out on navigation: a template remounts on every navigation, unlike a layout. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageSlide>{children}</PageSlide>;
}
