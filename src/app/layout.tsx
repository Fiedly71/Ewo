import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { WishlistProvider } from "@/components/wishlist-provider";
import { getCollections } from "@/lib/catalog";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Ewo · Vêtements personnalisés et collections", template: "%s · Ewo" },
  description:
    "Créez votre t-shirt ou sweat personnalisé avec votre image, ou choisissez une pièce dans les collections Ewo. Imprimé à la demande, paiement sécurisé.",
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "fr_FR",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
  ],
};

// Applique le thème choisi avant l'affichage, pour éviter un flash de couleur.
const themeScript = `try{var t=localStorage.getItem("ewo-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const collections = (await getCollections().catch(() => [])).map((c) => ({ slug: c.slug, name: c.name, count: c.items.length }));
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
          Aller au contenu
        </a>
        <CartProvider>
          <WishlistProvider>
            <AnnouncementBar messages={site.announcements} />
            <Header collections={collections} />
            <main id="contenu" className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
          </WishlistProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
