import type { Metadata } from "next";
import { Inter, Alegreya } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beyond The Pages | Quando a história sai do papel",
  description: "Plataforma premium para organizar, registrar e consultar briefings de leitura, análises de personagens e recomendações literárias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${alegreya.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#1a0c05] text-white selection:bg-[#c5a059] selection:text-[#1a0c05] font-sans">
        {children}
      </body>
    </html>
  );
}
