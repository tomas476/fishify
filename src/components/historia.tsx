import Image from "next/image";
import { asset } from "@/lib/asset";
import { RETRATOS, STORY, type Voz } from "@/content/site";
import { cn } from "@/lib/utils";

/* =========================================================================
   QUEM SOMOS

   Sem cartão. O texto vive no fundo aberto e a disposição é tipográfica:
   rótulo, título grande, os parágrafos numa serifa que é a única do site,
   e a frase de remate a fechar em display.

   Os parágrafos com voz ALTERNAM de lado. O primeiro com retrato traz-o à
   direita, o seguinte à esquerda com o texto recuado, e por aí fora. É
   essa alternância que faz a secção ler-se como uma conversa entre os dois
   em vez de uma coluna de texto com enfeites todos do mesmo lado.

   `float` e não posicionamento absoluto: é o que faz o texto escoar-se à
   volta do autocolante. Com `position: absolute` a primeira linha corria
   por cima da cara.
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
          src={asset(r.src)}
          alt=""
          width={96}
          height={96}
          className="autocolante__foto"
        />
      ))}
    </span>
  );
}

export default function Historia() {
  /* Conta só os parágrafos que têm retrato: são esses que alternam. Se um
     parágrafo sem voz entrasse na conta, a alternância saltava um lado.
     Calculado antes do render e não com um contador a ser reatribuído lá
     dentro, que é coisa que o React não garante entre renderizações. */
  let vistos = 0;
  const lados = STORY.paragraphs.map((p) =>
    p.voz ? vistos++ % 2 === 1 : false
  );

  return (
    <div className="historia">
      <p className="kicker" data-reveal>
        {STORY.kicker}
      </p>
      <h2 className="display display--lg mt-4" data-reveal="palavras">
        {STORY.title}
      </h2>

      <div className="historia__texto">
        {STORY.paragraphs.map((p, i) => {
          const esquerda = lados[i];

          return (
            <p
              key={p.text}
              className={cn(
                "historia__p",
                esquerda && "historia__p--esquerda"
              )}
              data-reveal
            >
              <Retratos voz={p.voz} />
              {p.text}
            </p>
          );
        })}
      </div>

      <p className="historia__remate" data-reveal>
        {STORY.closing}
      </p>
    </div>
  );
}
