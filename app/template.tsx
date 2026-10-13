import { ViewTransition } from "react";
import { PAGE_SLIDES } from "@/lib/transitions";

/** Slides pages in and out on navigation: a template remounts on every navigation, unlike a layout. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={PAGE_SLIDES} exit={PAGE_SLIDES} default="none">
      {children}
    </ViewTransition>
  );
}
