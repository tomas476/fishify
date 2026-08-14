"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import { STEPS } from "@/content/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   COMO FUNCIONA, SEM CARTÕES

   Só tipografia sobre o papel: o número é o elemento gráfico, no azul claro
   do acento (o --accent-deep é para texto pequeno, aqui não faz falta porque
   um número de 54 a 88 px já passa o contraste de texto grande), e o título
   fica em tinta cheia para ganhar sempre a competição visual.

   Os três passos ficam EM COLUNA nos dois tamanhos, com o peixe ao lado.
   Havia aqui um segundo desenho, em linha, com uma seta própria a apontar
   para a direita: desapareceu com a fila horizontal, e a seta que desce
   passou a servir os dois tamanhos.

   A seta é conteúdo: conta a sequência de um passo para o seguinte.
   ========================================================================= */

const EASE = [0.22, 1, 0.36, 1] as const;

type SetaProps = {
  /** Espelha a curva para a esquerda: dá o alternado entre a 1.ª e a 2.ª. */
  espelhada?: boolean;
  atraso: number;
  className?: string;
};

/*
   A curva parte do número, abre para o lado e volta ao centro, e a ponta
   está calculada sobre a tangente real do fim do traço, não encostada a
   olho. A caixa é estreita e alta porque é isso que a faz descer pela
   coluna do número em vez de flutuar entre parágrafos.
*/
const CURVA = {
  viewBox: "0 0 40 72",
  traco: "M 20 4 C 36 20, 28 50, 21 66",
  ponta: "M 30.4 58.5 L 21 66 L 20.1 54",
  espessura: 2.4,
} as const;

function Seta({ espelhada = false, atraso, className }: SetaProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduzido = useReducedMotion();
  const desenhar = reduzido || inView;

  const tracoDur = reduzido ? 0 : 0.9;

  return (
    <svg
      ref={ref}
      viewBox={CURVA.viewBox}
      fill="none"
      aria-hidden="true"
      className={`text-[var(--color-accent)] ${espelhada ? "-scale-x-100" : ""} ${className ?? ""}`}
    >
      {/* AS SETAS DESENHAM-SE EM CICLO enquanto estão à vista: o traço
          nasce, fica um bocado inteiro, apaga-se e volta a nascer. O
          `times` é o que segura a seta desenhada durante metade do ciclo,
          senão isto lia-se como um pisca-pisca em vez de um desenho.

          O `repeat` só existe depois de a seta ter entrado a primeira vez
          (é o `desenhar`), para o ciclo não começar a meio com a página
          ainda longe da secção. */}
      <motion.path
        d={CURVA.traco}
        stroke="currentColor"
        strokeWidth={CURVA.espessura}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: desenhar ? [0, 1, 1, 0] : 0 }}
        transition={
          reduzido
            ? { duration: 0 }
            : {
                duration: tracoDur + 2.2,
                times: [0, tracoDur / (tracoDur + 2.2), 0.82, 1],
                ease: EASE,
                delay: atraso,
                repeat: Infinity,
                repeatDelay: 0.5,
              }
        }
      />
      {/* A ponta só aparece quando o traço já lá chegou, e apaga-se com ele. */}
      <motion.path
        d={CURVA.ponta}
        stroke="currentColor"
        strokeWidth={CURVA.espessura}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: desenhar ? [0, 0, 1, 1, 0] : 0 }}
        transition={
          reduzido
            ? { duration: 0 }
            : {
                duration: tracoDur + 2.2,
                times: [0, 0.62, 0.76, 0.86, 1],
                ease: "easeOut",
                delay: atraso,
                repeat: Infinity,
                repeatDelay: 0.5,
              }
        }
      />
    </svg>
  );
}

type PassoProps = {
  numero: number;
  title: string;
  body: string;
  ultimo: boolean;
};

function Passo({ numero, title, body, ultimo }: PassoProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduzido = useReducedMotion();
  const mostrar = reduzido ? true : inView;

  /* Não há atraso base por passo. Existia um só em desktop, porque a fila
     horizontal punha os três dentro do ecrã ao mesmo tempo; em coluna cada
     passo entra por si e um atraso extra só o deixava a chegar tarde. */
  const entra = (atraso: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: mostrar ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: {
      duration: reduzido ? 0 : 0.62,
      delay: reduzido ? 0 : atraso,
      ease: EASE,
    },
  });

  return (
    /* Duas colunas: o número à esquerda e o texto ao lado, com a seta a
       descer pela MESMA coluna do número. É isso que faz a seta ligar
       número a número. */
    <li
      ref={ref}
      className="grid grid-cols-[3.4rem_1fr] items-start gap-x-3 md:grid-cols-[5.5rem_1fr] md:gap-x-6"
    >
      <motion.span
        {...entra(0)}
        className="font-display block text-[clamp(3.5rem,14vw,7rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-[var(--color-accent)] tabular-nums md:text-[clamp(4.5rem,5vw,5.5rem)]"
      >
        {numero}
      </motion.span>

      <div className="pt-[0.45rem] md:pt-3">
        <motion.h3 {...entra(0.12)} className="display display--md">
          {title}
        </motion.h3>
        <motion.p
          {...entra(0.24)}
          className="muted mt-2 max-w-[58ch] text-[0.97rem] md:mt-3 md:text-[1.02rem]"
        >
          {body}
        </motion.p>
      </div>

      {!ultimo && (
        /* Desce da base do número até ao número seguinte, e cresce com o
           espaço que o desenho em coluna passou a ter. */
        <Seta
          espelhada={numero === 2}
          atraso={0.45}
          className="col-start-1 mt-3 mb-1 ml-1 h-[4.5rem] w-10 md:mt-5 md:mb-3 md:h-[clamp(5.5rem,7vw,8rem)] md:w-14"
        />
      )}
    </li>
  );
}

export default function Passos({ className }: { className?: string }) {
  return (
    <ol className={`grid gap-y-1 md:gap-y-3 ${className ?? ""}`}>
      {STEPS.map((step, i) => (
        <Passo
          key={step.title}
          numero={i + 1}
          title={step.title}
          body={step.body}
          ultimo={i === STEPS.length - 1}
        />
      ))}
    </ol>
  );
}
