"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { REELS } from "@/content/site";
import { asset } from "@/lib/asset";
import { num } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   OS REELS, NA PILHA VERTICAL DO SITE DO TOMÁS MARQUES

   Substitui o leque do site do Diogo. A geometria é a do
   `vertical-image-stack` do Marques, copiada tal e qual porque é o que faz
   a pilha ler-se: o cartão em foco ao centro, os vizinhos a ∓160 px com
   escala 0,82 e opacidade 0,6, os seguintes a ∓280 px com escala 0,7 e
   opacidade 0,3, e molas de stiffness 300 / damping 30 / mass 1.

   A diferença para o Marques: lá são fotografias, aqui são VÍDEOS, e com
   som. Duas consequências que mandam no desenho todo:

   1. Só o cartão em foco pede vídeo à rede. Cinco vídeos a tocar ao mesmo
      tempo eram dezenas de megabytes e bateria a troco de nada. Os outros
      ficam na capa.
   2. O som ARRANCA DESLIGADO, sempre. Nenhum browser deixa um vídeo tocar
      com som sem um gesto do utilizador, e um site que grita ao abrir é
      um site que se fecha. O botão do altifalante é esse gesto.
   ========================================================================= */

/** Rácio dos reels do Instagram. */
const RACIO = 9 / 16;

type Geometria = {
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  rotateX: number;
};

/** A tabela do Marques, intocada. */
function geometriaDe(diff: number): Geometria {
  if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
  if (diff === -1)
    return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 };
  if (diff === -2)
    return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 };
  if (diff === 1)
    return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 };
  if (diff === 2)
    return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 };
  return {
    y: diff > 0 ? 400 : -400,
    scale: 0.6,
    opacity: 0,
    zIndex: 0,
    rotateX: diff > 0 ? -20 : 20,
  };
}

const MOLA = { type: "spring" as const, stiffness: 300, damping: 30, mass: 1 };

export default function ReelsStack() {
  const total = REELS.length;
  /* Arranca no de mais gostos, que é o primeiro da lista. */
  const [foco, setFoco] = useState(0);
  const [comSom, setComSom] = useState(false);
  /* Só toca quando a secção está mesmo à vista. Não é só bateria: um dos
     reels tem sete minutos e 35 MB, e o vídeo só descarrega o que toca
     (o ficheiro tem `faststart` e o servidor responde a pedidos por
     intervalo). Se arrancasse ao montar, quem abrisse a página gastava
     dados numa coisa que nem chegou a ver. */
  const [noEcra, setNoEcra] = useState(false);
  const reduzido = useReducedMotion();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Distância circular ao cartão em foco. */
  const distancia = useCallback(
    (index: number) => {
      let diff = index - foco;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      return diff;
    },
    [foco, total]
  );

  const navegar = useCallback(
    (passo: number) => setFoco((i) => (i + passo + total) % total),
    [total]
  );

  /* O vídeo em foco toca; ao mudar de cartão, o elemento é o mesmo e só
     lhe troca a fonte, por isso é preciso mandá-lo tocar outra vez. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !comSom;
    if (reduzido || !noEcra) {
      v.pause();
      return;
    }
    void v.play().catch(() => {
      /* recusado sem gesto: fica a capa por baixo, que é o mesmo frame */
    });
  }, [foco, comSom, reduzido, noEcra]);

  /* Quem decide se está à vista é o palco e não o vídeo: o vídeo é
     remontado a cada mudança de cartão e o observador perdia-se. */
  const palcoRef = useRef<HTMLDivElement | null>(null);

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

  const aoTeclado = (evento: React.KeyboardEvent) => {
    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      navegar(-1);
    } else if (evento.key === "ArrowDown") {
      evento.preventDefault();
      navegar(1);
    }
  };

  const emFoco = REELS[foco];

  return (
    <div className="reels-pilha">
      {/* Controlos à esquerda, como no Marques: subir, contador, descer. */}
      <div className="reels-pilha__nav">
        <button
          type="button"
          className="reels-pilha__seta"
          onClick={() => navegar(-1)}
          aria-label="Reel anterior"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        <p className="reels-pilha__conta" aria-live="polite">
          <span>{foco + 1}</span>
          <span className="muted"> de {total}</span>
        </p>

        <button
          type="button"
          className="reels-pilha__seta"
          onClick={() => navegar(1)}
          aria-label="Reel seguinte"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div
        ref={palcoRef}
        className="reels-pilha__palco"
        role="group"
        aria-label="Reels do Instagram da Fishify"
        tabIndex={0}
        onKeyDown={aoTeclado}
      >
        {REELS.map((reel, i) => {
          const diff = distancia(i);
          if (Math.abs(diff) > 2) return null;
          const g = geometriaDe(diff);
          const ativo = diff === 0;

          return (
            <motion.div
              key={reel.id}
              className="reels-pilha__cartao"
              animate={{
                y: g.y,
                scale: g.scale,
                opacity: g.opacity,
                rotateX: g.rotateX,
              }}
              transition={reduzido ? { duration: 0 } : MOLA}
              style={{ zIndex: g.zIndex, aspectRatio: String(RACIO) }}
              onClick={() => !ativo && navegar(diff)}
              aria-hidden={!ativo}
            >
              {ativo ? (
                <video
                  ref={videoRef}
                  className="reels-pilha__media"
                  src={asset(`/reels/${reel.id}.mp4`)}
                  poster={asset(`/reels/${reel.id}.webp`)}
                  loop
                  playsInline
                  preload="none"
                  controls={false}
                  disablePictureInPicture
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- capa
                   estática já no tamanho exacto; o next/image traria um
                   wrapper por cartão sem nada a ganhar */
                <img
                  className="reels-pilha__media"
                  src={asset(`/reels/${reel.id}.webp`)}
                  alt=""
                  width={540}
                  height={960}
                  loading="lazy"
                  decoding="async"
                />
              )}

              {ativo && (
                <>
                  <button
                    type="button"
                    className="reels-pilha__som"
                    onClick={(e) => {
                      e.stopPropagation();
                      /* O play() tem de sair DAQUI, de dentro do gesto, e
                         não do efeito que reage ao estado: ligar o som a
                         um vídeo é exactamente o que o browser recusa
                         fora de um toque do utilizador, e sem isto o
                         vídeo desligava-se ao ganhar som. */
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
                    className="reels-pilha__meta"
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
            </motion.div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Reel ${foco + 1} de ${total}, ${num(emFoco.likes)} gostos`}
      </p>
    </div>
  );
}
