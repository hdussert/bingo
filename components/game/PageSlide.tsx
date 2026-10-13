import { ViewTransition } from "react";

/** `<ViewTransition>` enter and exit classes for the slides; navigations without a type (refreshes, the browser's back gesture) don't animate. */
const SLIDES = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

/** Slides its content in and out on navigations with a `NAV_FORWARD` or `NAV_BACK` type; key it to slide between screens of the same route. */
export default function PageSlide({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={SLIDES} exit={SLIDES} default="none">
      {children}
    </ViewTransition>
  );
}
