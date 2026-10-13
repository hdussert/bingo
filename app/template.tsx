import { ViewTransition } from "react";

// Navigations without a type (refreshes, the browser's back gesture) don't animate
const SLIDES = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

/** Slides pages in and out on navigation: a template remounts on every navigation, unlike a layout. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={SLIDES} exit={SLIDES} default="none">
      {children}
    </ViewTransition>
  );
}
