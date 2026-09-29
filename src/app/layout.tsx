import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { whatsappDisplay, whatsappLink } from "@/lib/contact";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Ewo, vêtements personnalisés", template: "%s | Ewo" },
  description: "Créez vos vêtements personnalisés ou choisissez parmi les collections Ewo.",
};

// Applique le thème choisi avant l'affichage, pour éviter un flash de couleur.
const themeScript = `try{var t=localStorage.getItem("ewo-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
          <footer className="border-t border-line">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-3">
              <div>
                <p className="text-2xl font-black">
                  EW<span className="text-accent">O</span>
                </p>
                <p className="mt-3 max-w-xs text-muted">
                  Vêtements personnalisés et collections, imprimés à la demande.
                </p>
              </div>
              <div>
                <p className="mb-3 font-semibold">Boutique</p>
                <ul className="space-y-2 text-muted">
                  <li><Link href="/collections" className="hover:text-fg">Collections</Link></li>
                  <li><Link href="/personnaliser" className="hover:text-fg">Personnaliser</Link></li>
                  <li><Link href="/panier" className="hover:text-fg">Panier</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 font-semibold">Aide</p>
                <ul className="space-y-2 text-muted">
                  <li><Link href="/contact" className="hover:text-fg">Contact</Link></li>
                  <li>
                    <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                      WhatsApp {whatsappDisplay}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="border-t border-line py-6 text-center text-xs text-muted">
              © {new Date().getFullYear()} Ewo. Impression et expédition par Printify.
            </p>
          </footer>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
