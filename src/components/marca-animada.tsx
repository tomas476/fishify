"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/asset";

/* =========================================================================
   A MARCA A NADAR

   O peixe do logótipo a girar dentro do círculo, em ciclo, ao lado do
   formulário. O vídeo original é quadrado com fundo branco: está cortado
   ao CÍRCULO, e como o círculo é azul cheio, o branco desaparece sem
   precisar de transparência (que o H.264 não tem e que em WebM não passa
   no Safari).

   Só toca quando está à vista, como todos os vídeos deste site, e fica
   parado no primeiro frame para quem pediu movimento reduzido: aí é só o
   símbolo da marca, que é o que ele é de qualquer maneira.
   ========================================================================= */

type Props = { className?: string };

export default function MarcaAnimada({ className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const parado =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(prefers-reduced-data: reduce)").matches;

    if (parado) return;

    v.muted = true;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 }
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={asset("/video/marca.mp4")}
      poster={asset("/img/marca-poster.webp")}
      width={360}
      height={360}
      muted
      loop
      playsInline
      preload="none"
      controls={false}
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
