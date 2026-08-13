import Link from "next/link";
import FishExplode from "@/components/fish-explode";
import HeroVideo from "@/components/hero-video";
import Passos from "@/components/passos";
import ReelsFan from "@/components/reels-fan";
import Zones from "@/components/zones";
import { BRAND, PILLARS, STORY, WA_MESSAGES, wa } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <HeroVideo />
        <div className="shell hero__body">
          <p className="kicker kicker--light">
            Da lota de {BRAND.origin} para a sua cozinha
          </p>
          <h1 className="display display--xl mt-4 max-w-[16ch]">
            {BRAND.tagline}
          </h1>
          <p className="lede mt-6 max-w-[46ch]">
            Somos o Rui e a Beatriz. Escolhemos o peixe na lota de manhã e
            entregamos em sua casa no dia da sua zona, ainda com o mar em cima.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="btn btn--solid btn--block"
              href={wa(WA_MESSAGES.order)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Encomendar pelo WhatsApp
            </a>
            <Link className="btn btn--ghost btn--block" href="/entregas">
              Ver zonas de entrega
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- QUEM SOMOS ----------
          Logo a seguir ao hero, e é a secção mais importante da página: a
          dourada a abrir-se à esquerda, o texto deles à direita. */}
      <section className="section">
        <div className="shell">
          <div className="sobre">
            <FishExplode className="sobre__peixe" />

            <div>
              <p className="kicker" data-reveal>
                {STORY.kicker}
              </p>
              <h2 className="display display--lg mt-4" data-reveal="palavras">
                {STORY.title}
              </h2>
              <div className="prose mt-7" data-reveal="cascata">
                {STORY.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <p className="display display--md mt-8" data-reveal>
                {STORY.closing}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- O QUE NOS SEPARA ---------- */}
      <section className="section band">
        <div className="shell">
          <h2 className="display display--lg max-w-[20ch]" data-reveal="palavras">
            Peixe que ainda estava no mar ontem.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3" data-reveal="cascata">
            {PILLARS.map((pillar) => (
              <div key={pillar.title}>
                <h3 className="display display--md">{pillar.title}</h3>
                <p className="mt-3 text-[var(--color-ink-2)]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- COMO FUNCIONA ---------- */}
      <section className="section">
        <div className="shell">
          <p className="kicker" data-reveal>
            Como funciona
          </p>
          <h2
            className="display display--lg mt-4 max-w-[18ch]"
            data-reveal="palavras"
          >
            Três passos, e o peixe está à porta.
          </h2>
          <Passos className="mt-14" />
        </div>
      </section>

      {/* ---------- ZONAS ---------- */}
      <section className="section band">
        <div className="shell">
          <p className="kicker" data-reveal>
            Entregas
          </p>
          <h2
            className="display display--lg mt-4 max-w-[20ch]"
            data-reveal="palavras"
          >
            Onde a nossa carrinha chega.
          </h2>
          <div className="mt-10">
            <Zones />
          </div>
        </div>
      </section>

      {/* ---------- REELS ---------- */}
      <section className="section">
        <div className="shell">
          <p className="kicker" data-reveal>
            No Instagram
          </p>
          <h2
            className="display display--lg mt-4 max-w-[22ch]"
            data-reveal="palavras"
          >
            {BRAND.followers} pessoas veem o nosso peixe todas as semanas.
          </h2>
          <div className="mt-10">
            <ReelsFan />
          </div>
          <a
            className="btn mt-8"
            data-reveal
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Seguir {BRAND.instagramHandle}
          </a>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="section band--deep">
        <div className="shell shell--narrow text-center">
          <h2 className="display display--lg" data-reveal="palavras">
            Diga-nos onde está. Tratamos do resto.
          </h2>
          <p className="lede mt-5" data-reveal>
            Manda mensagem com a sua zona e dizemos-lhe o que veio da lota esta
            semana, a que preço e em que dia lhe podemos levar.
          </p>
          <a
            className="btn btn--ghost mt-8"
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
