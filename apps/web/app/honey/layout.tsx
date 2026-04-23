import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://crandell.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Honey Roofing | Crafted protection for exceptional homes",
  description:
    "Premium residential roofing — inspection, restoration, and replacement with quiet precision and enduring materials.",
  openGraph: {
    title: "Honey Roofing",
    description:
      "Premium residential roofing with meticulous care and enduring materials.",
    url: "/honey/",
    siteName: "Honey Roofing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Honey Roofing",
    description:
      "Premium residential roofing with meticulous care and enduring materials.",
  },
};

export default function HoneyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-honey-void text-parchment antialiased selection:bg-honey/30 selection:text-parchment`}
    >
      {children}
    </div>
  );
}
