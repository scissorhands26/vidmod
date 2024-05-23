import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "VidMod - Free Unlimited File Converter | Image, Video, and Audio",
  description: `Unleash your creativity with VidMod – the ultimate online tool for free and unlimited multimedia conversion. Effortlessly transform images, audio, and videos without restrictions. Start converting now and elevate your content like never before!`,
  creator: "ScissorHands26",
  keywords: [
    "image converter",
    "video converter",
    "audio converter",
    "unlimited image converter",
    "unlimited video converter",
    "free file converter",
    "multimedia conversion",
  ].join(", "),
  openGraph: {
    title: "VidMod - Free Unlimited File Converter",
    description: `Unleash your creativity with VidMod – the ultimate online tool for free and unlimited multimedia conversion. Transform images, audio, and videos effortlessly, without restrictions.`,
    url: "https://vidmod.io",
    type: "website",
    images: [
      {
        url: "https://vidmod.io/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VidMod - Free Unlimited File Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VidMod - Free Unlimited File Converter",
    description: `Unleash your creativity with VidMod – the ultimate online tool for free and unlimited multimedia conversion. Transform images, audio, and videos effortlessly, without restrictions.`,
    creator: "@ScissorHands26",
    images: [
      {
        url: "https://vidmod.io",
        alt: "VidMod - Free Unlimited File Converter",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950`}>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark"]}
        > */}
        {/* <Navbar /> */}

        <div className="container min-h-screen max-w-4xl pt-32 lg:max-w-6xl lg:pt-36 2xl:max-w-7xl 2xl:pt-44">
          {children}
        </div>
        <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
