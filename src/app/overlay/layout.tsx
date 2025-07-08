import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Padelicius Score Overlay",
  description: "Live padel scoring overlay for broadcasts.",
};

export default function OverlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout is nested within the root layout.
  // It must not contain <html>, <body>, or <head> tags.
  // The root layout already contains the Providers wrapper.
  return <>{children}</>;
}
