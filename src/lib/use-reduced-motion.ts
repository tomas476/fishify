"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Lê `prefers-reduced-motion` sem passar por `useState` dentro de um efeito.
 *
 * No servidor devolve `false`: o HTML sai igual para toda a gente e é o
 * cliente que decide. Assumir `true` no servidor daria um salto de layout a
 * toda a gente que NÃO tem a preferência ligada, que é a maioria.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
