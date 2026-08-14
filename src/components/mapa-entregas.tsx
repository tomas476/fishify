"use client";

import { motion, useInView } from "framer-motion";
import { useId, useRef, useState } from "react";
import { ZONES } from "@/content/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   MAPA DAS ENTREGAS

   Portugal continental desenhado à mão. O contorno saiu de uma projecção
   equirectangular simples sobre trinta e tal pontos de costa e de fronteira
   lidos do atlas:

       x = 20 + (longitude + 9,55) * 77,1
       y = 25 + (42,20 - latitude) * 100

   O 77,1 é o 100 encolhido por cos(39,5°), a latitude do meio do país. Sem
   isso Portugal sai gordo. Os pontos foram depois passados por Catmull-Rom
   com dureza variável por vértice, para que os bicos que dão a leitura do
   país (Peniche, o Cabo da Roca, o Espichel, Sagres, Vila Real de Santo
   António, Miranda do Douro) não fossem arredondados até desaparecerem.

   A caixa do desenho começa em x negativo: o rótulo de Peniche fica no mar,
   à esquerda da costa, e precisa desse espaço.

   As zonas são discos recortados pelo contorno do país. Não são fronteiras
   administrativas e não fingem ser: são a área que a carrinha cobre, que é
   o que a página tem para dizer. Os concelhos exactos estão no `note` de
   cada zona, no painel ao lado.

   Semântica: o SVG é decoração (`aria-hidden`) e quem manda são os botões
   de texto. Assim há um só percurso de teclado e um só anúncio por zona, em
   vez de dois controlos concorrentes para a mesma coisa.
   ========================================================================= */

const PORTUGAL =
  "M72.4,58C71.5,60.6 74.8,67.2 76.3,77C77.8,86.8 77.9,96.2 80.1,107C82.3,117.8 86.5,120.4 87.1,131C87.7,141.6 84.3,149.2 83.2,160C82.1,170.8 83.4,174 81.7,185C80,196 76.7,205.4 74.7,215C72.7,224.6 73.9,224 71.7,233C69.5,242 66.8,249.6 63.9,260C61,270.4 59.5,278 57,285C54.5,292 55.1,291 51.6,295C48.1,299 41.5,303.6 39.3,305C37.1,306.5 29.3,309.2 29.3,309.5C29.3,309.8 37.4,312.4 37.7,314C38,315.6 35.6,325.2 33.9,332C32.2,338.8 31.3,341.2 29.3,348C27.3,354.8 24.1,364.4 23.9,366C23.7,367.6 24.5,374 26.2,375C27.9,376 38.5,376.3 40.8,376C43.1,375.7 54.5,370.5 55.5,371C56.5,371.5 54.7,379.4 53.9,382C53.1,384.6 44.7,402.2 45.4,403C46.1,403.8 65.4,397.1 68.6,398C71.8,398.9 77.3,405.8 77.8,412C78.3,418.2 72.9,434.4 72.4,450C71.9,465.6 76,475 75.5,490C75,505 71.6,518.6 70.1,525C68.6,531.4 62.5,542.5 63.2,543C63.9,543.5 77.2,538.4 87.8,537C98.4,535.6 104.5,534.2 116.4,536C128.3,537.8 136.7,546.8 147.2,546C157.7,545.2 161.4,536 168.8,532C176.2,528 183.7,527.9 184.2,526C184.7,524.1 179.4,502.2 181.9,485C184.4,467.8 192,456 196.6,440C201.2,424 205.2,412.2 205,405C204.8,397.8 193.9,386 195,380C196.1,374 211.7,361.4 214.3,355C216.9,348.6 219.6,334 216.6,327C213.6,320 195.2,304 189.6,297C184,290 173.1,282.6 176.5,277C179.9,271.4 211.2,258 218.1,250C225,242 223.1,235 225.9,220C228.7,205 232.4,185.5 232,175C231.6,164.5 219,150.6 222.8,145C226.6,139.4 251.5,139.2 259,135C266.5,130.8 276.7,117.9 276.7,115C276.7,112.1 264.4,96 259,87C253.6,78 245.9,53.4 238.2,51C230.5,48.6 183.9,59.4 162.6,57C141.3,54.6 137.6,39.6 131.8,39C126,38.4 114.4,47.8 104.8,51C95.2,54.2 90.5,53.6 84,55C77.5,56.4 73.3,55.4 72.4,58Z";

