"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   A DOURADA QUE SE ABRE AO SCROLL

   61 frames tirados do vídeo original do cliente (5,04 s a 24 fps, ficaram
   os pares). O índice do frame é uma função pura da posição da secção no
   ecrã, por isso descer separa o peixe e subir volta a juntá-lo, sem
   guardar estado nenhum.

   NÃO PRENDE O SCROLL. A primeira versão tinha um palco `sticky` de 320vh
   e a página agarrava quem descia; foi mandada abaixo por isso. Agora o
   progresso mede-se pela travessia normal da secção: quando o centro dela
   entra por baixo do ecrã o peixe está inteiro, quando sai por cima está
   todo aberto, e a página nunca deixa de responder ao dedo.

   Um <img> só, com o `src` a trocar. A primeira versão era um <canvas>
   com `drawImage`, e num iPhone ficava em branco: o canvas depende do
   contexto 2D estar vivo e de o desenho acontecer, e qualquer falha
   silenciosa deixa um rectângulo vazio sem nada que o denuncie. Um <img>
   ou mostra a imagem ou mostra o alt. Os 61 frames são pré-carregados em
   memória, portanto trocar o `src` é instantâneo e não vai à rede.

   Porquê não um <video> com `currentTime`: o seek de um vídeo comprimido
   salta para o keyframe anterior. Re-encodar tudo em keyframes daria um
   ficheiro maior do que estes ~3 MB.

   Os frames têm CANAL ALFA. Foram refeitos quando o fundo do site passou a
   azul: achatados sobre branco, como estavam, ficavam com um rectângulo
   branco à volta.
   ========================================================================= */

const FRAMES = 61;
const W = 390;
const H = 980;

/** `/frames/fish-001.webp` … `/frames/fish-061.webp` */
function src(i: number) {
  return `/frames/fish-${String(i + 1).padStart(3, "0")}.webp`;
}

/** Legendas ancoradas ao progresso: dão sentido ao movimento. */
const CAPTIONS = [
  { until: 0.22, text: "Inteiro, como saiu da lota de Peniche." },
  { until: 0.72, text: "Escamado e amanhado por quem faz isto há gerações." },
  { until: 1.01, text: "Em posta ou em filete, como o quiser à mesa." },
] as const;

function captionFor(p: number) {
  return (CAPTIONS.find((c) => p < c.until) ?? CAPTIONS[CAPTIONS.length - 1]).text;
}

type Props = {
  /** O elemento cuja travessia do ecrã conduz a animação. Por omissão, a própria secção. */
  className?: string;
};

export default function FishExplode({ className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [caption, setCaption] = useState<string>(CAPTIONS[0].text);
  const still = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    const alvoImg = img.current;
    if (!el || !alvoImg) return;

    const images = new Array<HTMLImageElement | null>(FRAMES).fill(null);
    let drawn = -1;
    let queued = false;
    let alive = true;

    const paint = (index: number) => {
      /* Se o frame pedido ainda não chegou, desenha o mais próximo que já
         existe: mais vale a animação andar a passos largos enquanto
         carrega do que ficar parada no primeiro frame. */
      let best = -1;
      for (let d = 0; d < FRAMES; d++) {
        if (images[index - d]) {
          best = index - d;
          break;
        }
        if (images[index + d]) {
          best = index + d;
          break;
        }
      }
      if (best < 0 || best === drawn) return;
      alvoImg.src = src(best);
      drawn = best;
    };

    /* O progresso é a travessia da FAIXA pelo ecrã. Era medido contra a
       secção do "quem somos" enquanto o peixe vivia lá dentro; agora a
       faixa é uma peça sozinha entre duas secções e mede-se a si própria. */
    const progress = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const curso = rect.height + vh;
      if (curso <= 0) return 0;
      const andado = vh - rect.top;
      /* A janela útil é encolhida nas pontas: o peixe fica inteiro enquanto
         entra e já está aberto antes de sair, em vez de chegar ao fim
         exactamente no instante em que desaparece. */
      /* A faixa é baixa, por isso a travessia é curta: sem encolher a
         janela útil, o peixe abria e fechava num piscar de olhos. */
      const bruto = (andado / curso - 0.2) / 0.55;
      return Math.min(1, Math.max(0, bruto));
    };

    const update = () => {
      queued = false;
      const p = progress();
      paint(Math.round(p * (FRAMES - 1)));
      setCaption(captionFor(p));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    if (still) {
      /* setCaption fora do corpo do efeito: a regra do projecto proíbe
         setState síncrono lá dentro. */
      images[FRAMES - 1] = new Image();
      paint(FRAMES - 1);
      const t = window.setTimeout(
        () => setCaption(CAPTIONS[CAPTIONS.length - 1].text),
        0
      );
      return () => {
        alive = false;
        window.clearTimeout(t);
      };
    }

    /* Primeiro e último à cabeça, que são os dois estados que importam se
       alguém passar depressa; os do meio a seguir, por ordem. Nada de
       Promise.all: cada frame que chega já pode ser desenhado. */
    const order = [0, FRAMES - 1, ...Array.from({ length: FRAMES }, (_, i) => i)];
    let cursor = 0;

    const loadNext = () => {
      if (!alive) return;
      while (cursor < order.length && images[order[cursor]]) cursor++;
      if (cursor >= order.length) return;
      const index = order[cursor++];
      const novo = new Image();
      novo.decoding = "async";
      novo.src = src(index);
      novo.onload = () => {
        if (!alive) return;
        images[index] = novo;
        onScroll();
        loadNext();
      };
      novo.onerror = loadNext;
    };

    loadNext();
    loadNext();
    loadNext();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      alive = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [still]);

  return (
    <div ref={wrap} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element -- o `src` troca
          61 vezes por scroll; o next/image traria um wrapper e um pipeline
          de optimização por cada frame, para imagens que já estão do
          tamanho exacto em que são mostradas */}
      <img
        ref={img}
        className="fish__frame"
        src={src(0)}
        width={W}
        height={H}
        alt="Uma dourada inteira que se separa em postas à medida que a página desce"
        decoding="async"
      />
      <p className="fish__caption">{caption}</p>
    </div>
  );
}
