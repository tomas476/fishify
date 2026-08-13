import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/content/site";
import Reveal from "@/components/reveal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SeaBackground from "@/components/sea-background";

/* Outfit não foi escolhida a gosto: é a geometria mais próxima do lettering
   do próprio logótipo, o mesmo critério com que se amostrou o azul. */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.name}, ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "Peixe fresco da lota de Peniche entregue em casa na Grande Lisboa, Margem Sul, Oeste, Leiria e Santarém. Encomendas por WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: BRAND.name,
    title: `${BRAND.name}, ${BRAND.tagline}`,
    description:
      "Peixe fresco da lota de Peniche entregue em casa. Entregas semanais na Grande Lisboa, Margem Sul, Oeste, Leiria e Santarém.",
    images: [{ url: "/img/og.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/img/mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#e7f2fb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-PT"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${instrument.variable}`}
    >
      <body>
        <a href="#conteudo" className="sr-only focus:not-sr-only">
          Saltar para o conteúdo
        </a>
        {/* montado uma só vez, aqui: nenhuma página o remonta */}
        <SeaBackground />
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <Reveal />
      </body>
    </html>
  );
}
