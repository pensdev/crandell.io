import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://crandell.io";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Policy Impact Simulator",
  description:
    "Illustrative fiscal and regulatory impact forecasts—educational demo.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Policy Impact Simulator",
    description:
      "Illustrative fiscal and regulatory impact forecasts—educational demo.",
    url: "/",
    siteName: "Policy Impact Simulator",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Policy Impact Simulator — illustrative fiscal scoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy Impact Simulator",
    description:
      "Illustrative fiscal and regulatory impact forecasts—educational demo.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
