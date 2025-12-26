'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="no">
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            {!isAdminPage && <Header />}
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
              {children}
            </main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <ChatBot />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
