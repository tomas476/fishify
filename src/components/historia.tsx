import Image from "next/image";
import { RETRATOS, STORY, type Voz } from "@/content/site";

/* =========================================================================
   O CARTÃO DE "QUEM SOMOS"

   O texto deles vive dentro de um cartão, e cada parágrafo leva no canto a
   fotografia redonda de quem está a falar: o Rui na parte dele, a Beatriz
   na dela, e as duas lado a lado quando falam em conjunto. É isso que
   transforma um texto corrido numa conversa.

   As fotografias são decorativas: quem é que fala já está escrito na
   primeira palavra de cada parágrafo ("Eu sou o Rui"). Por isso levam
   `alt` vazio e não repetem a informação a quem ouve a página.
   ========================================================================= */

function Retratos({ voz }: { voz: Voz }) {
  if (!voz) return null;

  const quem =
    voz === "ambos"
      ? [RETRATOS.rui, RETRATOS.beatriz]
      : [voz === "rui" ? RETRATOS.rui : RETRATOS.beatriz];

  return (
    <span className="historia__retratos" aria-hidden="true">
      {quem.map((r) => (
        <Image
          key={r.src}
          src={r.src}
          alt=""
          width={88}
          height={88}
          className="historia__retrato"
        />
      ))}
    </span>
  );
}

export default function Historia() {
  return (
    <div className="panel historia" data-reveal="escala">
      <p className="kicker">{STORY.kicker}</p>
      <h2 className="display display--lg mt-4" data-reveal="palavras">
        {STORY.title}
      </h2>

      <div className="mt-8 flex flex-col gap-6">
        {STORY.paragraphs.map((p) => (
          <p key={p.text} className="historia__p" data-reveal>
            <Retratos voz={p.voz} />
            {p.text}
          </p>
        ))}
      </div>

      <p className="display display--md mt-9" data-reveal>
        {STORY.closing}
      </p>
    </div>
  );
}
