import Link from "next/link";
import { BRAND, NAV, WA_MESSAGES, wa } from "@/content/site";
import Logo from "@/components/logo";

/* =========================================================================
   RODAPÉ COMPACTO

   A primeira versão tinha os sete dias da semana em lista, três colunas de
   links e um logótipo grande: ocupava mais de um ecrã inteiro só para dizer
   o que já estava na página dos contactos. Agora é uma faixa: logótipo,
   uma linha de horário, os links em fila e o WhatsApp. O detalhe do horário
   dia a dia vive em /contactos, que é onde alguém o vai procurar.
   ========================================================================= */

/** Os sete dias resumidos numa linha. Segunda é o dia de folga. */
const HORARIO_CURTO = "Terça a domingo, das 08:00 às 14:00";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="band--deep">
      <div className="shell py-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <Logo className="h-5 w-auto text-white" />
            <p className="text-[0.92rem] text-[#b9cfe1]">{HORARIO_CURTO}</p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
              {NAV.map((item) => (
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

          <a
            className="btn btn--ghost btn--block md:w-auto"
            href={wa(WA_MESSAGES.order)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Encomendar
          </a>
        </div>

        <p className="mt-8 text-[0.85rem] text-[#8fadc6]">
          {year} {BRAND.name}. Peixe da lota de {BRAND.origin}.{" "}
          {BRAND.phoneLabel}. {BRAND.email}
        </p>
      </div>
    </footer>
  );
}
