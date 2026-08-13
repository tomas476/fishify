"use client";

import { useRef, useState } from "react";
import { BRAND, ZONES } from "@/content/site";
import { cn } from "@/lib/utils";

/* =========================================================================
   O PEDIDO DE ENCOMENDA, NO MOLDE DO FORMULÁRIO DO TOMÁS MARQUES

   Copiado do que está no ar em tomasmarques.imogrow.pt/vender, e não da
   cópia local do repositório, que já estava desactualizada:

   • TRÊS PASSOS, não um formulário comprido. Uma parede de campos numa
     página faz desistir; três perguntas de cada vez não.
   • Barra de progresso com um segmento por passo, e um contador "1 / 3".
   • Campos com LINHA por baixo, não caixas: fundo transparente, sem
     padding lateral, e a etiqueta em cima.
   • Validação por passo. Não se avança com o passo errado, e o foco salta
     para o primeiro campo que falha.

   O envio abre o WhatsApp com o pedido escrito. Não há backend, e é de
   propósito: é assim que eles já trabalham.
   ========================================================================= */

type Campo = "nome" | "telefone" | "zona" | "quantidade" | "procura";

const VAZIO: Record<Campo, string> = {
  nome: "",
  telefone: "",
  zona: "",
  quantidade: "",
  procura: "",
};

type Passo = {
  legenda: string;
  campos: Campo[];
};

const PASSOS: Passo[] = [
  { legenda: "Com quem falo", campos: ["nome", "telefone"] },
  { legenda: "Onde entregamos", campos: ["zona", "quantidade"] },
  { legenda: "O que procura", campos: ["procura"] },
];

function validar(campos: Campo[], v: Record<Campo, string>) {
  const erros: Partial<Record<Campo, string>> = {};

  if (campos.includes("nome") && v.nome.trim().length < 2) {
    erros.nome = "Diga-nos como se chama.";
  }

  if (campos.includes("telefone")) {
    const digitos = v.telefone.replace(/\D/g, "");
    if (!v.telefone.trim()) {
      erros.telefone = "Precisamos de um contacto para responder.";
    } else if (digitos.length < 9) {
      /* Nove dígitos é o número português mais curto. Não se valida o
         prefixo: há clientes com número estrangeiro. */
      erros.telefone = "Faltam dígitos neste número.";
    }
  }

  if (campos.includes("zona") && !v.zona) {
    erros.zona = "Escolha a zona onde quer receber.";
  }

  return erros;
}

function mensagem(v: Record<Campo, string>) {
  const linhas = [
    "Olá! Queria fazer uma encomenda.",
    "",
    `Nome: ${v.nome.trim()}`,
    `Contacto: ${v.telefone.trim()}`,
    `Zona: ${v.zona}`,
  ];
  if (v.quantidade.trim()) linhas.push(`Quantidade: ${v.quantidade.trim()}`);
  if (v.procura.trim()) linhas.push("", `O que procuro: ${v.procura.trim()}`);
  return linhas.join("\n");
}

