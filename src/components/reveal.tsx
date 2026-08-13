"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* =========================================================================
   O OBSERVADOR DAS ENTRADAS

   Não renderiza nada. Percorre o documento e marca os elementos quando
   entram no ecrã. Serve dois vocabulários:

   • `.reveal`            → ganha `.is-in`  (o simples: sobe e acende)
   • `[data-reveal="…"]`  → ganha `.dentro` (os dialectos do site da
                             Imogrow: destaque, palavras, cascata)

   O `data-reveal="palavras"` precisa de preparação: o texto é partido em
   `<span class="pl">` por palavra, cada um com o seu índice, e é o índice
   que o CSS usa para escalonar. Feito aqui e não no servidor porque o
   estado escondido só pode existir se o JS estiver vivo.

   AS ENTRADAS ANDAM PARA TRÁS. Quando um elemento sai do ecrã a marca é
   retirada, e por isso ao subir a página as animações desfazem-se pela
   mesma ordem por que se fizeram. Foi um pedido explícito depois da
   primeira versão, que só animava à descida e nunca mais repetia.

   Isto obriga a NÃO deixar de observar depois da primeira entrada, e é a
   diferença que faz um `.reveal` custar um pouco mais: cada elemento fica
   observado durante a vida da página.

   `threshold: 0` e mais nada. Um rootMargin negativo já partiu o fim de
   uma página noutro projecto: as últimas secções nunca chegavam a cruzar
   a caixa encolhida e ficavam invisíveis para sempre.
   ========================================================================= */

/** Atraso entre irmãos do mesmo bloco, em milissegundos. */
const STEP = 80;
/** Teto do stagger. A partir daqui o bloco inteiro entrava tarde demais. */
const MAX_STEP_INDEX = 5;

/** Parte o texto em palavras, sem lhe tocar se já tiver sido partido. */
function partirEmPalavras(el: HTMLElement) {
  if (el.dataset.plFeito) return;
  el.dataset.plFeito = "1";

  const texto = el.textContent ?? "";
  const palavras = texto.split(/(\s+)/);
  el.textContent = "";

  let i = 0;
  for (const parte of palavras) {
    if (parte.trim() === "") {
      el.appendChild(document.createTextNode(parte));
      continue;
    }
    const span = document.createElement("span");
    span.className = "pl";
    span.style.setProperty("--pl-i", String(i));
    span.textContent = parte;
    el.appendChild(span);
    i++;
  }
}

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.add("js-reveal");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const mostrarTudo = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.dentro)")
        .forEach((el) => el.classList.add("dentro"));
    };

    if (reduced.matches) {
      mostrarTudo();
      const mutations = new MutationObserver(mostrarTudo);
      mutations.observe(document.body, { childList: true, subtree: true });
      return () => mutations.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const marca = el.dataset.reveal !== undefined ? "dentro" : "is-in";
          el.classList.toggle(marca, entry.isIntersecting);
        }
      },
      { threshold: 0 }
    );

    const varrer = () => {
      const frescos = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal, [data-reveal]")
      ).filter((el) => !el.dataset.revealBound);

      if (frescos.length === 0) return;

      // agrupa por pai para o stagger contar dentro do mesmo bloco
      const vistos = new Map<Element, number>();
      for (const el of frescos) {
        el.dataset.revealBound = "1";
        if (el.dataset.reveal === "palavras") partirEmPalavras(el);
        if (el.dataset.reveal === undefined) {
          const pai = el.parentElement ?? document.body;
          const index = vistos.get(pai) ?? 0;
          vistos.set(pai, index + 1);
          el.style.transitionDelay = `${Math.min(index, MAX_STEP_INDEX) * STEP}ms`;
        }
        observer.observe(el);
      }
    };

    varrer();

    let agendado = false;
    const mutations = new MutationObserver(() => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(() => {
        agendado = false;
        varrer();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      // elementos que sobrevivem à mudança de rota sem terem chegado a entrar
      // têm de poder ser re-observados pelo próximo efeito
      document
        .querySelectorAll<HTMLElement>(".reveal, [data-reveal]")
        .forEach((el) => delete el.dataset.revealBound);
    };
  }, [pathname]);

  return null;
}
