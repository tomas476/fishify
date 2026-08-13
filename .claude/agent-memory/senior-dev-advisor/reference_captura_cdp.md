---
name: captura-cdp-porta-partilhada
description: O shot.js do scratchpad fixa a porta de debug do Chrome, e com agentes em paralelo a captura sai da página errada
metadata:
  type: reference
---

O `shot.js` do scratchpad abre o Chrome com `--remote-debugging-port` fixo (9333)
e liga-se ao primeiro alvo de `/json/list`. Com mais do que um agente a capturar
ao mesmo tempo, o segundo agarra a janela do primeiro e grava a página errada,
sem erro nenhum: a imagem sai bonita e é de outra rota.

**Why:** aconteceu neste projeto, uma captura a 1440 devolveu a página de teste
de outro agente e por momentos pareceu bug no componente.

**How to apply:** antes de capturar, copiar o `shot.js` para uma variante com
porta própria (`sed 's/const PORT = 9333;/const PORT = 94xx;/'`) e usar essa.
Confirmar sempre que a imagem mostra a rota pedida antes de tirar conclusões.