export default function EncomendaForm() {
  const [passo, setPasso] = useState(0);
  const [valores, setValores] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const refs = useRef<Partial<Record<Campo, HTMLElement | null>>>({});

  const atual = PASSOS[passo];
  const ultimo = passo === PASSOS.length - 1;

  const escrever = (campo: Campo) => (valor: string) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    /* O erro sai assim que o campo é corrigido: um erro preso depois de
       já estar certo lê-se como o formulário estar avariado. */
    setErros((e) => (e[campo] ? { ...e, [campo]: undefined } : e));
  };

  const avancar = () => {
    const encontrados = validar(atual.campos, valores);
    setErros(encontrados);

    const primeiro = atual.campos.find((c) => encontrados[c]);
    if (primeiro) {
      refs.current[primeiro]?.focus();
      return;
    }

    if (!ultimo) {
      setPasso((p) => p + 1);
      return;
    }

    const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
      mensagem(valores)
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const comum = (nome: Campo) => ({
    id: `enc-${nome}`,
    value: valores[nome],
    "aria-invalid": erros[nome] ? true : undefined,
    "aria-describedby": erros[nome] ? `enc-${nome}-erro` : undefined,
    className: cn("linha", erros[nome] && "linha--erro"),
  });

  /* Uma função e não um componente: declarar componentes dentro do render
     faz-lhes perder o estado a cada renderização, e o ESLint deste projecto
     recusa por isso. */
  const erro = (campo: Campo) =>
    erros[campo] ? (
      <span className="formulario__erro" id={`enc-${campo}-erro`}>
        {erros[campo]}
      </span>
    ) : null;

  return (
    <form
      className="formulario"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        avancar();
      }}
    >
      <div className="passos-barra" aria-hidden="true">
        {PASSOS.map((p, i) => (
          <span key={p.legenda} className="passos-barra__s" data-feito={i <= passo} />
        ))}
      </div>
      <p className="passos-conta" role="status">
        {passo + 1} / {PASSOS.length}
      </p>

      <fieldset className="passo-campos">
        <legend className="passo-legenda">{atual.legenda}</legend>

        {passo === 0 && (
          <div className="passo-grelha">
            <p className="formulario__campo">
              <label className="formulario__rotulo" htmlFor="enc-nome">
                Como se chama
              </label>
              <input
                {...comum("nome")}
                ref={(el) => {
                  refs.current.nome = el;
                }}
                type="text"
                autoComplete="name"
                placeholder="Nome e apelido"
                onChange={(e) => escrever("nome")(e.target.value)}
              />
              {erro("nome")}
            </p>

            <p className="formulario__campo">
              <label className="formulario__rotulo" htmlFor="enc-telefone">
                Telemóvel
              </label>
              <input
                {...comum("telefone")}
                ref={(el) => {
                  refs.current.telefone = el;
                }}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="912 345 678"
                onChange={(e) => escrever("telefone")(e.target.value)}
              />
              {erro("telefone")}
            </p>
          </div>
        )}

        {passo === 1 && (
          <div className="passo-grelha">
            <p className="formulario__campo">
              <label className="formulario__rotulo" htmlFor="enc-zona">
                Onde quer receber
              </label>
              <select
                {...comum("zona")}
                ref={(el) => {
                  refs.current.zona = el;
                }}
                onChange={(e) => escrever("zona")(e.target.value)}
              >
                <option value="">Escolha a sua zona</option>
                {ZONES.map((z) => (
                  <option key={z.name} value={z.name}>
                    {z.name}
                  </option>
                ))}
              </select>
              {erro("zona")}
            </p>

            <p className="formulario__campo">
              <label className="formulario__rotulo" htmlFor="enc-quantidade">
                Que quantidade <span className="muted">(opcional)</span>
              </label>
              {/* Campo de TEXTO e não numérico: o peixe vende-se ao quilo,
                  mas quem encomenda tanto escreve "2 kg" como "para
                  quatro pessoas" ou "uma dourada grande". Forçar um
                  número obrigava a traduzir a cabeça de quem compra para
                  a unidade de quem vende. */}
              <input
                {...comum("quantidade")}
                ref={(el) => {
                  refs.current.quantidade = el;
                }}
                type="text"
                placeholder="2 kg, ou para quatro pessoas"
                onChange={(e) => escrever("quantidade")(e.target.value)}
              />
            </p>
          </div>
        )}

        {passo === 2 && (
          <p className="formulario__campo">
            <label className="formulario__rotulo" htmlFor="enc-procura">
              O que procura <span className="muted">(opcional)</span>
            </label>
            <textarea
              {...comum("procura")}
              ref={(el) => {
                refs.current.procura = el;
              }}
              rows={4}
              placeholder="Peixe para grelhar, já amanhado. Se houver sardinha, quero."
              onChange={(e) => escrever("procura")(e.target.value)}
            />
          </p>
        )}
      </fieldset>

      <div className="passos-nav">
        {passo > 0 && (
          <button
            type="button"
            className="btn"
            onClick={() => setPasso((p) => p - 1)}
          >
            Voltar
          </button>
        )}
        <button type="submit" className="btn btn--solid">
          {ultimo ? "Enviar pelo WhatsApp" : "Continuar"}
        </button>
      </div>

      {ultimo && (
        <p className="muted mt-5 text-[0.9rem]">
          O botão abre o WhatsApp com o pedido já escrito. Nada fica guardado
          neste site: a conversa é directamente connosco.
        </p>
      )}
    </form>
  );
}
