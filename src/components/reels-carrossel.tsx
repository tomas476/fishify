"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { REELS } from "@/content/site";
import { asset } from "@/lib/asset";
import { num } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   OS REELS, NO CARROSSEL DO SITE DO TOMÁS MARQUES

   Geometria tirada do que está NO AR em tomasmarques.imogrow.pt, e não da
   cópia local do repositório, que ainda tinha a pilha vertical antiga. É
   um coverflow: o cartão em foco ao centro, direito e nítido, e os
   vizinhos a fugir para os lados, rodados, mais pequenos, mais apagados e
   desfocados.

     dist 0   translateX(0%)      scale(1)     rotateY(0)      op 1     blur 0
     dist ±1  translateX(∓45%)    scale(0.85)  rotateY(±10°)   op 0,4   blur 4px
     dist ±2  translateX(∓90%)    scale(0.7)   rotateY(±20°)   op 0,16  blur 7px
     dist ±3  translateX(∓135%)   scale(0.55)  rotateY(±30°)   op 0     blur 7px

   O palco tem `perspective: 1000px` e corta o que sai; a transição é de
   500 ms. O cartão é 9:16.

   A diferença para o Marques: lá os vídeos correm sem som. Aqui há som,
   por pedido, e por isso existe o botão do altifalante. Arranca desligado
   porque nenhum browser deixa um vídeo tocar com som sem um gesto.
   ========================================================================= */

type Pos = {
  x: number;
  escala: number;
  rot: number;
  op: number;
  desfoque: number;
  z: number;
};

function posicaoDe(dist: number): Pos {
  const lado = Math.sign(dist);
  const a = Math.abs(dist);
  const tabela = [
    { x: 0, escala: 1, rot: 0, op: 1, desfoque: 0, z: 10 },
    { x: 45, escala: 0.85, rot: 10, op: 0.4, desfoque: 4, z: 9 },
    { x: 90, escala: 0.7, rot: 20, op: 0.16, desfoque: 7, z: 8 },
    { x: 135, escala: 0.55, rot: 30, op: 0, desfoque: 7, z: 7 },
  ];
  const t = tabela[Math.min(a, 3)];
  return { ...t, x: t.x * lado, rot: -t.rot * lado };
}

/** Arrasto mínimo, em pixéis, para passar de cartão. */
const LIMIAR = 50;

