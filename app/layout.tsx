import type { Metadata } from "next";
import { geistSans, geistMono, brandSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Caddie",
  description: "Caddie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${brandSans.variable}`}
    >
      <body className="font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
