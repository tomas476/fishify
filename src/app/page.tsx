import Entregas from "@/components/entregas";
import Faq from "@/components/faq";
import Link from "next/link";
import FishExplode from "@/components/fish-explode";
import FotoRasgada from "@/components/foto-rasgada";
import Historia from "@/components/historia";
import HeroVideo from "@/components/hero-video";
import Horario from "@/components/horario";
import Passos from "@/components/passos";
import ReelsCarrossel from "@/components/reels-carrossel";
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
              Encomendar
            </a>
            <a className="hero__secundaria" href="#entregas">
              Ver onde entregamos
            </a>
          </div>
        </div>
      </section>

      {/* ---------- QUEM SOMOS ----------
          Segue o desenho do cliente: a fotografia grande nasce do hero e
          acaba num rasgão de papel, e o título começa logo a seguir ao
          rasgão, encostado à esquerda. A antiga grelha de duas colunas,
          com a foto de um lado e o texto do outro, deixou de existir. */}
      <section className="section--tight pt-0" id="quem-somos">
        <FotoRasgada />

        {/* `relative` e `z-10`: o título sobe para dentro da faixa do
            rasgão por margem negativa da fotografia, e sem isto ficava
            por baixo dela. */}
        <div className="shell relative z-10">
          <Historia />
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
          <h2 className="display display--lg max-w-[20ch]" data-reveal="palavras">
            Onde a nossa carrinha chega.
          </h2>
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
            <ReelsCarrossel />
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

      {/* ---------- FALAR CONNOSCO ----------
          O formulário NÃO vive aqui. Como no site do Marques, a landing
          convida e a página própria é que o tem: um formulário de três
          passos no meio de uma landing rouba-lhe o fôlego e faz a página
          crescer sem necessidade. */}
      <section className="section band" id="contactos">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <h2 className="display display--lg max-w-[16ch]" data-reveal="palavras">
                Precisa de peixe esta semana?
              </h2>
              <p className="lede mt-5 max-w-[46ch]" data-reveal>
                Diga-nos quem é, onde quer receber e o que procura.
                Respondemos com o que veio da lota de {BRAND.origin}, a que
                preço, e em que dia a carrinha passa na sua zona.
              </p>
              <div className="mt-9" data-reveal>
                <Link className="btn btn--solid btn--block sm:w-auto" href="/encomendar">
                  Fazer uma encomenda
                </Link>
              </div>

              <ul className="mt-10 space-y-2 text-[var(--color-ink-2)]" data-reveal>
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
            </div>

            <div data-reveal="escala">
              <h3 className="display display--md">Quando respondemos</h3>
              <div className="mt-5">
                <Horario />
              </div>
              <p className="muted mt-5 text-[0.92rem]">
                Fora deste horário a mensagem fica à espera e respondemos na
                manhã seguinte.
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
