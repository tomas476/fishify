import Link from "next/link";
import HeroVideo from "@/components/hero-video";
import Reels from "@/components/reels";
import Zones from "@/components/zones";
import { BRAND, PILLARS, STEPS, WA_MESSAGES, wa } from "@/content/site";

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

      {/* ---------- O QUE NOS SEPARA ---------- */}
      <section className="section">
        <div className="shell">
          <h2 className="display display--lg reveal max-w-[20ch]">
            Peixe que ainda estava no mar ontem.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="reveal">
                <h3 className="display display--md">{pillar.title}</h3>
                <p className="mt-3 text-[var(--color-ink-2)]">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- QUEM SOMOS, EM CURTO ---------- */}
      <section className="section band">
        <div className="shell shell--narrow text-center">
          <p className="kicker reveal">Quem somos</p>
          <p className="display display--lg reveal mt-5">
            Duas famílias ligadas ao peixe, há gerações.
          </p>
          <p className="lede reveal mt-6">
            O Rui vem de pescadores e peixeiros desde os bisavós. A Beatriz
            aprendeu com a avó e a bisavó, na Praia da Vieira. Conheceram-se em
            2016, na faculdade em Leiria, e a Fishify começou ali, como trabalho
            final de curso.
          </p>
          <Link className="btn reveal mt-8" href="/sobre">
            Ler a nossa história
          </Link>
        </div>
      </section>

      {/* ---------- COMO FUNCIONA ---------- */}
      <section className="section">
        <div className="shell">
          <p className="kicker reveal">Como funciona</p>
          <h2 className="display display--lg reveal mt-4 max-w-[18ch]">
            Três passos, e o peixe está à porta.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="panel reveal">
                <p className="kicker">Passo {i + 1}</p>
                <h3 className="display display--md mt-3">{step.title}</h3>
                <p className="mt-3 text-[var(--color-ink-2)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- ZONAS ---------- */}
      <section className="section band">
        <div className="shell">
          <p className="kicker reveal">Entregas</p>
          <h2 className="display display--lg reveal mt-4 max-w-[20ch]">
            Onde a nossa carrinha chega.
          </h2>
          <p className="lede reveal mt-5 max-w-[52ch]">
            Entregamos todas as semanas em cinco zonas. Diga-nos a sua e
            respondemos com o dia e a hora a que fecha a encomenda.
          </p>
          <div className="mt-10">
            <Zones />
          </div>
        </div>
      </section>

      {/* ---------- REELS ---------- */}
      <section className="section">
        <div className="shell">
          <p className="kicker reveal">No Instagram</p>
          <h2 className="display display--lg reveal mt-4 max-w-[22ch]">
            {BRAND.followers} pessoas veem o nosso peixe todas as semanas.
          </h2>
          <div className="mt-10">
            <Reels />
          </div>
          <a
            className="btn reveal mt-8"
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
          <h2 className="display display--lg reveal">
            Diga-nos onde está. Tratamos do resto.
          </h2>
          <p className="lede reveal mt-5">
            Manda mensagem com a sua zona e dizemos-lhe o que veio da lota esta
            semana, a que preço e em que dia lhe podemos levar.
          </p>
          <a
            className="btn btn--ghost reveal mt-8"
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