export default function ReelsCarrossel() {
  const total = REELS.length;
  const [foco, setFoco] = useState(0);
  const [comSom, setComSom] = useState(false);
  const [noEcra, setNoEcra] = useState(false);
  const reduzido = useReducedMotion();

  const palcoRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const arrasto = useRef<number | null>(null);

  const distancia = useCallback(
    (i: number) => {
      let d = i - foco;
      if (d > total / 2) d -= total;
      if (d < -total / 2) d += total;
      return d;
    },
    [foco, total]
  );

  const navegar = useCallback(
    (passo: number) => setFoco((i) => (i + passo + total) % total),
    [total]
  );

  /* Só toca quando a secção está à vista. Um dos reels tem sete minutos:
     se arrancasse ao montar, gastava dados de quem nem lá chegou. */
  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    const obs = new IntersectionObserver(
      ([e]) => setNoEcra(!!e?.isIntersecting),
      { threshold: 0.35 }
    );
    obs.observe(palco);
    return () => obs.disconnect();
  }, []);

  /* Uma tentativa por gesto, e desarma-se a seguir. */
  const armado = useRef(false);
  const armarGesto = useCallback(() => {
    if (armado.current) return;
    armado.current = true;

    const tentar = () => {
      armado.current = false;
      const v = videoRef.current;
      if (!v) return;
      void v.play().catch(() => {});
    };

    window.addEventListener("pointerdown", tentar, { once: true, passive: true });
    window.addEventListener("scroll", tentar, { once: true, passive: true });
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !comSom;
    if (reduzido || !noEcra) {
      v.pause();
      return;
    }
    void v.play().catch(() => {
      /* Recusado. Em poupança de energia o iOS não deixa arrancar nada
         sozinho, e a única coisa que o convence é um gesto: fica armado
         para a primeira vez que se toque no ecrã. Até lá vê-se a capa,
         que está por baixo. */
      armarGesto();
    });
  }, [foco, comSom, reduzido, noEcra, armarGesto]);

  const emFoco = REELS[foco];

  return (
    <div>
      <div
        ref={palcoRef}
        className="cf"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Reels do Instagram da Fishify"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            navegar(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            navegar(1);
          }
        }}
        onPointerDown={(e) => {
          arrasto.current = e.clientX;
        }}
        onPointerUp={(e) => {
          const inicio = arrasto.current;
          arrasto.current = null;
          if (inicio === null) return;
          const delta = e.clientX - inicio;
          if (Math.abs(delta) > LIMIAR) navegar(delta < 0 ? 1 : -1);
        }}
      >
        {REELS.map((reel, i) => {
          const d = distancia(i);
          if (Math.abs(d) > 3) return null;
          const p = posicaoDe(d);
          const ativo = d === 0;

          return (
            <div
              key={reel.id}
              className="cf__cartao"
              data-dist={Math.abs(d)}
              aria-hidden={!ativo}
              style={{
                transform: `translateX(${p.x}%) scale(${p.escala}) rotateY(${p.rot}deg)`,
                zIndex: p.z,
                opacity: p.op,
                filter: p.desfoque ? `blur(${p.desfoque}px)` : undefined,
                transitionDuration: reduzido ? "0ms" : undefined,
              }}
              onClick={() => !ativo && navegar(d)}
            >
              <div className="cf__moldura">
                {ativo ? (
                  <>
                    {/* A CAPA POR BAIXO DO VÍDEO, sempre. O atributo
                        `poster` não chega: num iPhone em poupança de
                        energia o play é recusado, o vídeo fica sem frames
                        E sem poster pintado, e o cartão do meio aparecia
                        em branco enquanto os vizinhos mostravam a capa.
                        Com a imagem por baixo, o pior caso é ver a capa. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="cf__media"
                      src={asset(`/reels/${reel.id}.webp`)}
                      alt=""
                      width={540}
                      height={960}
                      decoding="async"
                      draggable={false}
                    />
                    <video
                      ref={videoRef}
                      className="cf__media cf__media--video"
                      src={asset(`/reels/${reel.id}.mp4`)}
                      poster={asset(`/reels/${reel.id}.webp`)}
                      loop
                      playsInline
                      preload="none"
                      controls={false}
                      disablePictureInPicture
                    />
                  </>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element -- capa
                     já no tamanho exacto; o next/image traria um wrapper por
                     cartão sem nada a ganhar */
                  <img
                    className="cf__media"
                    src={asset(`/reels/${reel.id}.webp`)}
                    alt=""
                    width={540}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                )}

                {ativo && (
                  <>
                    <button
                      type="button"
                      className="cf__som"
                      onClick={(e) => {
                        e.stopPropagation();
                        /* O play() sai daqui, de dentro do gesto: ligar o
                           som é exactamente o que o browser recusa fora de
                           um toque, e sem isto o vídeo parava ao ganhar
                           som. */
                        const v = videoRef.current;
                        const ligar = !comSom;
                        setComSom(ligar);
                        if (v) {
                          v.muted = !ligar;
                          void v.play().catch(() => {});
                        }
                      }}
                      aria-label={comSom ? "Desligar o som" : "Ligar o som"}
                    >
                      {comSom ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>

                    <a
                      className="cf__meta"
                      href={`https://www.instagram.com/reel/${reel.id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                      <span className="sr-only">, ver no Instagram</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="cf__seta cf__seta--esq"
          onClick={() => navegar(-1)}
          aria-label="Reel anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          className="cf__seta cf__seta--dir"
          onClick={() => navegar(1)}
          aria-label="Reel seguinte"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Reel ${foco + 1} de ${total}, ${num(emFoco.likes)} gostos`}
      </p>
    </div>
  );
}
