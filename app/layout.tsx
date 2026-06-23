import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site-data";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ variable: "--font-prohome-sans", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-prohome-serif", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Home and Property Service Pages`,
    template: "%s",
  },
  description:
    "Canada-wide customer-first service pages for plumbing, electrical, tree, painting, flooring, and restoration support.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | Home and Property Service Pages`,
    description: "Customer-first pages for urgent repairs, finish work, and local service coverage across Canada.",
    url: absoluteUrl("/"),
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA" className={`${bricolage.variable} ${fraunces.variable}`}>
      <body id="top">
        <SiteNavbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
