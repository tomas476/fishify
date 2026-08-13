import type { Metadata } from "next";
import { BRAND, STORY, WA_MESSAGES, wa } from "@/content/site";

export const metadata: Metadata = {
  title: "Quem somos",
  description:
    "O Rui e a Beatriz, duas famílias ligadas ao peixe há gerações. A Fishify nasceu como trabalho final de curso, em Leiria, para levar o peixe de Peniche diretamente às pessoas.",
};

export default function Sobre() {
  return (
    <>
      <section className="section" style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}>
        <div className="shell shell--narrow">
          <p className="kicker" data-reveal>{STORY.kicker}</p>
          <h1 className="display display--lg mt-4" data-reveal="palavras">{STORY.title}</h1>
        </div>
      </section>

      <section className="section--tight">
        <div className="shell shell--narrow prose" data-reveal="cascata">
          {STORY.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              {paragraph}
            </p>
          ))}
          <p className="display display--md mt-10" data-reveal>{STORY.closing}</p>
        </div>
      </section>

      <section className="section band">
        <div className="shell shell--narrow text-center">
          <h2 className="display display--lg" data-reveal="palavras">
            Quer conhecer o peixe desta semana?
          </h2>
          <p className="lede mt-5" data-reveal>
            Dizemos-lhe o que veio da lota de {BRAND.origin} e em que dia lhe
            podemos levar.
          </p>
          <a
            className="btn btn--solid mt-8"
            data-reveal
            href={wa(WA_MESSAGES.order)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar connosco no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
