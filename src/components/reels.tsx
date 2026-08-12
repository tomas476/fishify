import Image from "next/image";
import { REELS } from "@/content/site";
import { num } from "@/lib/utils";

/* =========================================================================
   OS CINCO REELS COM MAIS GOSTOS

   Capa alojada aqui, vídeo no Instagram. Não replicamos os vídeos: o
   objectivo da secção é mandar gente para o perfil deles, que é onde a
   Fishify já tem 24,2 mil seguidores e onde as encomendas começam.

   Em ecrãs pequenos é uma fila que se arrasta com snap; a partir dos
   1024 px passa a grelha de cinco, sem scroll horizontal nenhum.
   ========================================================================= */

export default function Reels() {
  return (
    <div className="reels">
      {REELS.map((reel) => (
        <a
          key={reel.id}
          className="reel reveal"
          href={`https://www.instagram.com/reel/${reel.id}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={`/reels/${reel.id}.webp`}
            alt=""
            width={540}
            height={960}
            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 34vw, 220px"
          />
          <span className="reel__meta">
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
          </span>
        </a>
      ))}
    </div>
  );
}
