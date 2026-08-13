"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { REELS } from "@/content/site";
import { num } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   LEQUE DE REELS

   Porte do leque do site do Diogo R. Silva. A geometria é a mesma, os
   números não se mexem: é ela que faz a composição ler como um baralho
   aberto em vez de um carrossel qualquer.

   Duas diferenças de fundo para o original:

   1. Não alojamos vídeo nenhum. O original carregava o mp4 do cartão
      central e tocava-o; aqui o cartão é só a capa e um link que abre o
      reel no Instagram. Fora `playActive`, fora `<video>`, fora `preload`.

   2. São CINCO reels, não seis. Com N par o leque tinha uma emenda: o
      `relOf` devolvia -3..+2, um lado ficava com um slot a mais e o de
      trás era o mais apagado da tabela. Com N ímpar o intervalo é -2..+2,
      simétrico, e a linha 3 das tabelas (a do slot da emenda) deixa
      simplesmente de ser usada. Mantém-se escrita porque é a tabela do
      original e porque volta a valer se um dia forem seis outra vez.

   Abaixo dos 760 px o palco deixa de ser leque e passa a tira com scroll
   e snap: rodado e sobreposto, o leque saía cortado pelas margens de um
   ecrã estreito. Nessa altura o React não escreve variável nenhuma nos
   cartões, que é o equivalente ao `layoutStrip` do original.
   ========================================================================= */

type Reel = { id: string; likes: number };

export type ReelsFanProps = {
  /** Reels por ordem de gostos, do maior para o menor. */
  reels?: readonly Reel[];
  /** Classes extra no invólucro da secção. */
  className?: string;
};

/* ---------- geometria: os números do original, sem tocar ---------- */

/** Passo entre slots, em larguras de cartão. */
const STEP = 0.55;
/** Tabelas por distância absoluta ao centro. Com cinco cartões, |rel| <= 2. */
const XS = [0, 1, 1.85, 2.45];
const ROT = [0, 10, 19, 26];
const SC = [1.06, 0.9, 0.78, 0.68];
const DY = [-0.03, 0.02, 0.075, 0.13];
const OP = [1, 0.92, 0.6, 0.2];

/** O cartão é 9:16, e o DY do original conta-se em ALTURAS de cartão. */
const RATIO = 16 / 9;

/** Igual ao `margin-right` do cartão na tira. Manter os dois a par. */
const GAP_TIRA = 12;

const STRIP_QUERY = "(max-width: 760px)";

/**
 * O componente é renderizado no servidor e o `useLayoutEffect` avisa que não
 * faz nada lá. No cliente tem de ser mesmo de layout: centrar a tira depois
 * da pintura dava um salto visível do primeiro cartão para o do meio.
 */