/** De onde sai a carrinha. Fica sobre a península de Peniche. */
const ORIGEM = { x: 34.6, y: 309 };

/** Onde os rótulos encostam. Cai sobre o interior, que é o espaço vazio. */
const RÓTULO_X = 118;

type Geometria = {
  /** Centro do disco da zona. */
  x: number;
  y: number;
  /** Raio do disco. Grosso modo a área que a zona cobre. */
  r: number;
  /** Altura a que o rótulo assenta na coluna da direita. */
  ry: number;
};

/* Indexado pelo nome que vem do ZONES. Nomes escritos aqui só como chave:
   o texto que o utilizador lê vem sempre do conteúdo. */
const GEOMETRIA: Record<string, Geometria> = {
  "Grande Lisboa": { x: 50, y: 369, r: 13, ry: 372 },
  "Margem Sul": { x: 64, y: 390, r: 14, ry: 410 },
  Oeste: { x: 56, y: 315, r: 18, ry: 296 },
  Leiria: { x: 74, y: 267, r: 17, ry: 258 },
  Santarém: { x: 86, y: 320, r: 17, ry: 334 },
};

/** Rota de Peniche até à zona, com um arco para as linhas não se colarem. */
function rota(g: Geometria) {
  const dx = g.x - ORIGEM.x;
  const dy = g.y - ORIGEM.y;
  const comprimento = Math.hypot(dx, dy) || 1;
  const cx = (ORIGEM.x + g.x) / 2 - (dy / comprimento) * comprimento * 0.2;
  const cy = (ORIGEM.y + g.y) / 2 + (dx / comprimento) * comprimento * 0.2;
  return `M${ORIGEM.x},${ORIGEM.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${g.x},${g.y}`;
}

/* Compasso da entrada, em segundos. */
const T_CONTORNO = 1.2;
const T_MANCHA = 0.8;
const T_ORIGEM = 1.1;
const T_ROTAS = 1.35;
const T_ZONAS = 1.5;
const PASSO = 0.14;

type Props = {
  /** `false` na landing: lá o mapa é ilustração e quem leva a informação a
      sério é a página das entregas, para onde o botão aponta. */
  lista?: boolean;
  /** Chamado sempre que a zona escolhida muda. Serve para ligar o CTA. */
  onSelect?: (zona: string) => void;
  className?: string;
};

