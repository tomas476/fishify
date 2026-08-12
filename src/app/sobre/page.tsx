import type { Metadata } from "next";
import FishExplode from "@/components/fish-explode";
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
          <p className="kicker reveal">{STORY.kicker}</p>
          <h1 className="display display--lg reveal mt-4">{STORY.title}</h1>
        </div>
      </section>

      {/* O peixe que se abre ao scroll ocupa o lugar do retrato. É a peça de
          movimento desta página e a razão pela qual ela não é só texto. */}
      <FishExplode />

      <section className="section--tight">
        <div className="shell shell--narrow prose">
          {STORY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="reveal">
              {paragraph}
            </p>
          ))}
          <p className="display display--md reveal mt-10">{STORY.closing}</p>
        </div>
      </section>

      <section className="section band">
        <div className="shell shell--narrow text-center">
          <h2 className="display display--lg reveal">
            Quer conhecer o peixe desta semana?
          </h2>
          <p className="lede reveal mt-5">
            Dizemos-lhe o que veio da lota de {BRAND.origin} e em que dia lhe
            podemos levar.
          </p>
          <a
            className="btn btn--solid reveal mt-8"
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
