"use client";

import { useState } from "react";
import Link from "next/link";
import MapaEntregas from "@/components/mapa-entregas";
import { WA_MESSAGES, wa } from "@/content/site";

/* =========================================================================
   O MAPA MAIS O CTA

   Os cartões por zona, cada um com o seu botão, foram abaixo: cinco vezes
   "Agendar entrega" na mesma página não é escolha, é ruído. Ficou o mapa a
   escolher e UM botão só, que se escreve com a zona escolhida.

   Enquanto ninguém escolhe, o botão continua a valer: manda a mensagem
   genérica de agendamento. Um CTA desactivado à espera de um clique no
   mapa seria uma armadilha em quem chega pelo telemóvel.
   ========================================================================= */

type Props = {
  /** `detalhes` na landing, que só convida a saber mais; `agendar` na
      página das entregas, onde já faz sentido abrir a conversa. */
  cta?: "agendar" | "detalhes";
};

export default function Entregas({ cta = "agendar" }: Props) {
  const [zona, setZona] = useState<string | null>(null);

  return (
    <div>
      <MapaEntregas onSelect={setZona} />

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        {cta === "detalhes" ? (
          <>
            <Link className="btn btn--solid btn--block sm:w-auto" href="/entregas">
              Ver detalhes das entregas
            </Link>
            <p className="muted text-[0.9rem]">
              Os concelhos de cada zona, como funciona e as perguntas do
              costume.
            </p>
          </>
        ) : (
          <>
            <a
              className="btn btn--solid btn--block sm:w-auto"
              href={wa(zona ? WA_MESSAGES.zone(zona) : WA_MESSAGES.schedule)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {zona ? `Agendar entrega em ${zona}` : "Agendar entrega"}
            </a>
            <p className="muted text-[0.9rem]">
              Abre o WhatsApp com a mensagem já escrita.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
