import Image from "next/image";
import { RETRATOS, STORY, type Voz } from "@/content/site";

/* =========================================================================
   QUEM SOMOS

   Sem cartão. O texto vive no fundo aberto da página e é a tipografia que
   faz a disposição: o rótulo, o título grande, os parágrafos numa medida
   confortável, e a frase de remate a fechar em tamanho de display.

   Cada parágrafo leva no CANTO SUPERIOR DIREITO o retrato de quem está a
   falar, como um autocolante posto ali à mão: ligeiramente torto, com um
   rebordo claro à volta e sombra curta. Nos parágrafos em que falam os
   dois, os dois retratos lado a lado e tortos ao contrário um do outro.

   `float: right` e não posicionamento absoluto: é o que faz o texto
   escoar-se à volta do autocolante em vez de lhe passar por baixo. Com
   `position: absolute` a primeira linha corria por cima da cara.
   ========================================================================= */

function Retratos({ voz }: { voz: Voz }) {
  if (!voz) return null;

  const quem =
    voz === "ambos"
      ? [RETRATOS.rui, RETRATOS.beatriz]
      : [voz === "rui" ? RETRATOS.rui : RETRATOS.beatriz];

  return (
    /* Decorativo: quem fala já está escrito na primeira palavra do
       parágrafo ("Eu sou o Rui"), por isso os retratos não repetem essa
       informação a quem ouve a página. */
    <span className="autocolante" aria-hidden="true">
      {quem.map((r) => (
        <Image
          key={r.src}
          src={r.src}
          alt=""
          width={112}
          height={112}
          className="autocolante__foto"
        />
      ))}
    </span>
  );
}

export default function Historia() {
  return (
    <div className="historia">
      <p className="kicker" data-reveal>
        {STORY.kicker}
      </p>
      <h2 className="display display--lg mt-4" data-reveal="palavras">
        {STORY.title}
      </h2>

      <div className="historia__texto">
        {STORY.paragraphs.map((p) => (
          <p key={p.text} className="historia__p" data-reveal>
            <Retratos voz={p.voz} />
            {p.text}
          </p>
        ))}
      </div>

      <p className="historia__remate" data-reveal>
        {STORY.closing}
      </p>
    </div>
  );
}
