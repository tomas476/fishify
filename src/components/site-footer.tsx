import Link from "next/link";
import { BRAND, HOURS, NAV, WA_MESSAGES, wa } from "@/content/site";
import Logo from "@/components/logo";

/* O rodapé é a única chapa escura do site: fecha a página com o azul do
   fundo do mar e faz o contraponto ao branco de gelo de tudo o resto. */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="band--deep">
      <div className="shell section--tight">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Logo className="h-6 w-auto text-white" />
            <p className="lede mt-5 max-w-sm">{BRAND.tagline}</p>
            <a
              className="btn btn--ghost mt-6"
              href={wa(WA_MESSAGES.order)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Encomendar pelo WhatsApp
            </a>
          </div>

          <div>
            <h2 className="kicker">Contactos</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={wa(WA_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {BRAND.phoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="underline underline-offset-4"
                >
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {BRAND.instagramHandle}
                </a>
              </li>
            </ul>

            <h2 className="kicker mt-8">Horário</h2>
            <ul className="muted mt-4 space-y-1 text-[0.95rem]">
              {HOURS.map((h) => (
                <li key={h.day}>
                  {h.day}: {h.hours ?? "encerrado"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="kicker">Site</h2>
            <ul className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacidade" className="underline underline-offset-4">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="muted mt-12 text-[0.88rem]">
          {year} {BRAND.name}. Peixe da lota de {BRAND.origin}.
        </p>
      </div>
    </footer>
  );
}