export default function MapaEntregas({
  onSelect,
  className,
  lista = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const raiz = useRef<HTMLDivElement>(null);
  const noEcrã = useInView(raiz, { once: true, amount: 0.2 });
  const parado = useReducedMotion();

  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);

  /* Sem movimento a entrada não espera pela viewport: já está tudo lá. */
  const entra = parado || noEcrã;
  /** Encolhe qualquer duração a zero quando o sistema pede menos movimento. */
  const d = (segundos: number) => (parado ? 0 : segundos);

  const activa = sobre ?? escolhida;
  const detalhe = ZONES.find((z) => z.name === activa) ?? null;

  function escolher(nome: string) {
    setEscolhida(nome);
    onSelect?.(nome);
  }

  return (
    <div
      ref={raiz}
      className={[
        "grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-10",
        className ?? "",
      ]
        .join(" ")
        .trim()}
    >
      {/* Tecto de largura também no desktop: sem ele o mapa esticava com a
          coluna e os nomes das zonas, que vivem dentro do SVG, cresciam com
          ele até ficarem maiores do que o título da secção. */}
      <div className="mx-auto w-full max-w-[22rem] md:max-w-[25rem]">
        <svg
          viewBox="-56 22 356 540"
          className="block h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Os discos das zonas param na fronteira, senão sangravam para
                o mar e para Espanha e deixavam de ler como território. */}
            <clipPath id={`${uid}-terra`}>
              <path d={PORTUGAL} />
            </clipPath>
          </defs>

          {/* Mancha de terra. Entra depois do traço, para o contorno se ver
              a desenhar sobre o papel e não sobre a mancha já feita. */}
          <motion.path
            d={PORTUGAL}
            fill="var(--color-accent-soft)"
            initial={{ opacity: 0 }}
            animate={entra ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: d(0.6), delay: d(T_MANCHA) }}
          />

          {/* Duas camadas de propósito: o grupo faz a entrada escalonada e o
              disco lá dentro faz o realce. Se fosse tudo na mesma animação,
              o atraso da entrada colava-se ao hover e a zona só acendia um
              segundo e meio depois de lá chegar o rato. */}
          <g clipPath={`url(#${uid}-terra)`}>
            {ZONES.map((zona, i) => {
              const g = GEOMETRIA[zona.name];
              if (!g) return null;
              const viva = activa === zona.name;
              return (
                <motion.g
                  key={zona.name}
                  initial={{ opacity: 0 }}
                  animate={entra ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: d(0.45), delay: d(T_ZONAS + i * PASSO) }}
                >
                  <circle
                    cx={g.x}
                    cy={g.y}
                    r={g.r}
                    fill="var(--color-accent)"
                    fillOpacity={viva ? 0.55 : 0.24}
                    style={{ transition: "fill-opacity 0.2s" }}
                  />
                </motion.g>
              );
            })}
          </g>

          {/* Contorno. É este traço que se desenha. */}
          <motion.path
            d={PORTUGAL}
            fill="none"
            stroke="var(--color-accent-deep)"
            strokeWidth={1.4}
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={entra ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: d(T_CONTORNO), ease: "easeInOut" }}
          />

          {/* Rotas de Peniche para cada zona. */}
          {ZONES.map((zona, i) => {
            const g = GEOMETRIA[zona.name];
            if (!g) return null;
            const viva = activa === zona.name;
            return (
              /* O realce fica em atributos com transição de CSS e fora do
                 `animate`, pela mesma razão dos discos: o `pathLength` traz
                 o atraso da entrada e não o quero em cima do hover. Nada de
                 `strokeDasharray` à mão, que o `pathLength` toma conta do
                 tracejado enquanto desenha. */
              <motion.path
                key={zona.name}
                d={rota(g)}
                fill="none"
                stroke="var(--color-accent-deep)"
                strokeWidth={viva ? 1.8 : 1}
                strokeOpacity={viva ? 0.9 : 0.35}
                strokeLinecap="round"
                style={{ transition: "stroke-width 0.2s, stroke-opacity 0.2s" }}
                /* A ROTA ANDA EM CICLO enquanto o mapa está à vista: a
                   linha nasce em Peniche, corre até à zona, apaga-se e
                   volta a nascer. É o que dá a ideia de a carrinha estar
                   sempre a sair de lá para todo o lado.

                   `pathLength` de 0 a 1 e outra vez a 0, com `times` a
                   segurar a linha desenhada durante metade do ciclo, e um
                   `repeatDelay` escalonado por zona para as cinco não
                   piscarem todas ao mesmo tempo. */
                initial={{ pathLength: 0 }}
                animate={
                  entra
                    ? { pathLength: [0, 1, 1, 0] }
                    : { pathLength: 0 }
                }
                transition={
                  parado
                    ? { duration: 0 }
                    : {
                        duration: 3.4,
                        times: [0, 0.32, 0.72, 1],
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        delay: d(T_ROTAS + i * PASSO),
                      }
                }
              />
            );
          })}

          {/* Zonas: disco pequeno, linha de chamada e nome. */}
          {ZONES.map((zona, i) => {
            const g = GEOMETRIA[zona.name];
            if (!g) return null;
            const viva = activa === zona.name;
            return (
              <motion.g
                key={zona.name}
                className="cursor-pointer"
                initial={{ opacity: 0 }}
                animate={entra ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: d(0.4), delay: d(T_ZONAS + i * PASSO) }}
                onClick={() => escolher(zona.name)}
                onPointerEnter={() => setSobre(zona.name)}
                onPointerLeave={() => setSobre(null)}
              >
                <line
                  x1={g.x}
                  y1={g.y}
                  x2={RÓTULO_X - 5}
                  y2={g.ry}
                  stroke="var(--color-accent-deep)"
                  strokeWidth={0.8}
                  opacity={viva ? 0.8 : 0.35}
                />
                <circle
                  cx={g.x}
                  cy={g.y}
                  r={viva ? 5.5 : 4}
                  fill="var(--color-accent-deep)"
                />
                <circle
                  cx={g.x}
                  cy={g.y}
                  r={viva ? 5.5 : 4}
                  fill="none"
                  stroke="var(--color-paper)"
                  strokeWidth={1.4}
                />
                <text
                  x={RÓTULO_X}
                  y={g.ry}
                  fontSize={12.5}
                  fontWeight={viva ? 700 : 600}
                  dominantBaseline="middle"
                  fill={
                    viva ? "var(--color-accent-deep)" : "var(--color-ink-2)"
                  }
                  /* Halo de papel: o nome assenta sobre a mancha da terra e
                     sem isto perdia contraste em cima dos discos. */
                  stroke="var(--color-paper)"
                  strokeWidth={3.5}
                  paintOrder="stroke"
                  strokeLinejoin="round"
                >
                  {zona.name}
                </text>
                {/* Alvos invisíveis, um no ponto e outro no nome. Uma caixa
                    única a envolver os dois tapava os vizinhos: as zonas
                    ficam a trinta unidades umas das outras e o grupo pintado
                    por último roubava o rato ao anterior. */}
                <circle cx={g.x} cy={g.y} r={13} fill="transparent" />
                <rect
                  x={RÓTULO_X - 7}
                  y={g.ry - 11}
                  width={zona.name.length * 7 + 14}
                  height={22}
                  fill="transparent"
                />
              </motion.g>
            );
          })}

          {/* Peniche. Losango e não círculo: à vista desarmada tem de se
              distinguir das zonas sem precisar de outra cor. */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={entra ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: d(0.4),
              delay: entra && !parado ? d(T_ORIGEM) : 0,
            }}
          >
            <circle
              cx={ORIGEM.x}
              cy={ORIGEM.y}
              r={11}
              fill="var(--color-accent)"
              opacity={0.28}
            />
            <rect
              x={ORIGEM.x - 4.6}
              y={ORIGEM.y - 4.6}
              width={9.2}
              height={9.2}
              transform={`rotate(45 ${ORIGEM.x} ${ORIGEM.y})`}
              fill="var(--color-paper)"
              stroke="var(--color-accent-deep)"
              strokeWidth={2}
            />
            {/* Três linhas curtas e não uma: à esquerda de Peniche só há a
                largura do mar antes de a caixa acabar. */}
            <text
              x={ORIGEM.x - 13}
              y={ORIGEM.y - 20}
              fontSize={11.5}
              fontWeight={700}
              textAnchor="end"
              fill="var(--color-accent-deep)"
              stroke="var(--color-paper)"
              strokeWidth={3.5}
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              Peniche
            </text>
            <text
              x={ORIGEM.x - 13}
              y={ORIGEM.y - 7}
              fontSize={9.5}
              textAnchor="end"
              fill="var(--color-ink-3)"
              stroke="var(--color-paper)"
              strokeWidth={3}
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              a carrinha
            </text>
            <text
              x={ORIGEM.x - 13}
              y={ORIGEM.y + 4}
              fontSize={9.5}
              textAnchor="end"
              fill="var(--color-ink-3)"
              stroke="var(--color-paper)"
              strokeWidth={3}
              paintOrder="stroke"
              strokeLinejoin="round"
            >
              sai daqui
            </text>
          </motion.g>
        </svg>
      </div>

      <div>
        {/* Os botões são o mapa acessível: um percurso de teclado, alvos de
            dedo com folga, e o mesmo estado que o desenho. Sem eles o mapa
            fica sem percurso de teclado, e é por isso que o painel de
            detalhe também sai: na landing o mapa passa a ilustração e a
            informação vive toda em /entregas. */}
        {lista && (
        <ul className="zonas">
          {ZONES.map((zona, i) => {
            const viva = activa === zona.name;
            return (
              <li key={zona.name} style={{ "--i": i } as React.CSSProperties}>
                <button
                  type="button"
                  className="zonas__nome"
                  data-viva={viva}
                  aria-pressed={escolhida === zona.name}
                  onClick={() => escolher(zona.name)}
                  onPointerEnter={() => setSobre(zona.name)}
                  onPointerLeave={() => setSobre(null)}
                  onFocus={() => setSobre(zona.name)}
                  onBlur={() => setSobre(null)}
                >
                  {zona.name}
                </button>
              </li>
            );
          })}
        </ul>
        )}

        {lista && (
        <div
          className="panel panel--soft mt-4 min-h-[9.5rem]"
          aria-live="polite"
        >
          {detalhe ? (
            <>
              <h3 className="display display--md">{detalhe.name}</h3>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-2)]">
                {detalhe.note}
              </p>
            </>
          ) : (
            <>
              <h3 className="display display--md">Cinco zonas</h3>
              <p className="mt-2 text-[0.95rem] text-[var(--color-ink-2)]">
                Escolha a sua zona no mapa ou na lista para ver os concelhos
                que a carrinha faz.
              </p>
            </>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
