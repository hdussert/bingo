/** Link `transitionTypes`: forward slides the new page in from the right, back from the left. */
export const NAV_FORWARD = ["nav-forward"];
export const NAV_BACK = ["nav-back"];

/** `<ViewTransition>` enter and exit classes for the slides; navigations without a type (refreshes, the browser's back gesture) don't animate. */
export const PAGE_SLIDES = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};
