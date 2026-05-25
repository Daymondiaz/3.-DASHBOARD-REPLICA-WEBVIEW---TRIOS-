import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔥 METADATA PERSONALIZADA
export const metadata: Metadata = {
  title: "Movies App",
  description: "Aplicación de películas con autenticación y consumo de API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-100">

        {/* 🔥 HEADER GLOBAL */}
        <header className="bg-black text-white p-4 text-center text-xl font-bold">
          🎬 Movies App
        </header>

        {/* CONTENIDO */}
        <main className="flex-1">
          {children}
        </main>

        {/* 🔥 FOOTER */}
        <footer className="bg-black text-white text-center p-3 text-sm">
          © 2026 Movies App - Proyecto NoSQL
        </footer>

      </body>
    </html>
  );
}