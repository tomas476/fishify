"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   A DOURADA QUE SE ABRE AO SCROLL

   61 frames tirados do vídeo original (5,04 s a 24 fps, ficaram os pares).
   Descer separa o peixe em postas, subir volta a juntá-lo: o índice do frame
   é uma função pura da posição do scroll, por isso a animação é reversível
   sem guardar estado nenhum.

   Porquê canvas e não 61 <img> empilhados: com <img> o browser só decodifica
   a imagem quando ela fica visível, e a primeira passagem por cada frame
   engasgava. Aqui as imagens são descodificadas para memória antes de
   entrarem em jogo, e o desenho é um `drawImage` por frame.

   Porquê não um <video> com `currentTime`: o seek de um vídeo comprimido
   salta para o keyframe anterior. Ou se re-encoda tudo em keyframes (e o
   ficheiro fica maior do que estes 2,3 MB) ou se aceita a animação aos
   solavancos. Frames resolvem isto sem nenhuma das duas penalizações.
   ========================================================================= */

const FRAMES = 61;
const W = 440;
const H = 1105;

/** `/frames/fish-001.webp` … `/frames/fish-061.webp` */
function src(i: number) {
  return `/frames/fish-${String(i + 1).padStart(3, "0")}.webp`;
}

/** Legendas ancoradas ao progresso: dão sentido à animação. */
const CAPTIONS = [
  /* Os limiares seguem o que se VÊ, não uma divisão em três partes iguais:
     aos 0,60 do curso o peixe ainda está a meio da separação, e a legenda
     das postas a essa altura contradizia a imagem. */
  { until: 0.22, text: "Inteiro, como saiu da lota de Peniche." },
  { until: 0.72, text: "Escamado e amanhado por quem faz isto há gerações." },
  { until: 1.01, text: "Em posta ou em filete, como o quiser à mesa." },
] as const;

function captionFor(p: number) {
  return (CAPTIONS.find((c) => p < c.until) ?? CAPTIONS[CAPTIONS.length - 1]).text;
}

export default function FishExplode() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [caption, setCaption] = useState<string>(CAPTIONS[0].text);
  /* Com movimento reduzido o palco encolhe para uma secção normal e mostra
     só o peixe já aberto: 320vh de scroll preso é exactamente o tipo de
     coisa que esta preferência existe para evitar. */
  const still = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    const ctx = cv.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* O canvas tem sempre o tamanho do master. Escalá-lo por CSS custa
       nada e evita redesenhar tudo a cada resize da janela. */
    cv.width = W;
    cv.height = H;
    ctx.fillStyle = "#ffffff";

    const images = new Array<HTMLImageElement | null>(FRAMES).fill(null);
    let drawn = -1;
    let queued = false;
    let alive = true;

    const paint = (index: number) => {
      /* Se o frame pedido ainda não chegou, fica o mais próximo que já
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
      const img = images[best];
      if (!img) return;
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);
      drawn = best;
    };

    const progress = () => {
      const rect = el.getBoundingClientRect();
      /* O palco é sticky e ocupa a altura da janela: o curso útil é a
         altura do invólucro menos uma janela. */
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / travel));
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
      const img = new Image();
      img.src = src(FRAMES - 1);
      img.onload = () => {
        if (!alive) return;
        images[FRAMES - 1] = img;
        paint(FRAMES - 1);
        setCaption(CAPTIONS[CAPTIONS.length - 1].text);
      };
      return () => {
        alive = false;
      };
    }

    /* Carregamento: primeiro e último à cabeça (são os dois estados que
       importam se o utilizador passar depressa), depois os do meio por
       ordem. Nada de `Promise.all`: cada frame que chega já pode ser
       desenhado. */
    const order = [0, FRAMES - 1, ...Array.from({ length: FRAMES }, (_, i) => i)];
    let cursor = 0;

    const loadNext = () => {
      if (!alive) return;
      while (cursor < order.length && images[order[cursor]]) cursor++;
      if (cursor >= order.length) return;
      const index = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = src(index);
      img.onload = () => {
        if (!alive) return;
        images[index] = img;
        if (index === 0 && drawn < 0) paint(0);
        else onScroll();
        loadNext();
      };
      img.onerror = loadNext;
    };

    /* Três em paralelo: enche depressa sem competir com o vídeo do hero
       por ligações. */
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
    /* 320vh de curso: dá ~5 px de scroll por frame no telemóvel, que é o
       ponto em que a separação se lê como movimento contínuo e não como
       diapositivos. */
    <div ref={wrap} className="fish" style={{ height: still ? "auto" : "320vh" }}>
      <div className="fish__stage">
        <canvas
          ref={canvas}
          className="fish__frame"
          role="img"
          aria-label="Uma dourada inteira que se separa em postas à medida que a página desce"
        />
        <p className="fish__caption">{caption}</p>
      </div>
    </div>
  );
}