const useEfeitoDeLayout =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function subscribeStrip(onChange: () => void) {
  const mq = window.matchMedia(STRIP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Mesmo limite que o CSS. Mobile primeiro: no servidor devolve `true`, por
 * isso o HTML que sai sem JavaScript é a tira, que funciona sozinha com o
 * dedo. O leque é o enfeite de ecrã largo e só aparece depois da hidratação.
 */
function useIsStrip() {
  return useSyncExternalStore(
    subscribeStrip,
    () => window.matchMedia(STRIP_QUERY).matches,
    () => true
  );
}

/**
 * A qualidade das capas cai do MEIO para fora, não da esquerda para a
 * direita: a melhor fica ao centro, a 2.ª à direita, a 3.ª à esquerda, e por
 * aí. Assim abre com o melhor à frente e com cartão dos dois lados, que é o
 * que dá a entender que se pode ir para ambos.
 */
function ordemDoLeque<T>(itens: readonly T[]): T[] {
  const n = itens.length;
  // com N ímpar isto é o meio exacto; com N par sobra um slot à direita
  const centro = Math.floor((n - 1) / 2);
  const saida: T[] = new Array(n);
  saida[centro] = itens[0];

  let esq = centro - 1;
  let dir = centro + 1;
  for (let posto = 1; posto < n; posto++) {
    const queriaDireita = posto % 2 === 1;
    if ((queriaDireita && dir < n) || esq < 0) saida[dir++] = itens[posto];
    else saida[esq--] = itens[posto];
  }
  return saida;
}

export default function ReelsFan({ reels = REELS, className }: ReelsFanProps) {
  const cartoes = useMemo(() => ordemDoLeque(reels), [reels]);
  const n = cartoes.length;
  const meio = Math.floor(n / 2);
  /** O slot do destaque: é onde ficou a capa com mais gostos. */
  const destaque = Math.floor((n - 1) / 2);

  const strip = useIsStrip();
  const reduced = useReducedMotion();

  const [active, setActive] = useState(destaque);
  const [hovered, setHovered] = useState<number | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prevRel = useRef<(number | null)[]>(cartoes.map(() => null));
  const ticking = useRef(false);

  /** Distância com sinal ao centro. Com N=5 dá -2..+2, simétrico. */
  const relOf = useCallback(
    (i: number) => ((((i - active + meio) % n) + n) % n) - meio,
    [active, meio, n]
  );

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  /** Põe um cartão no centro da tira. Sem isto abria encostada à esquerda. */
  const centrarNaTira = useCallback(
    (i: number, suave: boolean) => {
      const stage = stageRef.current;
      const card = cardRefs.current[i];
      if (!stage || !card) return;
      stage.scrollTo({
        left: card.offsetLeft + card.offsetWidth / 2 - stage.clientWidth / 2,
        behavior: suave && !reduced ? "smooth" : "auto",
      });
    },
    [reduced]
  );

  /** Clicar num pontinho traz esse cartão à frente, na tira e no leque. */
  const select = useCallback(
    (i: number) => {
      if (strip) centrarNaTira(i, true);
      else go(i);
    },
    [strip, centrarNaTira, go]
  );

  /** As setas: na tira deslocam-na um cartão, no leque rodam o baralho. */
  const nudge = useCallback(
    (dir: number) => {
      if (!strip) {
        go(active + dir);
        return;
      }
      const stage = stageRef.current;
      const largura = cardRefs.current[0]?.offsetWidth ?? 200;
      stage?.scrollBy({
        left: dir * (largura + GAP_TIRA),
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [strip, go, active, reduced]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        nudge(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nudge(1);
      }
    },
    [nudge]
  );

  /* na tira quem manda é o scroll: o activo é o cartão mais perto do centro,
     recalculado uma vez por frame para não pesar no gesto */
  const onScroll = useCallback(() => {
    if (!strip || ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      ticking.current = false;
      const stage = stageRef.current;
      if (!stage) return;
      const meioDoEcra = stage.scrollLeft + stage.clientWidth / 2;
      let melhor = 0;
      let dist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - meioDoEcra);
        if (d < dist) {
          dist = d;
          melhor = i;
        }
      });
      setActive(melhor);
    });
  }, [strip]);

  /* a tira abre no destaque, e volta a abrir nele sempre que se muda de modo */
  useEfeitoDeLayout(() => {
    if (strip) centrarNaTira(destaque, false);
  }, [strip, destaque, centrarNaTira]);

  /* Deu a volta ao baralho: o cartão que salta de um extremo ao outro
     atravessaria o palco todo à vista. Reposiciona-se invisível e só depois
     acende. É o único sítio onde se toca no DOM à mão, e por isso a opacidade
     do leque vive numa variável CSS: apagar `style.opacity` devolve o valor
     que o React escreveu, em vez de o perder. */
  useEfeitoDeLayout(() => {
    if (strip || reduced) {
      prevRel.current = prevRel.current.map(() => null);
      return;
    }
    cardRefs.current.forEach((card, i) => {
      const rel = relOf(i);
      const antes = prevRel.current[i];
      const saltou = antes !== null && Math.abs(rel - antes) > meio;
      prevRel.current[i] = rel;
      if (!card || !saltou) return;

      card.style.transition = "none";
      card.style.opacity = "0";
      void card.offsetWidth; // obriga o salto a ser aplicado já
      card.style.transition = "";
      requestAnimationFrame(() => {
        card.style.opacity = "";
      });
    });
  }, [strip, reduced, relOf, meio]);

  const activo = cartoes[active];

  return (
    <div className={className ? `rf ${className}` : "rf"}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        ref={stageRef}
        className="rf__stage"
        role="group"
        aria-label="Reels de Instagram"
        onScroll={onScroll}
        onMouseLeave={() => setHovered(null)}
      >
        {cartoes.map((reel, i) => {
          const rel = relOf(i);
          const a = Math.min(Math.abs(rel), XS.length - 1);
          const sinal = rel < 0 ? -1 : 1;

          let rot = sinal * ROT[a];
          let sc = SC[a];
          let y = DY[a] * RATIO;
          let op = OP[a];
          let z = 30 - a * 6;

          // o sobrevoado espreita: endireita-se, cresce e sobe um pouco
          if (hovered === i && i !== active && !reduced) {
            rot *= 0.5;
            sc *= 1.07;
            y -= 0.03 * RATIO;
            z = 26;
            op = Math.min(1, op + 0.25);
          }

          /* toda a geometria em larguras de cartão, por `calc` sobre --rf-w:
             não é preciso medir nada nem ouvir o `resize` */
          const style = strip
            ? undefined
            : ({
                "--rf-x": `calc(var(--rf-w) * ${sinal * XS[a] * STEP})`,
                "--rf-y": `calc(var(--rf-w) * ${y})`,
                "--rf-rot": `${rot}deg`,
                "--rf-sc": `${sc}`,
                "--rf-op": `${op}`,
                "--rf-z": `${z}`,
              } as React.CSSProperties);

          return (
            <a
              key={reel.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={i === active ? "rf__card is-center" : "rf__card"}
              style={style}
              href={`https://www.instagram.com/reel/${reel.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Reel com ${num(reel.likes)} gostos, abre no Instagram`}
              onKeyDown={onKeyDown}
              onFocus={() => select(i)}
              onMouseEnter={() => !strip && setHovered(i)}
              onClick={(event) => {
                /* no leque, um cartão de lado está meio rodado e meio tapado:
                   o primeiro toque traz para a frente, o segundo é que abre */
                if (!strip && i !== active) {
                  event.preventDefault();
                  go(i);
                }
              }}
            >
              <Image
                src={`/reels/${reel.id}.webp`}
                alt=""
                width={540}
                height={960}
                sizes="(max-width: 760px) 58vw, 19vw"
              />
              <span className="rf__meta">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.3 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" />
                </svg>
                {num(reel.likes)} gostos
              </span>
            </a>
          );
        })}
      </div>

      <div className="rf__nav">
        <button
          type="button"
          className="rf__arrow"
          aria-label="Reel anterior"
          onClick={() => nudge(-1)}
          onKeyDown={onKeyDown}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>

        <div className="rf__dots">
          {cartoes.map((reel, i) => (
            <button
              key={reel.id}
              type="button"
              className={i === active ? "rf__dot is-on" : "rf__dot"}
              aria-label={`Ir para o reel ${i + 1} de ${n}`}
              aria-current={i === active}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
            />
          ))}
        </div>

        <button
          type="button"
          className="rf__arrow"
          aria-label="Reel seguinte"
          onClick={() => nudge(1)}
          onKeyDown={onKeyDown}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* quem navega às cegas precisa de saber onde está */}
      <p aria-live="polite" className="sr-only">
        {`Reel ${active + 1} de ${n}, ${num(activo.likes)} gostos`}
      </p>
    </div>
  );
}

