"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Atraso entre irmãos do mesmo bloco, em milissegundos. */
const STEP = 80;
/** Teto do stagger. A partir daqui o bloco inteiro entrava tarde demais. */
const MAX_STEP_INDEX = 5;

/**
 * Observador global da classe `.reveal` (definida em globals.css).
 *
 * Não renderiza nada: percorre o documento, calcula o atraso de cada elemento
 * pela sua posição entre os irmãos `.reveal` do mesmo pai, e marca `is-in`
 * quando entra na viewport. Um `MutationObserver` apanha os elementos que
 * aparecem depois (secções montadas no cliente) e o `usePathname` força uma
 * nova varredura a cada mudança de rota.
 */
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((el) => el.classList.add("is-in"));
    };

    if (reduced.matches) {
      // sem animação: tudo visível de imediato, incluindo o que montar depois
      revealAll();
      const mutations = new MutationObserver(revealAll);
      mutations.observe(document.body, { childList: true, subtree: true });
      return () => mutations.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          observer.unobserve(el);
        }
      },
      /* `threshold: 0` e mais nada. Um rootMargin negativo já partiu o fim de
         uma página noutro projecto: as últimas secções nunca chegavam a
         cruzar a caixa encolhida e ficavam em `opacity: 0` para sempre. */
      { threshold: 0 }
    );

    const scan = () => {
      const fresh = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal")
      ).filter((el) => !el.dataset.revealBound && !el.classList.contains("is-in"));

      if (fresh.length === 0) return;

      // agrupa por pai para o stagger contar dentro do mesmo bloco
      const seen = new Map<Element, number>();
      for (const el of fresh) {
        el.dataset.revealBound = "1";
        const parent = el.parentElement ?? document.body;
        const index = seen.get(parent) ?? 0;
        seen.set(parent, index + 1);
        el.style.transitionDelay = `${Math.min(index, MAX_STEP_INDEX) * STEP}ms`;
        observer.observe(el);
      }
    };

    scan();

    let queued = false;
    const mutations = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      // elementos que sobrevivem à mudança de rota sem terem chegado a entrar
      // têm de poder ser re-observados pelo próximo efeito
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
        .forEach((el) => delete el.dataset.revealBound);
    };
  }, [pathname]);

  return null;
}
