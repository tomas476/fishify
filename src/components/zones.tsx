import { WA_MESSAGES, ZONES, wa } from "@/content/site";

/* =========================================================================
   AS ZONAS DE ENTREGA

   O dia de cada zona não está no material do cliente e não se inventa: cada
   zona abre uma conversa de WhatsApp já escrita com o nome dela lá dentro,
   que é exactamente o que eles pedem hoje no Instagram ("saiba onde
   entregamos por mensagem"). Quando o Rui mandar o mapa semanal, entra um
   campo `day` no ZONES e mostra-se aqui ao lado do nome.
   ========================================================================= */

export default function Zones() {
  return (
    /* Três colunas a partir dos 1024: com duas, a quinta zona ficava sozinha
       numa linha com metade da largura vazia ao lado. */
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ZONES.map((zone) => (
        <li key={zone.name} className="panel reveal flex flex-col gap-3">
          <div>
            <h3 className="display display--md">{zone.name}</h3>
            <p className="muted mt-2 text-[0.95rem]">{zone.note}</p>
          </div>
          <a
            className="btn mt-auto self-start"
            href={wa(WA_MESSAGES.zone(zone.name))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar entrega
            <span className="sr-only"> em {zone.name} pelo WhatsApp</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
