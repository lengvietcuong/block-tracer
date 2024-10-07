import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

// The Roboto Mono font is used throughout the application
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Block Tracer",
  description: "Trace and visualize blockchain transactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoMono.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}