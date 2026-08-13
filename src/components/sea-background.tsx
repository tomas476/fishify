"use client";

import { useEffect, useRef } from "react";

/* =========================================================================
   AS BOLHAS

   Ar solto lá no fundo que sobe até à superfície, em tamanhos diferentes.
   Vive num <canvas> fixo em z-index negativo, montado UMA só vez a partir
   do layout. Nenhuma página o remonta.

   Porquê canvas e não uns <div> com `@keyframes`: são 26 bolhas com
   oscilação lateral própria e opacidade a variar com o tamanho. Em DOM
   isso são 26 elementos compostos e animados ao mesmo tempo; em canvas é
   um só elemento e um `arc()` por bolha, que o telemóvel desenha sem dar
   por isso.

   O canvas é dimensionado à JANELA e não ao documento: como é `fixed`,
   as bolhas atravessam o ecrã independentemente de onde a página está.
   ========================================================================= */

/* Subiu de 16/26 para 30/48: com a contagem antiga e a opacidade antiga
   as bolhas quase não se viam, e o fundo lia-se como azul liso. Menos em
   ecrãs estreitos continua a fazer sentido, mas a diferença é de
   densidade e não de existirem. */
function bubbleCount(width: number) {
  return width < 700 ? 30 : 48;
}

type Bubble = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
};

function makeBubble(w: number, h: number, seed: number, atBottom: boolean): Bubble {
  /* Sem Math.random na inicialização do primeiro ecrã não valeria a pena:
     isto é decoração, e uma distribuição pseudo-aleatória simples chega. */
  /* Raios de 3 a 16: as de 2 px eram pó. Um leque mais largo faz-se notar
     porque as grandes leem-se e as pequenas dão profundidade. */
  const r = 3 + Math.random() * 13;
  return {
    x: Math.random() * w,
    /* Ao arrancar, espalha-as pela altura toda. Depois, cada bolha que
       chega ao topo volta a nascer em baixo: nascerem todas em baixo à
       entrada dava uma vaga única e depois nada. */
    y: atBottom ? h + r + Math.random() * 120 : Math.random() * h,
    r,
    /* As grandes sobem mais depressa, como na água. */
    speed: 0.16 + r * 0.038,
    drift: 6 + Math.random() * 16,
    phase: seed * 1.7,
    /* As pequenas continuam mais discretas, mas o piso subiu: a 0,1 de
       branco sobre #e7f2fb a bolha era invisível fora de um ecrã calibrado. */
    alpha: 0.26 + Math.min(r, 14) * 0.026,
  };
}

export default function SeaBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let bubbles: Bubble[] = [];
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let last = 0;

    /* As bolhas NÃO podem passar por cima do vídeo do hero. O canvas é
       fixo e cobre o ecrã todo, por isso corta-se-lhe o topo na altura em
       que o hero acaba: enquanto o vídeo está à vista as bolhas nascem e
       morrem por baixo dele, e assim que ele sai por cima o corte vai a
       zero e elas voltam a subir até ao topo do ecrã.

       `clip-path` e não uma segunda camada: corta na composição, sem
       obrigar a redesenhar nada. */

    const recortar = () => {
      const hero = document.querySelector(".hero");
      const corte = hero
        ? Math.max(0, Math.min(h, hero.getBoundingClientRect().bottom))
        : 0;
      canvas.style.clipPath = `inset(${corte}px 0 0 0)`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      /* setTransform e não scale: a escala do contexto 2D é cumulativa, e
         ao fim de três resizes o desenho estava oito vezes maior. */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const n = bubbleCount(w);
      if (bubbles.length !== n) {
        bubbles = Array.from({ length: n }, (_, i) => makeBubble(w, h, i, false));
      }
      recortar();
    };

    const draw = (t: number) => {
      const dt = last ? Math.min((t - last) / 16.7, 3) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const b of bubbles) {
        b.y -= b.speed * dt;
        if (b.y + b.r < 0) {
          Object.assign(b, makeBubble(w, h, b.phase, true));
          continue;
        }
        const x = b.x + Math.sin(t / 1400 + b.phase) * b.drift;

        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
        ctx.fill();

        /* Aresta e reflexo: sem eles a bolha lê como um ponto branco, e
           não como ar dentro de água. */
        /* A aresta é o que dá a leitura de bolha. Vai mais forte do que o
           interior, e mais grossa nas grandes. */
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, b.alpha * 2.4)})`;
        ctx.lineWidth = b.r > 9 ? 1.5 : 1;
        ctx.stroke();

        if (b.r > 4) {
          ctx.beginPath();
          ctx.arc(x - b.r * 0.32, b.y - b.r * 0.34, b.r * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, b.alpha * 2.6)})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(draw);
    };

    const sync = () => {
      /* Parada com a página escondida, com movimento reduzido, ou com
         poupança de dados. Com movimento reduzido fica um ecrã de bolhas
         quietas, que ainda dá textura sem nada a mexer. */
      if (
        document.hidden ||
        reduced.matches ||
        window.matchMedia("(prefers-reduced-data: reduce)").matches
      ) {
        stop();
        if (!document.hidden) {
          ctx.clearRect(0, 0, w, h);
          for (const b of bubbles) {
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
            ctx.fill();
          }
        }
        return;
      }
      start();
    };

    let recorteAgendado = false;
    const onScroll = () => {
      if (recorteAgendado) return;
      recorteAgendado = true;
      requestAnimationFrame(() => {
        recorteAgendado = false;
        recortar();
      });
    };

    resize();
    recortar();
    sync();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);

    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={ref} className="sea-bubbles" aria-hidden="true" />;
}
