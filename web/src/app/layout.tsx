import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Script from "next/script";
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
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
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
