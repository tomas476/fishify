/* =========================================================================
   CAMINHOS DE FICHEIROS QUANDO O SITE NÃO VIVE NA RAIZ

   Na VPS o site serve-se em `/`. No GitHub Pages serve-se em `/fishify`,
   porque uma página de projecto vive sempre numa subpasta com o nome do
   repositório.

   O Next resolve isso sozinho para o `next/link` e para os ficheiros do
   proprio pacote. NAO resolve para o `next/image` quando as imagens vao
   sem optimizador (`images.unoptimized`, obrigatorio num export estatico):
   nesse modo o carregador devolve o `src` tal e qual, sem prefixo. Foi
   apanhado a olhar para o HTML gerado, onde tres imagens saiam com
   `/img/...` enquanto tudo o resto ja tinha `/fishify/img/...`.

   Tambem nao resolve para caminhos escritos a mao:
   o `src` de um `<video>`, o `src` de um `<img>` que troca por
   JavaScript, ou um `url(...)` dentro de uma máscara CSS.

   Tudo isso passa por aqui.

   A variável é lida no momento do build (é `NEXT_PUBLIC_`, portanto entra
   no pacote do cliente) e tem de ser a mesma que está no `basePath` do
   `next.config.ts`.
   ========================================================================= */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** `asset("/video/hero.mp4")` → `/fishify/video/hero.mp4` quando há prefixo. */
export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