/* =========================================================================
   O CSS vive aqui dentro porque o componente é auto-suficiente: a folha
   global não sabe nada do leque, e assim quem o integrar só tem de o
   importar. A tira sangra até às margens do ecrã com `--pad`, por isso
   espera-se que a secção que o recebe tenha `padding-inline: var(--pad)`.
   ========================================================================= */
const CSS = `
.rf{position:relative}

/* ---------- o palco: em ecrã largo, o leque ---------- */
.rf__stage{
  --rf-w:clamp(160px,19vw,264px);
  position:relative;width:100%;
  height:calc(var(--rf-w) * 16 / 9 * 1.2);
  display:flex;align-items:center;justify-content:center;
  touch-action:pan-y;
}
.rf__card{
  position:absolute;left:50%;top:50%;
  width:var(--rf-w);aspect-ratio:9/16;
  margin:0;border-radius:var(--radius,18px);overflow:hidden;
  border:1px solid var(--hair);
  background:var(--paper-3);
  box-shadow:0 26px 60px rgba(14,26,36,.18);
  /* os valores por defeito servem o HTML que sai do servidor e o caso sem
     JavaScript: cartão direito, inteiro e visível, nunca invisível */
  transform:translate(-50%,-50%)
    translate(var(--rf-x,0px),var(--rf-y,0px))
    rotate(var(--rf-rot,0deg)) scale(var(--rf-sc,1));
  opacity:var(--rf-op,1);
  z-index:var(--rf-z,1);
  transition:transform .62s var(--ease),opacity .45s var(--ease),
    border-color .35s var(--ease),box-shadow .38s var(--ease);
  will-change:transform;
}
.rf__card.is-center{border-color:var(--accent)}
.rf__card img{display:block;width:100%;height:100%;object-fit:cover}
.rf__meta{
  position:absolute;inset:auto 0 0 0;z-index:2;
  display:flex;align-items:center;gap:.4em;
  padding:48px 14px 14px;
  font-size:.86rem;font-weight:500;color:#fff;
  background:linear-gradient(to top,rgba(9,22,36,.86),transparent);
}

/* ---------- controlos ---------- */
.rf__nav{display:flex;align-items:center;justify-content:center;
  gap:16px;margin-top:clamp(18px,3vw,30px)}
.rf__arrow{
  width:46px;height:46px;flex:none;cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center;
  border-radius:50%;border:1px solid var(--hair-strong);
  color:var(--ink-2);background:var(--paper);
  transition:color .3s var(--ease),border-color .3s var(--ease),
    background .3s var(--ease),transform .3s var(--ease);
}
.rf__arrow:hover{color:var(--accent-deep);border-color:var(--accent);
  background:var(--accent-soft)}
.rf__arrow:active{transform:scale(.92)}
.rf__arrow svg{width:19px;height:19px}
.rf__dots{display:flex;align-items:center;gap:8px}
.rf__dot{
  width:7px;height:7px;padding:0;border:none;border-radius:50%;cursor:pointer;
  background:var(--hair-strong);
  transition:background .3s var(--ease),transform .3s var(--ease);
}
.rf__dot.is-on{background:var(--accent);transform:scale(1.4)}

/* ---------- telemóvel: em vez do leque, uma tira que se arrasta ---------- */
@media(max-width:760px){
  .rf__stage{
    --rf-w:min(58vw,240px);
    height:auto;
    /* block + inline-block em vez de flex: containers flex ignoram o padding
       final ao chegar ao fim do scroll, e o último cartão ficava colado */
    display:block;white-space:nowrap;
    overflow-x:auto;overflow-y:hidden;
    scroll-snap-type:x mandatory;
    -webkit-overflow-scrolling:touch;
    /* pan-x sozinho sequestra o gesto: com o dedo em cima da tira já não se
       rolava a página para baixo. Os dois eixos deixam o browser escolher */
    touch-action:pan-x pan-y;
    scrollbar-width:none;-ms-overflow-style:none;
    /* a tira sangra até às margens do ecrã, mas o scroll fica preso a ela:
       a página não ganha deslocamento lateral nenhum */
    width:auto;margin-inline:calc(var(--pad) * -1);
    /* as folgas laterais valem meio ecrã menos meio cartão: é o que deixa o
       primeiro e o último assentarem no centro como todos os outros. A folga
       de cima e de baixo existe para o destaque poder crescer 7% sem ser
       cortado pelo overflow-y:hidden, que corta na caixa de padding */
    padding:18px calc(50vw - var(--rf-w) / 2) 24px;
    /* o snap tem de conhecer o mesmo recuo do padding, senão alinha pelo
       início do scrollport e o primeiro cartão entra cortado pela margem */
    scroll-padding-inline:calc(50vw - var(--rf-w) / 2);
  }
  .rf__stage::-webkit-scrollbar{display:none}
  .rf__card{
    /* relative e não static: o cartão continua a ser a caixa de referência
       do selo dos gostos, senão ele escapava para o palco */
    position:relative;left:auto;top:auto;
    display:inline-block;vertical-align:top;
    width:var(--rf-w);margin-right:${GAP_TIRA}px;
    transform:none;opacity:1;z-index:auto;transform-origin:center center;
    box-shadow:0 14px 32px rgba(14,26,36,.16);
    /* assenta ao centro: o cartão que encaixa é o mesmo que o JS considera
       activo, e o pontinho aceso nunca contradiz o que se vê */
    scroll-snap-align:center;
  }
  .rf__card:last-child{margin-right:0}
  /* o do meio é o que a pessoa quer ver: cresce 7% e ganha sombra, o
     suficiente para se destacar sem partir o alinhamento da tira */
  .rf__card.is-center{transform:scale(1.07);
    box-shadow:0 22px 48px rgba(14,26,36,.22)}
  .rf__card:not(.is-center){opacity:.78}
  @media(prefers-reduced-motion:reduce){
    .rf__card.is-center{transform:none}
  }
}
@media(max-width:620px){
  .rf__arrow{width:42px;height:42px}
}
@media(prefers-reduced-motion:reduce){
  .rf__card,.rf__arrow,.rf__dot{transition:none}
  .rf__stage{scroll-behavior:auto}
}
`;
