"use client";

import { useSyncExternalStore } from "react";
import { HOURS } from "@/content/site";
import { cn } from "@/lib/utils";

/* =========================================================================
   O HORÁRIO, COM HOJE EM DESTAQUE

   Uma lista de sete linhas iguais obriga quem chega a contar os dias para
   saber se pode encomendar agora. Aqui a linha de hoje está marcada, diz
   "hoje" e diz se está aberto ou fechado NESTE momento.

   O dia é do RELÓGIO DE QUEM VISITA, portanto não existe no servidor.
   Lido com `useSyncExternalStore` e não com um efeito: o retrato do
   servidor devolve -1, o HTML sai igual para toda a gente, e o cliente
   preenche a seguir. Com um `useState` dentro de um efeito, o ESLint deste
   projecto recusa, e com o dia calculado no render havia um HTML do
   servidor diferente do do cliente.
   ========================================================================= */

/** `HOURS` começa na segunda; o `getDay()` começa no domingo. */
const DOMINGO_PARA_SEGUNDA = [6, 0, 1, 2, 3, 4, 5];

function subscrever(aoMudar: () => void) {
  /* De minuto a minuto: chega para o rótulo de aberto/fechado virar à hora
     certa sem acordar a página a cada segundo. */
  const id = window.setInterval(aoMudar, 60_000);
  return () => window.clearInterval(id);
}

function agoraNoCliente() {
  const d = new Date();
  return `${DOMINGO_PARA_SEGUNDA[d.getDay()]}:${d.getHours()}:${d.getMinutes()}`;
}

function useAgora() {
  return useSyncExternalStore(subscrever, agoraNoCliente, () => "-1:0:0");
}

/** As horas do cliente vêm sempre como "08:00 às 14:00". */
function estaAberto(horas: string | null, h: number, m: number) {
  if (!horas) return false;
  const [inicio, fim] = horas.split(" às ");
  const minutos = h * 60 + m;
  const paraMin = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };
  return minutos >= paraMin(inicio) && minutos < paraMin(fim);
}

export default function Horario() {
  const [diaTexto, horaTexto, minutoTexto] = useAgora().split(":");
  const hoje = Number(diaTexto);
  const hora = Number(horaTexto);
  const minuto = Number(minutoTexto);

  const linhaDeHoje = hoje >= 0 ? HOURS[hoje] : null;
  const aberto = linhaDeHoje
    ? estaAberto(linhaDeHoje.hours, hora, minuto)
    : false;

  return (
    <div>
      {linhaDeHoje && (
        <p className="horario__estado" data-aberto={aberto}>
          {aberto
            ? `Estamos abertos, até às ${linhaDeHoje.hours?.split(" às ")[1]}`
            : linhaDeHoje.hours
              ? `Fechado agora, hoje das ${linhaDeHoje.hours}`
              : "Hoje estamos fechados"}
        </p>
      )}

      <ul className="horario">
        {HOURS.map((h, i) => (
          <li
            key={h.day}
            className={cn("horario__linha", i === hoje && "horario__linha--hoje")}
            aria-current={i === hoje ? "date" : undefined}
          >
            <span className="horario__dia">
              {h.day}
              {i === hoje && <span className="horario__hoje">hoje</span>}
            </span>
            <span className={h.hours ? "" : "muted"}>
              {h.hours ?? "encerrado"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
