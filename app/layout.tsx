import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { TokenProvider } from "@/contexts/TokenContext";
import { AdsProvider } from "@/contexts/AdsContext";
import { OfferProvider } from "@/contexts/OfferContext";
import { ChatProvider } from "@/contexts/ChatContext";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VentureBridge — Platform Ekosistem Bisnis Indonesia",
    template: "%s | VentureBridge",
  },
  description:
    "Temukan modal, co-founder, mentor, dan peluang bisnis yang tepat dalam satu platform. VentureBridge menghubungkan potensi dengan ekosistem.",
  keywords: ["startup", "investor", "Indonesia", "bisnis", "peluang", "co-founder", "mentor"],
  openGraph: {
    title: "VentureBridge — Platform Ekosistem Bisnis Indonesia",
    description: "Temukan modal, co-founder, mentor, dan peluang bisnis yang tepat.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
        <AuthProvider>
          <TokenProvider>
            <AdsProvider>
              <OfferProvider>
                <ChatProvider>{children}</ChatProvider>
              </OfferProvider>
            </AdsProvider>
          </TokenProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
