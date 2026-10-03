import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Borceguí | Innovación Total en Calzados (Sistema Dial 2026)",
  description:
    "Calzado vanguardista con sistema de ajuste rápido de dial giratorio sin cordones. Línea Deportiva y Casual. Tienda en Chacao, Caracas.",
  keywords: ["Borceguí", "calzado", "sin cordones", "dial giratorio", "Caracas", "zapatos deportivos", "Chacao"],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-borcegui.png",
    shortcut: "/logo-borcegui.png",
    apple: "/logo-borcegui.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Borceguí",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
