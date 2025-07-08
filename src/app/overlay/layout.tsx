import type { Metadata } from "next";
import Providers from '@/components/providers';
import '../globals.css';

export const metadata: Metadata = {
  title: "Padelicius Score Overlay",
  description: "Live padel scoring overlay for broadcasts.",
};

export default function OverlayLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-transparent">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
