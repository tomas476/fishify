import Link from "next/link";
import { BRAND, NAV } from "@/content/site";
import { LogoMark } from "@/components/logo";

/* =========================================================================
   RODAPÉ

   Terceira versão, e a regra agora é dura: o rodapé cabe numa faixa e não
   repete nada. Nem horário, nem botão de encomenda, nem contactos. Tudo
   isso vive em /contactos, que está a um toque de distância, e o botão de
   encomendar já aparece três vezes acima.

   Duas linhas em telemóvel, uma em desktop.
   ========================================================================= */

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="band--deep">
      <div className="shell flex flex-col items-center gap-4 py-6 text-[0.85rem] sm:flex-row sm:justify-between">
        <p className="flex items-center gap-2 text-[#b9cfe1]">
          <LogoMark className="h-4 w-4 text-white" />
          {year} {BRAND.name}. Peixe da lota de {BRAND.origin}.
        </p>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {NAV.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Instagram
              </a>
            </li>
            <li>
              <Link href="/privacidade" className="underline underline-offset-4">
                Privacidade
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
