import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filà Moros del Castell - Benilloba",
  description: "Web oficial de la Filà Moros del Castell de Benilloba. Tradición, historia y germanor.",
  icons: {
    icon: "/escudo.png",
    apple: "/escudo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          playfair.variable,
          "antialiased bg-background text-foreground min-h-screen"
        )}
      >
        {children}
      </body>
    </html>
  );
}
