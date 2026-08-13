"use client";

import { useRef, useState } from "react";
import { BRAND, ZONES } from "@/content/site";
import { cn } from "@/lib/utils";

/* =========================================================================
   O PEDIDO DE ENCOMENDA

   Mesmo molde do formulário de avaliação do site do Tomás Marques: campos
   validados no cliente, erros por campo, foco no primeiro que falha, e o
   envio abre uma conversa de WhatsApp já escrita. NÃO HÁ BACKEND, e é de
   propósito: é assim que eles já trabalham, e um formulário que promete
   guardar o pedido e não guarda é pior do que não existir.

   A mensagem sai em linhas separadas por `%0A`, que é o que o `wa.me`
   entende. Campos vazios não entram na mensagem.
   ========================================================================= */

type Campo = "nome" | "zona" | "pessoas" | "preferencias" | "telefone";

const VAZIO: Record<Campo, string> = {
  nome: "",
  zona: "",
  pessoas: "",
  preferencias: "",
  telefone: "",
};

/** Ordem de leitura, que é a ordem em que se salta para o primeiro erro. */
const ORDEM: Campo[] = ["nome", "telefone", "zona", "pessoas", "preferencias"];

function validar(v: Record<Campo, string>) {
  const erros: Partial<Record<Campo, string>> = {};

  if (v.nome.trim().length < 2) erros.nome = "Diga-nos como se chama.";

  const digitos = v.telefone.replace(/\D/g, "");
  if (!v.telefone.trim()) {
    erros.telefone = "Precisamos de um contacto para responder.";
  } else if (digitos.length < 9) {
    /* Nove dígitos é o número português mais curto. Não se valida o
       prefixo: há clientes com número estrangeiro. */
    erros.telefone = "Faltam dígitos neste número.";
  }

  if (!v.zona) erros.zona = "Escolha a zona onde quer receber.";

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
  if (v.pessoas.trim()) linhas.push(`Para quantas pessoas: ${v.pessoas.trim()}`);
  if (v.preferencias.trim()) {
    linhas.push("", `O que procuro: ${v.preferencias.trim()}`);
  }
  return linhas.join("\n");
}

export default function EncomendaForm() {
  const [valores, setValores] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const refs = useRef<Partial<Record<Campo, HTMLElement | null>>>({});

  const escrever = (campo: Campo) => (valor: string) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    /* O erro sai assim que o campo é corrigido, não só ao submeter: um
       erro que fica preso depois de já estar certo lê-se como o
       formulário estar avariado. */
    setErros((e) => (e[campo] ? { ...e, [campo]: undefined } : e));
  };

  const submeter = (evento: React.FormEvent) => {
    evento.preventDefault();
    const encontrados = validar(valores);
    setErros(encontrados);

    const primeiro = ORDEM.find((c) => encontrados[c]);
    if (primeiro) {
      refs.current[primeiro]?.focus();
      return;
    }

    const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
      mensagem(valores)
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const campo = (nome: Campo) => ({
    id: nome,
    value: valores[nome],
    "aria-invalid": erros[nome] ? true : undefined,
    "aria-describedby": erros[nome] ? `${nome}-erro` : undefined,
    className: cn("campo", erros[nome] && "campo--erro"),
  });

  return (
    <form className="formulario" onSubmit={submeter} noValidate>
      <div className="formulario__grelha">
        <p className="formulario__campo">
          <label className="formulario__rotulo" htmlFor="nome">
            Como se chama
          </label>
          <input
            {...campo("nome")}
            ref={(el) => {
              refs.current.nome = el;
            }}
            type="text"
            autoComplete="name"
            placeholder="Nome e apelido"
            onChange={(e) => escrever("nome")(e.target.value)}
          />
          {erros.nome && (
            <span className="formulario__erro" id="nome-erro">
              {erros.nome}
            </span>
          )}
        </p>

        <p className="formulario__campo">
          <label className="formulario__rotulo" htmlFor="telefone">
            Telemóvel
          </label>
          <input
            {...campo("telefone")}
            ref={(el) => {
              refs.current.telefone = el;
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="912 345 678"
            onChange={(e) => escrever("telefone")(e.target.value)}
          />
          {erros.telefone && (
            <span className="formulario__erro" id="telefone-erro">
              {erros.telefone}
            </span>
          )}
        </p>

        <p className="formulario__campo">
          <label className="formulario__rotulo" htmlFor="zona">
            Onde quer receber
          </label>
          <select
            {...campo("zona")}
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
          {erros.zona && (
            <span className="formulario__erro" id="zona-erro">
              {erros.zona}
            </span>
          )}
        </p>

        <p className="formulario__campo">
          <label className="formulario__rotulo" htmlFor="pessoas">
            Para quantas pessoas <span className="muted">(opcional)</span>
          </label>
          <input
            {...campo("pessoas")}
            ref={(el) => {
              refs.current.pessoas = el;
            }}
            type="text"
            inputMode="numeric"
            placeholder="4"
            onChange={(e) => escrever("pessoas")(e.target.value)}
          />
        </p>
      </div>

      <p className="formulario__campo">
        <label className="formulario__rotulo" htmlFor="preferencias">
          O que procura <span className="muted">(opcional)</span>
        </label>
        <textarea
          {...campo("preferencias")}
          ref={(el) => {
            refs.current.preferencias = el;
          }}
          rows={4}
          placeholder="Peixe para grelhar, já amanhado. Se houver sardinha, quero."
          onChange={(e) => escrever("preferencias")(e.target.value)}
        />
      </p>

      <button type="submit" className="btn btn--solid btn--block sm:w-auto">
        Enviar pelo WhatsApp
      </button>

      <p className="muted mt-4 text-[0.9rem]">
        O botão abre o WhatsApp com o pedido já escrito. Nada fica guardado
        neste site: a conversa é directamente connosco.
      </p>
    </form>
  );
}
