import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Borceguí | Innovación Total en Calzados (Sistema Dial 2026)",
  description:
    "Calzado vanguardista con sistema de ajuste rápido de dial giratorio sin cordones. Línea Deportiva y Casual. Tienda en Chacao, Caracas.",
  keywords: ["Borceguí", "calzado", "sin cordones", "dial giratorio", "Caracas", "zapatos deportivos", "Chacao"],
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
