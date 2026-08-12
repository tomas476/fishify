import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Números à portuguesa: 22 155 */
export function num(value: number) {
  return new Intl.NumberFormat("pt-PT").format(value);
}
