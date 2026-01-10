import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fonts } from "./font";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SUBASH AI CHAT",
  description: "AI-powered chat assistant by Subash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.map((font) => font.variable).join(" ")}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
