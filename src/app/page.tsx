import Entregas from "@/components/entregas";
import Faq from "@/components/faq";
import Image from "next/image";
import Historia from "@/components/historia";
import HeroVideo from "@/components/hero-video";
import Passos from "@/components/passos";
import ReelsFan from "@/components/reels-fan";
import { BRAND, HOURS, PILLARS, WA_MESSAGES, wa } from "@/content/site";

/* =========================================================================
   A LANDING, E É SÓ ISTO

   Não há subpáginas. O menu leva às secções desta página por âncora, o que
   também resolve o pior problema do telemóvel: uma navegação que falhasse
   deixava de haver site; agora falha um scroll e mais nada.
   ========================================================================= */

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" id="topo">
        <HeroVideo />
        <div className="shell hero__body">
          <h1 className="display display--xl max-w-[16ch]">{BRAND.tagline}</h1>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              className="btn btn--solid btn--block"
              href={wa(WA_MESSAGES.order)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Encomendar pelo WhatsApp
            </a>
            <a className="btn btn--ghost btn--block" href="#entregas">
              Ver zonas de entrega
            </a>
          </div>
        </div>
      </section>

      {/* ---------- QUEM SOMOS ---------- */}
      <section className="section" id="quem-somos">
        <div className="shell">
          <div className="sobre">
            {/* O peixe saiu daqui por decisão do cliente, à espera de sítio
                novo. Ficou a fotografia dos dois à frente da carrinha, que
                é o que a secção tinha por dizer e não dizia. */}
            <figure className="sobre__foto" data-reveal="escala">
              <Image
                src="/img/carrinha.webp"
                alt="O Rui e a Beatriz à frente da carrinha da Fishify, no porto de Peniche"
                width={1100}
                height={733}
                sizes="(max-width: 900px) 100vw, 44vw"
                className="sobre__img"
              />
            </figure>

            <Historia />
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

      {/* ---------- ENTREGAS ---------- */}
      <section className="section band" id="entregas">
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
          <p className="lede mt-5 max-w-[52ch]" data-reveal>
            A carrinha sai de Peniche com o peixe escolhido nessa manhã e faz
            uma zona de cada vez. Toque na sua para ver os concelhos e abrir a
            conversa já com o nome dela escrito.
          </p>
          <div className="mt-12">
            <Entregas />
          </div>
        </div>
      </section>

      {/* ---------- REELS ---------- */}
      <section className="section" id="reels">
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

      {/* ---------- CONTACTOS ---------- */}
      <section className="section band" id="contactos">
        <div className="shell">
          <p className="kicker" data-reveal>
            Contactos
          </p>
          <h2
            className="display display--lg mt-4 max-w-[18ch]"
            data-reveal="palavras"
          >
            A encomenda começa numa mensagem.
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-2" data-reveal="cascata">
            <div>
              <ul className="space-y-3 text-[var(--color-ink-2)]">
                <li>
                  WhatsApp:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={wa(WA_MESSAGES.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BRAND.phoneLabel}
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${BRAND.email}`}
                  >
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={BRAND.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BRAND.instagramHandle}
                  </a>
                </li>
              </ul>
              <a
                className="btn btn--solid mt-8"
                href={wa(WA_MESSAGES.order)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Encomendar pelo WhatsApp
              </a>
            </div>

            <div>
              <div className="facts">
                {HOURS.map((h) => (
                  <div key={h.day}>
                    <span>{h.day}</span>
                    <span className={h.hours ? "" : "muted"}>
                      {h.hours ?? "encerrado"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="muted mt-4 text-[0.92rem]">
                As entregas fazem-se no dia de cada zona. Se mandar mensagem
                fora deste horário, respondemos na manhã seguinte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ, mesmo antes do rodapé ---------- */}
      <Faq />
    </>
  );
}
