import Image from "next/image";
import { asset } from "@/lib/asset";

/* =========================================================================
   FOTO RASGADA

   A fotografia do Rui e da Beatriz abre o "quem somos" logo a seguir ao
   hero: quase a toda a largura, a nascer do azul da página em cima e
   rasgada em baixo, como uma folha arrancada.

   Não tem estado nem JavaScript, e nada aqui se mexe. O rasgão é uma
   máscara em CSS, e a orla clara da fibra nasce de duas máscaras
   diferentes: o contentor recorta por uma curva, a imagem recorta por
   outra um pouco acima, e pelo vão entre as duas vê-se a chapa clara.
   Ver `src/app/parts/sobre.css`.

   A caixa desfaz sozinha a margem de quem a envolve, por isso pode ficar
   dentro de uma `.shell` ou fora dela: em qualquer dos casos abre quase a
   toda a largura.

   O `src` passa por `asset()` porque com `images.unoptimized` o
   `next/image` devolve o caminho tal e qual, sem o prefixo da subpasta.
   ========================================================================= */

export default function FotoRasgada({ className }: { className?: string }) {
  return (
    <figure className={`foto-rasgada${className ? ` ${className}` : ""}`}>
      <div className="foto-rasgada__folha">
        {/* a chapa clara que se vê pelo rasgão: é ela a fibra do papel */}
        <span className="foto-rasgada__fibra" aria-hidden="true" />
        <Image
          src={asset("/img/carrinha.webp")}
          alt="O Rui e a Beatriz à frente da carrinha da Fishify, no porto de Peniche"
          width={1100}
          height={733}
          sizes="100vw"
          loading="eager"
          className="foto-rasgada__img"
        />
      </div>
    </figure>
  );
}
