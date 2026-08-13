import Entregas from "@/components/entregas";
import EncomendaForm from "@/components/encomenda-form";
import Faq from "@/components/faq";
import Image from "next/image";
import { asset } from "@/lib/asset";
import FishExplode from "@/components/fish-explode";
import Historia from "@/components/historia";
import HeroVideo from "@/components/hero-video";
import Horario from "@/components/horario";
import Passos from "@/components/passos";
import ReelsStack from "@/components/reels-stack";
import { BRAND, WA_MESSAGES, wa } from "@/content/site";

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
          {/* UMA acção principal, e a segunda como ligação de texto. */}
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              className="btn btn--solid btn--block"
              href={wa(WA_MESSAGES.order)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Encomendar pelo WhatsApp
            </a>
            <a className="hero__secundaria" href="#entregas">
              Ver onde entregamos
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
                src={asset("/img/carrinha.webp")}
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

      {/* ---------- COMO FUNCIONA ---------- */}
      <section className="section" id="como-funciona">
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

          {/* O peixe deixou a faixa horizontal e passou a ficar EM PÉ à
              direita dos passos, nos dois tamanhos de ecrã. Separa-se
              enquanto a secção atravessa o ecrã e já não leva legenda: o
              que se lê ao lado é a sequência dos passos. */}
          <div className="passos-com-peixe mt-14">
            <Passos />
            <FishExplode className="passos__peixe" />
          </div>
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
            uma zona de cada vez. Toque na sua para ver os concelhos que
            fazemos.
          </p>
          <div className="mt-12">
            <Entregas cta="detalhes" />
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
            <ReelsStack />
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

      {/* ---------- FALAR CONNOSCO ---------- */}
      <section className="section band" id="contactos">
        <div className="shell">
          <p className="kicker" data-reveal>
            Falar connosco
          </p>
          <h2
            className="display display--lg mt-4 max-w-[18ch]"
            data-reveal="palavras"
          >
            Diga-nos o que procura.
          </h2>
          <p className="lede mt-5 max-w-[52ch]" data-reveal>
            Preencha e abrimos o WhatsApp com o pedido já escrito. Respondemos
            com o peixe da semana, o preço e o dia da sua zona.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr]">
            <div data-reveal>
              <EncomendaForm />
            </div>

            <aside data-reveal="escala">
              <h3 className="display display--md">Quando respondemos</h3>
              <div className="mt-5">
                <Horario />
              </div>

              <ul className="mt-8 space-y-2 text-[var(--color-ink-2)]">
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
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- FAQ, mesmo antes do rodapé ---------- */}
      <Faq />
    </>
  );
}
