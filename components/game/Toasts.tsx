import { Toaster } from "@/components/ui/sonner";

/** The app's toasts: floating pills in the heading font, like the game's big buttons, at the top of the screen. */
export default function Toasts() {
  return (
    <Toaster
      theme="dark"
      // Top: the bottom of the screen has the Save bar and the leaderboard drawer
      position="top-center"
      // Under the page header, rather than half over its buttons
      mobileOffset={{ top: 88 }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "9999px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // Sonner sets its own system font and spacing
          toast:
            "justify-center! gap-2! px-5! py-3.5! font-sans! shadow-lg! shadow-black/30!",
          // Plain font-heading: the app's caps rule hangs on that class
          title: "font-heading text-lg font-normal! leading-none!",
          // Sized to the text, so the icon and text sit in the middle
          content: "flex-none!",
          icon: "[&_svg]:size-5!",
          success: "[&_[data-icon]]:text-highlight",
          error: "[&_[data-icon]]:text-destructive",
        },
      }}
    />
  );
}
