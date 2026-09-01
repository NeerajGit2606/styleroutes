import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { AddedToast } from "@/components/AddedToast";
import { EnquiryModal } from "@/components/EnquiryModal";
import { SITE_URL, SUPPORT_ADDRESS, SUPPORT_EMAIL, SUPPORT_PHONE_TEL } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Style Route — Where Style Meets Comfort",
    template: "%s — Style Route",
  },
  description: "Style Route — premium, comfort-first kidswear for newborns, toddlers, and kids. Tees, shirts, shorts, pants, sets, and dungarees built for every big day.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Style Route",
    title: "Style Route — Where Style Meets Comfort",
    description: "Premium, comfort-first kidswear for newborns, toddlers, and kids.",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Style Route",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SUPPORT_ADDRESS.line1,
        addressLocality: SUPPORT_ADDRESS.locality,
        addressRegion: SUPPORT_ADDRESS.region,
        postalCode: SUPPORT_ADDRESS.postalCode,
        addressCountry: SUPPORT_ADDRESS.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: SUPPORT_PHONE_TEL,
        email: SUPPORT_EMAIL,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Style Route",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <AddedToast />
          <EnquiryModal />
        </CartProvider>
      </body>
    </html>
  );
}
