import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-provider";

export const metadata: Metadata = {
  title: {
    default: "/",
    template: "olumbe ~ %s",
  },
  description: "Vivek Olumbe - Backed by Y Combinator, Taught at Penn",
  keywords: [
    "Vivek Olumbe",
    "Y Combinator",
    "Penn",
    "entrepreneur",
    "startups",
  ],
  authors: [{ name: "Vivek Olumbe" }],
  creator: "Vivek Olumbe",
  openGraph: {
    title: "/",
    description: "Vivek Olumbe - Backed by Y Combinator, Taught at Penn",
    url: "https://olumbe.com",
    siteName: "Vivek Olumbe",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "/",
    description: "Vivek Olumbe - Backed by Y Combinator, Taught at Penn",
    images: ["/android-chrome-512x512.png"],
  },
  manifest: "/site.webmanifest",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#da532c",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-dvh w-screen bg-black bg-gradient-to-b from-slate-900/70 to-black/80"
    >
      <head>
        <link
          rel="preload"
          href="/juxel.ttf"
          as="font"
          type="font/truetype"
          crossOrigin=""
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans min-h-screen min-w-screen size-full flex flex-col items-center justify-center">
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
