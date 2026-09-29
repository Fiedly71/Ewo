import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Ewo, vêtements personnalisés", template: "%s | Ewo" },
  description: "Créez vos vêtements personnalisés ou choisissez parmi les collections Ewo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
          <footer className="border-t border-black/10 py-8 text-center text-sm text-black/50">
            © {new Date().getFullYear()} Ewo. Impression et expédition par Printify.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
