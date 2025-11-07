import "@/styles/globals.scss";
import { StrictMode } from "react";
import HolyLoader from "holy-loader";
import { type Metadata, type Viewport } from "next";
import Providers from "./providers";
import ScrollTopButton from "@/components/scroll-top-button";
import TailwindIndicator from "@/components/tailwind-indicator";
import DeleteConfirmationDialog from "@/components/dialog/delete-confirmation-dialog";
import { env } from "@/lib/config";
import { notoSansJP } from "@/lib/fonts";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_HOST),
  title: "PDF変換と製品比較",
  applicationName: "PDF変換と製品比較",
  description:
    "Amazon、Yahooショッピング、楽天市場に掲載されている商品を検索・比較するシステムです。",
  openGraph: {
    title: "PDF変換と製品比較",
    siteName: "PDF変換と製品比較",
    description:
      "Amazon、Yahooショッピング、楽天市場に掲載されている商品を検索・比較するシステムです。",
    type: "website",
  },
  icons: [
    {
      rel: "icon",
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      url: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StrictMode>
      <html lang="jp" suppressHydrationWarning>
        <body className={notoSansJP.className}>
          <HolyLoader color="#2563eb" height="2px" easing="linear" />
          <Providers>
            {children}
            <ScrollTopButton />
            {env.NEXT_PUBLIC_APP_ENV === "staging" && <TailwindIndicator />}
            <DeleteConfirmationDialog />
          </Providers>
        </body>
      </html>
    </StrictMode>
  );
}
