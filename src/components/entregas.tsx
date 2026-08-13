"use client";

import { useState } from "react";
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

export default function Entregas() {
  const [zona, setZona] = useState<string | null>(null);

  return (
    <div>
      <MapaEntregas onSelect={setZona} />

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
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
      </div>
    </div>
  );
}
