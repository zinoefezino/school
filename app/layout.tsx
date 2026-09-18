import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const switzer = localFont({
  src: [
    {
      path: "../src/Switzer-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../src/Switzer-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../src/Switzer-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../src/Switzer-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../src/Switzer-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../src/Switzer-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../src/Switzer-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/Switzer-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../src/Switzer-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../src/Switzer-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../src/Switzer-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../src/Switzer-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../src/Switzer-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../src/Switzer-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../src/Switzer-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../src/Switzer-ExtraboldItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../src/Switzer-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../src/Switzer-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "School",
  description:
    " School is a private school that blends strong academics with hands-on learning, guiding students from foundation years through to graduation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${switzer.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
