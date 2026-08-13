---
name: capturas-shot-js
description: Como capturar o site renderizado neste projeto (shot.js no scratchpad) e as duas armadilhas que fazem a captura sair errada
metadata:
  type: reference
---

As capturas reais fazem-se com o `shot.js` que vive na pasta de scratchpad da sessão:
`node shot.js <url> <saida.png> <largura> <altura> <scroll>`. Usa CDP com tempo real, ao
contrário do `--screenshot` do headless, que virtualiza o tempo e devolve tudo em branco
porque o IntersectionObserver nunca dispara.

Duas armadilhas já apanhadas:

1. **Perfil de Chrome partilhado.** O `shot.js` não passa `--user-data-dir`, por isso um
   segundo Chrome headless liga-se à instância que já existe e o `/json/list` devolve um
   separador antigo. Resultado: a captura sai com a página anterior (tipicamente a home,
   `scrollHeight` ~5600) em vez do URL pedido. Sinal de alarme: a altura da página não bate
   certo com a página que se pediu. Solução: copiar o script para `shot2.js` com
   `--user-data-dir=/tmp/shotprof-${process.pid}` e uma porta diferente, e correr uma
   captura de cada vez.

2. **Páginas de teste com `_` à frente.** No App Router do Next, uma pasta `_algo` é
   privada e não gera rota: `src/app/_teste-x/page.tsx` dá 404. A página temporária tem de
   se chamar `src/app/teste-x/`.

**Como aplicar:** sempre que for preciso julgar visualmente um componente, montar página de
teste com pouco conteúdo acima, capturar a 390 px e a 1440 px, confirmar a altura devolvida
pelo script, e apagar a página no fim.
