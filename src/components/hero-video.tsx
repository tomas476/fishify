"use client";

import { useEffect, useRef } from "react";

/* =========================================================================
   O VÍDEO DO HERO

   Filme da marca: drone sobre Peniche, a lota, as caixas, a carrinha a ser
   carregada. O original tem 32 s e acaba com uma cartela de logótipo sobre
   fundo escurecido; está cortado aos 26,5 s, antes dessa cartela, porque em
   loop a cartela aparecia e desaparecia de dois em dois voltas.

   Duas fontes e um guarda em JS: o atributo `media` de um <source> é
   avaliado UMA VEZ, no carregamento, e não reage a rodar o telemóvel.
   ========================================================================= */

const SMALL = "(max-width: 900px)";
const SMALL_SRC = "/video/hero-sm.mp4";
const FULL_SRC = "/video/hero.mp4";

/** Fica no poster: sem movimento, sem gastar dados de quem os poupa. */
function paused() {
  if (typeof window === "undefined") return true;
  return (
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(prefers-reduced-data: reduce)").matches
  );
}

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const small = window.matchMedia(SMALL);

    const sync = () => {
      video.muted = true;
      if (paused()) {
        video.pause();
        return;
      }
      void video.play().catch(() => {
        /* recusado em poupança de energia: fica o poster, que é aceitável */
      });
    };

    const pickSource = () => {
      const wantsSmall = small.matches;
      const hasSmall = video.currentSrc.includes("hero-sm");
      if (wantsSmall === hasSmall) return;
      video.src = wantsSmall ? SMALL_SRC : FULL_SRC;
      video.load();
    };

    const onChange = () => {
      pickSource();
      sync();
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", onChange);
    reducedData.addEventListener("change", onChange);
    small.addEventListener("change", onChange);

    return () => {
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", onChange);
      reducedData.removeEventListener("change", onChange);
      small.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="hero__video"
        poster="/img/hero-poster.webp"
        muted
        loop
        playsInline
        preload="metadata"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      >
        {/* o pequeno vem primeiro: o primeiro <source> cujo media bate ganha */}
        <source src={SMALL_SRC} type="video/mp4" media={SMALL} />
        <source src={FULL_SRC} type="video/mp4" />
      </video>
      <div className="hero__veil" aria-hidden="true" />
    </>
  );
}
