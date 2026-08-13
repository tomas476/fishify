"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";

import { STEPS } from "@/content/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   COMO FUNCIONA, SEM CARTÕES

   Só tipografia sobre o papel: o número é o elemento gráfico, no azul claro
   do acento (o --accent-deep é para texto pequeno, aqui não faz falta porque
   um número de 54 a 112 px já passa o contraste de texto grande), e o título
   fica em tinta cheia para ganhar sempre a competição visual.

   As setas são conteúdo: contam a sequência de um passo para o seguinte.
   São DUAS SVG diferentes, não uma rodada, porque a leitura muda com o eixo
   (ver o comentário em <Seta>).
   ========================================================================= */

const DESKTOP = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Em coluna (telemóvel) cada passo entra quando se chega a ele, e o
 * escalonamento é vertical. Em linha (desktop) os três passos entram no
 * viewport ao mesmo tempo, por isso é preciso um atraso por índice, senão
 * a sequência 1 → seta → 2 → seta → 3 acontecia toda no mesmo instante.
 *
 * `useSyncExternalStore` e não `useState` dentro de um efeito, pela mesma
 * razão que em `use-reduced-motion`: o ESLint proíbe, e com razão.
 */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

type SetaProps = {
  /** "baixo" em coluna, "direita" em linha. */
  eixo: "baixo" | "direita";
  /** Espelha a curva para a esquerda: dá o alternado entre a 1.ª e a 2.ª. */
  espelhada?: boolean;
  atraso: number;
  className?: string;
};

/*
   Duas geometrias, não uma rotação.

   Uma seta desenhada à mão lê-se pela direcção em que a mão a fez: a que
   desce parte do número, abre para o lado e volta ao centro; a que segue
   para a direita é um S deitado, quase plano. Rodar a primeira 90 graus
   dava uma curva que entra no passo seguinte por cima, a apontar para o
   título e não para o número, e a ponta ficava a olhar para o nada.
   Por isso: `d` diferente para cada eixo, e a ponta calculada sobre a
   tangente real do fim de cada traço.
*/
const CURVAS = {
  baixo: {
    viewBox: "0 0 40 72",
    traco: "M 20 4 C 36 20, 28 50, 21 66",
    ponta: "M 30.4 58.5 L 21 66 L 20.1 54",
    espessura: 2.4,
  },
  /* A da direita é longa de propósito: acaba colada ao número seguinte, mas
     começa logo a seguir ao número anterior. Com uma seta curta só na
     goteira, o traço ficava a 250 px do 1 e a 20 px do 2, e lia-se como
     enfeite do 2 em vez de ligação do 1 ao 2. */
  direita: {
    viewBox: "0 0 120 40",
    traco: "M 6 24 C 34 6, 74 6, 110 17",
    ponta: "M 100.8 7.8 L 110 17 L 97.2 19.5",
    /* A caixa é 3x mais larga do que a de baixo e desenha à mesma escala:
       sem isto o traço saía visivelmente mais grosso do que no telemóvel. */
    espessura: 2,
  },
} as const;

function Seta({ eixo, espelhada = false, atraso, className }: SetaProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduzido = useReducedMotion();
  const desenhar = reduzido || inView;

  const curva = CURVAS[eixo];
  const tracoDur = reduzido ? 0 : 0.9;

  return (
    <svg
      ref={ref}
      viewBox={curva.viewBox}
      fill="none"
      aria-hidden="true"
      className={`text-[var(--color-accent)] ${espelhada ? "-scale-x-100" : ""} ${className ?? ""}`}
    >
      <motion.path
        d={curva.traco}
        stroke="currentColor"
        strokeWidth={curva.espessura}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: desenhar ? 1 : 0 }}
        transition={{ duration: tracoDur, delay: reduzido ? 0 : atraso, ease: EASE }}
      />
      {/* A ponta só aparece quando o traço já lá chegou. */}
      <motion.path
        d={curva.ponta}
        stroke="currentColor"
        strokeWidth={curva.espessura}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: desenhar ? 1 : 0 }}
        transition={{
          duration: reduzido ? 0 : 0.3,
          delay: reduzido ? 0 : atraso + tracoDur * 0.82,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

type PassoProps = {
  numero: number;
  title: string;
  body: string;
  ultimo: boolean;
  /** Atraso base do passo. Zero em coluna, por índice em linha. */
  base: number;
};

function Passo({ numero, title, body, ultimo, base }: PassoProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduzido = useReducedMotion();
  const mostrar = reduzido ? true : inView;

  const entra = (atraso: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: mostrar ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: {
      duration: reduzido ? 0 : 0.62,
      delay: reduzido ? 0 : base + atraso,
      ease: EASE,
    },
  });

  return (
    /* Em coluna: duas colunas, o número à esquerda e o texto ao lado, com a
       seta a descer pela MESMA coluna do número. É isso que faz a seta ligar
       número a número em vez de ficar a flutuar entre parágrafos.
       Em linha: bloco normal, e a seta sai para a goteira (`left-full`). */
    <li
      ref={ref}
      className="relative grid grid-cols-[3.4rem_1fr] items-start gap-x-3 md:block"
    >
      <motion.span
        {...entra(0)}
        className="font-display block text-[clamp(3.5rem,14vw,7rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-[var(--color-accent)] tabular-nums"
      >
        {numero}
      </motion.span>

      <div className="pt-[0.45rem] md:pt-4">
        <motion.h3 {...entra(0.12)} className="display display--md">
          {title}
        </motion.h3>
        <motion.p
          {...entra(0.24)}
          className="muted mt-2 text-[0.97rem] md:mt-3 md:max-w-[30ch]"
        >
          {body}
        </motion.p>
      </div>

      {!ultimo && (
        <>
          {/* Coluna: desce da base do número até ao número seguinte. */}
          <Seta
            eixo="baixo"
            espelhada={numero === 2}
            atraso={base + 0.45}
            className="col-start-1 mt-3 mb-1 ml-1 h-[4.5rem] w-10 md:hidden"
          />
          {/* Linha: vive na goteira de 3,5 rem, à altura do número. */}
          <Seta
            eixo="direita"
            atraso={base + 0.45}
            className="hidden md:absolute md:top-[calc(clamp(3.5rem,14vw,7rem)*0.425)] md:left-[calc(100%-5.5rem)] md:block md:h-12 md:w-36 md:-translate-y-1/2"
          />
        </>
      )}
    </li>
  );
}

export default function Passos({ className }: { className?: string }) {
  const desktop = useIsDesktop();

  return (
    <ol
      className={`grid gap-y-1 md:grid-cols-3 md:gap-x-14 md:gap-y-0 ${className ?? ""}`}
    >
      {STEPS.map((step, i) => (
        <Passo
          key={step.title}
          numero={i + 1}
          title={step.title}
          body={step.body}
          ultimo={i === STEPS.length - 1}
          base={desktop ? i * 0.72 : 0}
        />
      ))}
    </ol>
  );
}
