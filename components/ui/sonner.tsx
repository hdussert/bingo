"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

// Under the page header, rather than half over its buttons (phones and wider screens alike)
const OFFSET = { top: 88 }

/** The app's toasts: floating pills in the heading font, like the game's big buttons, under the page header. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      // The app is always dark
      theme="dark"
      // Top: the bottom of the screen has the Save bar and the leaderboard drawer
      position="top-center"
      offset={OFFSET}
      mobileOffset={OFFSET}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-highlight" />
        ),
        info: (
          <InfoIcon className="size-5" />
        ),
        warning: (
          <TriangleAlertIcon className="size-5" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-destructive" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin" />
        ),
      }}
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
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
