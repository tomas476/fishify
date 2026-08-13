import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Sem isto, o servidor de desenvolvimento do Next RECUSA servir os
     recursos `/_next` a quem entre por outra origem que não `localhost`, e
     um telemóvel na mesma rede entra sempre pelo IP. O resultado era o
     telemóvel receber o HTML e ZERO JavaScript: sem vídeo a tocar, sem o
     peixe a separar-se, sem os passos, sem o mapa e com o botão do menu
     morto, enquanto no computador estava tudo bem.

     O aviso está no log do servidor:
       "Blocked cross-origin request to Next.js dev resource
        /_next/webpack-hmr from 192.168.1.228"

     Só afecta desenvolvimento. Em produção não existe. */
  allowedDevOrigins: ["127.0.0.1", "192.168.1.228", "192.168.1.*", "*.local"],

  /* O site é inteiramente estático (todas as rotas saem prerenderizadas),
     por isso exporta-se para HTML e serve-se com o Caddy, como já se faz
     com o site do Tomás Marques na mesma VPS. Sem processo Node a correr,
     sem container com runtime, e o deploy passa a ser copiar uma pasta. */
  output: "export",

  /* O optimizador de imagens do Next precisa de servidor. Com `export` não
     há servidor nenhum, e as imagens deste site já vão para o disco no
     tamanho exacto em que são mostradas. */
  images: { unoptimized: true },

  /* Uma pagina de projecto do GitHub Pages vive numa subpasta com o nome do
     repositorio (tomas476.github.io/fishify). Na VPS o site serve-se na
     raiz, por isso o prefixo vem de fora e por omissao e vazio. Tem de ser
     o MESMO valor que o `src/lib/asset.ts` le, senao metade dos ficheiros
     procura-se no sitio errado. */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default nextConfig;
