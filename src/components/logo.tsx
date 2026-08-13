import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

/* =========================================================================
   O LOGÓTIPO

   Os dois SVG (`logo.svg` e `mark.svg`) foram vectorizados com potrace a
   partir do avatar do Instagram, que é a única fonte em que o logótipo
   aparece limpo. Não há ficheiro original do cliente: se ele mandar um,
   substituir os dois e apagar este comentário.

   Entram por máscara CSS e não por <img>, porque um SVG carregado como
   imagem externa não herda `currentColor`. Assim a mesma peça é branca em
   cima do vídeo e azul depois de a página rolar, sem duas cópias do
   ficheiro.
   ========================================================================= */

const RATIO = 3852 / 1104;
const MARK_RATIO = 1;

type Props = { className?: string };

export default function Logo({ className }: Props) {
  return (
    <span
      className={cn("block", className)}
      role="img"
      aria-label="Fishify"
      style={{
        aspectRatio: String(RATIO),
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${asset("/img/logo.svg")})`,
        maskImage: `url(${asset("/img/logo.svg")})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

/** Só o símbolo: o peixe dentro do círculo. */
export function LogoMark({ className }: Props) {
  return (
    <span
      className={cn("block", className)}
      aria-hidden="true"
      style={{
        aspectRatio: String(MARK_RATIO),
        backgroundColor: "currentColor",
        WebkitMaskImage: `url(${asset("/img/mark.svg")})`,
        maskImage: `url(${asset("/img/mark.svg")})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
