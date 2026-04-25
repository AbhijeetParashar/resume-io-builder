import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-io-builder.vercel.app"),
  title: {
    default: "Resume.io PDF Downloader",
    template: "%s | Resume.io PDF Downloader",
  },
  description:
    "Download your resume.io resume as a pixel-perfect, high-quality PDF with all hyperlinks fully preserved. Free, no sign-up required. Built by Abhijeet Kumar.",
  keywords: [
    "resume.io",
    "resume PDF download",
    "resume.io PDF",
    "rendering token",
    "resume converter",
    "Abhijeet Kumar",
  ],
  authors: [{ name: "Abhijeet Kumar", url: "https://www.iamabhijeet.com/" }],
  creator: "Abhijeet Kumar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://resume-io-builder.vercel.app",
    siteName: "Resume.io PDF Downloader",
    title: "Resume.io PDF Downloader — by Abhijeet Kumar",
    description:
      "Download your resume.io resume as a pixel-perfect PDF with all hyperlinks preserved. Free and open source.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resume.io PDF Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume.io PDF Downloader — by Abhijeet Kumar",
    description:
      "Download your resume.io resume as a pixel-perfect PDF with all hyperlinks preserved. Free and open source.",
    creator: "@AbhijeetParash7",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://resume-io-builder.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-orange-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
