# Fishify, contexto do projeto

Estado em **14 de agosto de 2026**. Este ficheiro é a memória do projeto: o que
é, porque está como está, o que já se pagou caro, e o que falta.

**Ler isto antes de mexer em qualquer coisa.**

---

## 1. O cliente

**Fishify**, peixaria de **Peniche** que entrega peixe fresco em casa. São duas
pessoas: o **Rui** e a **Beatriz**.

| | |
|---|---|
| WhatsApp | **+351 934 243 797** (`351934243797`) |
| Email | geral@fishify.pt |
| Instagram | **@fishify.pt**, 24,2 mil seguidores |
| Domínio anunciado | fishify.pt |
| Horário | 08:00 às 14:00, todos os dias menos **segunda** |
| Zonas | Grande Lisboa, Margem Sul, Oeste, Leiria, Santarém |

Tudo isto saiu de capturas de ecrã do perfil de WhatsApp Business e do perfil de
Instagram. **Não há briefing escrito** além do texto de "quem somos", que eles
escreveram.

O intermediário é o **Tomás** (o dono deste repositório). O cliente final são o
Rui e a Beatriz, e **eles ainda não viram o site**.

---

## 2. Onde vive e como se corre

```bash
~/Desktop/fishify
npm run dev -- --port 3310 --hostname 0.0.0.0   # http://localhost:3310
npm run build          # tem de passar antes de dar algo por feito
npx tsc --noEmit
npx eslint src --max-warnings=0
```

**Stack:** Next.js **16.2.12** (App Router, `src/`, `output: "export"`),
React 19.2, TypeScript, **Tailwind v4**, framer-motion 12, lucide-react 1.x,
@radix-ui/react-accordion.

Repositório: **github.com/tomas476/fishify**, público.
Branch de trabalho: **`experiments/site`**. O `main` está intocado desde o
arranque. O **`gh-pages`** é descartável e refeito a cada publicação.

### Armadilhas desta stack, todas já pagas

1. **Não existe `tailwind.config.js`.** A configuração vive no `@theme inline`
   dentro de `globals.css`.
2. **Next 16 tem breaking changes.** Os docs estão em
   `node_modules/next/dist/docs/01-app/`. **Consultar, não adivinhar.**
3. O ESLint deste projeto **proíbe `setState` síncrono dentro de um efeito** e
   **proíbe declarar componentes dentro do render**. Para media queries usa-se
   `useSyncExternalStore` (`src/lib/use-reduced-motion.ts` é o molde).
4. `React.ElementRef` foi removido no React 19. Usar `React.ComponentProps`; no
   React 19 a `ref` já é uma prop normal e não é preciso `forwardRef`.

---

## 3. As três formas de ver o site

| Onde | Endereço | Para quê |
|---|---|---|
| Local | http://localhost:3310 | desenvolvimento |
| Rede local | http://192.168.1.228:3310 | ver no telemóvel |
| Pré-visualização pública | **https://tomas476.github.io/fishify/** | mostrar a terceiros |
| VPS | container a correr, **à espera do registo A** | destino final |

### O erro que custou uma noite inteira

O telemóvel recebia o HTML e **zero JavaScript**. Sem vídeo, sem peixe, sem
mapa, com o menu morto, e no computador estava tudo bem.

A causa estava escrita no log do servidor:

```
⚠ Blocked cross-origin request to Next.js dev resource
  /_next/webpack-hmr from "192.168.1.228"
```

O servidor de desenvolvimento do Next **recusa servir os recursos `/_next` a
quem entre por outra origem que não `localhost`**, e um telemóvel na rede entra
sempre pelo IP. Resolvido com `allowedDevOrigins` no `next.config.ts`, que já
inclui também o `127.0.0.1` (que também é "outra origem" para o Next, e voltou a
enganar-me uma segunda vez).

**Se alguma coisa parecer não hidratar, é aqui que se olha primeiro.**

---

## 4. Design system

Paleta **clara**, um único acento. `src/app/globals.css`.

| Variável | Valor | O que é |
|---|---|---|
| `--paper` | `#e7f2fb` | água rasa, o fundo de toda a página |
| `--paper-2` / `--paper-3` | `#d8e9f7` / `#c7dff2` | faixas alternadas, superfícies |
| `--deep` | `#0b2035` | fundo do mar: rodapé e chapas de ênfase |
| `--ink` | `#0e1a24` | quase-preto azulado, nunca `#000` |
| `--ink-2` / `--ink-3` | `#3f5361` / `#506674` | texto secundário / legendas |
| `--accent` | **`#4c7fb4`** | azul da marca, para SUPERFÍCIES |
| `--accent-deep` | `#2f5e90` | o azul que serve para TINTA sobre fundo claro |

O azul **não foi escolhido**: foi amostrado com PIL do logótipo no avatar do
Instagram. Sobre o papel, `--accent` dá 3,54:1 e por isso **não serve para texto
pequeno**; `--accent-deep` dá 6,05:1 e é esse que leva tinta.

**Tipografia**, e cada uma tem uma razão que se diz em voz alta:

- display → **Outfit**. É a geometria mais próxima do lettering do próprio
  logótipo.
- corpo → **Instrument Sans**.
- a voz deles → **Newsreader**, a única serifa do site. Existe para uma coisa
  só: o texto do Rui e da Beatriz não sair na mesma letra dos rótulos e dos
  botões.

### Regras não negociáveis

1. **Um só acento.** Azul e mais nada. A única excepção que chegou a existir, um
   ponto verde de "aberto agora", foi mandada abaixo pelo cliente.
2. **Cores sempre por variável.** Um hex à mão num componente é um bug.
3. Zero traços decorativos, e **nada de traço a meio de frase** em texto
   nenhum, código incluído.
4. **Nunca `tel:` num CTA de navegação** (em macOS abre o FaceTime).
5. **Formulários sem backend**: abrem WhatsApp pré-preenchido via `wa.me`.
6. pt-PT. `prefers-reduced-motion` respeitado.
7. **Contraste medido, não adivinhado.**

### As camadas do CSS não são decoração

Tudo em `globals.css` está dentro de `@layer base` ou `@layer components`. CSS
sem camada ganha **sempre** a CSS em camada, por muito baixa que seja a
especificidade. Enquanto o ficheiro esteve solto, `a { text-decoration: none }`
matava a utilitária `underline` do rodapé e `.kicker` comia um `text-white/80`
aplicado no mesmo elemento. **Não tirar as regras das camadas.**

### `src/app/parts/*.css`

Quatro ficheiros (`navbar`, `sobre`, `passos`, `reels`) carregados no
`layout.tsx` **depois** do `globals.css`, e por isso ganham-lhe em igualdade de
especificidade. Nasceram para quatro trabalhos em paralelo não colidirem no
mesmo ficheiro. Escrevem todos dentro de `@layer components`: camadas nativas
juntam-se entre ficheiros.

**Efeito colateral a conhecer:** as regras `.cf*` do carrossel continuam no
`globals.css` e não em `parts/reels.css`. Foi por isso que uma colisão de
`z-index` passou despercebida a quem trabalhou nos reels.

---

## 5. Estrutura

```
/                landing (tudo o que interessa)
/entregas/       mapa, passos e FAQ
/encomendar/     formulário de três passos
/privacidade/
```

**Landing, por ordem:** hero em vídeo → fotografia rasgada + quem somos →
três passos com o peixe → mapa das entregas → reels → falar connosco → FAQ →
rodapé.

Rotas com **barra no fim** (`trailingSlash: true`): num alojamento estático é o
que faz `/entregas` e `/entregas/` funcionarem os dois.

---

## 6. As peças, e porque estão como estão

### O vídeo do hero, `hero-video.tsx`

Filme da marca, cortado aos **26,5 s** porque o original acaba com uma cartela
de logótipo que em loop aparecia e desaparecia de duas em duas voltas.

Quatro coisas que só existem porque falharam primeiro:

- **Sem `autoPlay`.** O atributo sozinho não convence o iOS, e o React nem
  sequer escreve o `muted` no HTML do servidor. O mudo põe-se por JavaScript
  antes do `play()`, como no site do Tomás Marques.
- **Nova tentativa ao primeiro gesto.** Em **poupança de energia** o iOS recusa
  o arranque de qualquer vídeo, mesmo mudo e inline, e mostra um botão de play.
  A única coisa que o convence é um toque.
- **Pausa fora do ecrã, retoma ao voltar.** O iOS suspende a descodificação de
  um vídeo muito tempo fora de vista e não o retoma sozinho: descer o site todo
  e voltar ao topo dava com ele congelado.
- **Recomeço à mão no evento `ended`**, porque o atributo `loop` falha quando o
  elemento foi suspenso perto do fim.

### O fundo, `sea-background.tsx`

Bolhas de ar a subir, em canvas fixo, montado **uma só vez** no layout.

`setTransform` e não `scale`: a escala do contexto 2D é cumulativa e ao fim de
três resizes o desenho estava oito vezes maior.

As bolhas têm um **recorte no topo pela base do hero**, para nunca passarem por
cima do vídeo.

A densidade e a opacidade foram subidas depois de o cliente dizer que não se
viam: 16/26 para 30/48 bolhas, e o piso de opacidade de 0,10 para 0,26. A 0,10
de branco sobre `#e7f2fb` a bolha era invisível fora de um ecrã calibrado.

### A dourada, `fish-explode.tsx`

61 frames WebP de 390×980 tirados de um vídeo de 5,04 s. O scroll conduz o
índice; subir junta o peixe outra vez, porque o índice é função pura da posição.

- **Um `<img>` com o `src` a trocar, e não um `<canvas>`.** Com canvas ficava em
  branco num iPhone sem nada que o denunciasse. Uma imagem ou aparece ou mostra
  o alt.
- **Frames e não um `<video>` com `currentTime`:** o seek de um vídeo comprimido
  salta para o keyframe anterior.
- **Canal alfa**, desde que o fundo passou a azul. Achatados sobre branco, como
  estavam, ficavam com um rectângulo à volta.
- **Não prende o scroll.** A primeira versão tinha um palco `sticky` de 320vh e
  foi mandada abaixo por isso.

Hoje vive **em pé, à direita dos três passos**, e cabe DENTRO da altura deles:
quando mandava na altura da secção, sobravam 400 px de vazio por baixo do
passo 3.

### A fotografia rasgada, `foto-rasgada.tsx` + `parts/sobre.css`

Abre o "quem somos" logo a seguir ao hero, quase a toda a largura, a nascer do
azul da página em cima e **rasgada em baixo**.

- **Máscara SVG e não `clip-path` de polígono.** Um polígono dá zigue-zague duro
  e lê-se como serrilha; uma curva irregular lê-se como papel.
- **A orla da fibra são DUAS máscaras**, não um contorno: o contentor recorta
  pela curva A, a imagem pela curva B, e pelo vão entre as duas vê-se a chapa
  clara. Como a distância varia e em sítios B passa abaixo de A, a fibra tem
  falhas e espessura variável. Um contorno de largura constante daria um
  autocolante.
- **O título começa DENTRO do rasgão**, por margem negativa tirada da própria
  faixa. Foi assim que o cliente desenhou.

⚠️ **Só validado em Chrome.** Usa `mask-composite`, que precisa de Safari 15.4+
e teve historicamente outras palavras-chave. **Falta ver num iPhone real.**

### O texto deles, `historia.tsx`

Os parágrafos alternam de lado e cada um leva no canto superior direito o
retrato de quem fala, como um autocolante colado à mão. `float` e não
posicionamento absoluto: é o que faz o texto escoar-se à volta em vez de a
primeira linha passar por cima da cara.

O texto foi **encurtado de 141 para 102 palavras** a pedido. Saiu rodeio, ficou
tudo o que só eles podem dizer. **Vale a pena mostrar-lhes a versão curta antes
de publicar a sério**, porque o texto é deles.

### Os passos, `passos.tsx`

Números grandes e setas curvas que se desenham em ciclo. **Em coluna nos dois
tamanhos de ecrã** desde que o cliente pediu; a seta horizontal foi apagada e
não deixada morta no ficheiro.

### O mapa, `mapa-entregas.tsx`

Contorno de Portugal continental desenhado à mão por projeção equirectangular
sobre 52 pontos, com **dureza por vértice** no alisamento: um alisamento
uniforme comia Peniche, o Cabo da Roca, o Espichel e Sagres, e o país deixava de
se reconhecer.

As zonas são **discos e não fronteiras administrativas**: a 320px as fronteiras
viravam ruído. A rota de Peniche anda **em ciclo** enquanto o mapa está à vista.

Na landing o mapa é **ilustração** (`lista={false}`): sem pílulas e sem painel,
e o botão leva a `/entregas/`. Lá, os nomes das zonas são **tipografia grande a
boiar**, com atraso negativo por item para o conjunto ler como linha de água.

### Os reels, `reels-carrossel.tsx`

Coverflow com a geometria do site do Tomás Marques **que está no ar**, não da
cópia local do repositório, que estava desactualizada e me fez errar duas vezes.

| distância | deslocação | escala | rotação Y | opacidade | desfoque |
|---|---|---|---|---|---|
| 0 | 0% | 1 | 0° | 1 | 0 |
| ±1 | ∓45% | 0,85 | ±10° | 0,4 | 4px |
| ±2 | ∓90% | 0,7 | ±20° | 0,16 | 7px |
| ±3 | ∓135% | 0,55 | ±30° | 0 | 7px |

**Três cartões em telemóvel, cinco em desktop.**

Os vídeos são os reais, com som, descarregados com
`yt-dlp --cookies-from-browser chrome` (sem cookies o Instagram devolve parede
de login e nem `og:image` traz).

- O som **arranca desligado** e liga-se por botão: nenhum browser deixa um vídeo
  tocar com som sem um gesto, e o `play()` tem de sair de dentro desse gesto.
- **A capa vive POR BAIXO do vídeo**, sempre. O atributo `poster` não chega: em
  poupança de energia o play é recusado, o vídeo fica sem frames e o poster não
  chega a ser pintado, e o cartão do meio aparecia em branco.
- Só toca **quando a secção está à vista**: um dos reels tem sete minutos e
  35 MB, e assim não gasta dados de quem nem chegou a vê-lo.

### O formulário, `encomenda-form.tsx`

Assistente de **três passos** com barra de progresso, contador e campos com
**linha por baixo** em vez de caixas, copiado do formulário de avaliação do
Marques **que está no ar**. Valida passo a passo e salta para o primeiro campo
errado. Envia para WhatsApp já escrito.

Vive **só** em `/encomendar/`. Na landing há apenas um convite com CTA, como no
site dele.

### A navbar, `site-header.tsx` + `parts/navbar.css`

Cápsula em **Liquid Glass** com desfoque e saturação, e o **logótipo azul**.
Medido em pixéis reais sobre quatro instantes do vídeo: links **6,28:1** no pior
caso, logótipo **4,77:1**. O logótipo passa por pouco: **se um dia trocarem o
vídeo do hero por um mais claro, é o primeiro sítio a voltar a medir.**

Abaixo dos 900px o `backdrop-filter` sai (regra do kit: é caro em GPU e come
legibilidade), e o fundo passa a opaco.

**Não se esconde ao descer**: num site de uma página, o menu é a única forma de
saltar entre secções.

Os links são `<a>` simples e não `next/link`, porque se a hidratação falhar num
telemóvel o `next/link` deixa de navegar. **Em troca, não recebem o prefixo da
subpasta sozinhos e têm de passar pelo `asset()`** (ver secção 8).

---

## 7. Assets, `public/`

| Pasta | Peso | O que é |
|---|---|---|
| `reels/` | 59 MB | cinco vídeos com som, mais as capas |
| `video/` | 9,1 MB | hero em duas resoluções, mais a marca animada |
| `frames/` | 3,0 MB | os 61 frames da dourada |
| `img/` | 356 KB | logótipo, retratos, carrinha, cartão de partilha |

- **Não há ficheiro original do logótipo.** Os dois SVG são um decalque feito
  com **potrace** a partir do avatar do Instagram. Se o cliente mandar o
  original, substituir os dois.
- Os retratos do Rui e da Beatriz foram recortados **por dentro** do círculo
  original, senão traziam o anel escuro da captura.
- A **marca animada** é o vídeo do logótipo cortado ao círculo. Como o círculo é
  azul cheio, o fundo branco desaparece sem precisar de transparência, que o
  H.264 não tem e que em WebM o Safari não lê.
- O `webm` do hero foi gerado e **deitado fora**: ficou maior do que o mp4.

---

## 8. Publicar

```bash
# VPS (raiz do domínio)
NEXT_PUBLIC_SITE_URL="https://fishify.imogrow.pt" npm run build
rsync -az --delete -e "ssh -i ~/.ssh/id_ed25519" \
  out/ filipe@167.86.123.215:~/fishify-static/

# Pré-visualização (subpasta)
NEXT_PUBLIC_BASE_PATH="/fishify" \
NEXT_PUBLIC_SITE_URL="https://tomas476.github.io" npm run build
# copiar out/ para o worktree do gh-pages, touch .nojekyll, push -f
```

Na VPS: `~/fishify-static`, `~/sites/fishify.Caddyfile`, container `fishify_site`
no stack `~/sites`, alcançado **por nome** na `imogrow_net`, sem portas
publicadas. O `caddy_proxy` é o único ingress.

### Três armadilhas da subpasta, todas pagas

1. **O `NEXT_PUBLIC_SITE_URL` é só a origem, sem a subpasta.** O prefixo é
   acrescentado pelo `asset()`; pôr as duas coisas dava
   `.../fishify/fishify/img/og.png` e cartão de partilha em branco.
2. **O `next/image` não aplica o `basePath`** quando as imagens vão sem
   optimizador, que é obrigatório num export estático.
3. **Os `<a>` também não.** O logótipo e o menu inteiro mandavam para a raiz do
   domínio e devolviam 404.

O `.nojekyll` é obrigatório: sem ele o Jekyll do GitHub ignora a pasta `_next`
inteira, porque começa por underscore, e o site fica sem JavaScript.

---

## 9. Por confirmar, e por fazer

- [ ] **Registo A de `fishify.imogrow.pt` → `167.86.123.215`**, na Amen. Sem
      ele NÃO se acrescenta a entrada ao `~/infra/caddy/Caddyfile`: o ACME
      falharia e queimava o rate limit do domínio, que castiga também o
      `imogrow.pt` e o `fred.imogrow.pt`.
- [ ] **O rasgão da fotografia num iPhone real** (`mask-composite`).
- [ ] **Os dias de entrega de cada zona.** Não estão no material e não se
      inventaram.
- [ ] **Os concelhos de cada zona** foram preenchidos por geografia, não por
      lista deles.
- [ ] **Preços e espécies.** Decisão do cliente: este build não os tem.
- [ ] **O texto curto do "quem somos"**, aprovado pelo Rui e pela Beatriz.
- [ ] A pré-visualização pública expõe o código e as fotografias. Decidir se
      fica ou desaparece quando o domínio estiver de pé.

---

## 10. Como o cliente trabalha

- Itera **muito depressa**, com capturas de ecrã do telemóvel, muitas vezes de
  madrugada.
- **Desenha por cima das capturas** quando quer explicar uma disposição. Quando
  isso acontece, **guardar a imagem**: uma vez perdi o desenho e tive de
  trabalhar de memória, e saiu errado.
- Quando manda seguir um site de referência, é **à letra**, e é o site **que
  está no ar**, não a cópia local. Errei duas vezes por ir à cópia local do
  Tomás Marques, que estava desactualizada.
- Fala em pt-PT informal. Responder em pt-PT.

---

## 11. Referências

- **Kit da casa:** `~/Desktop/imogrow-realtor-kit`, com a skill
  `realtor-landing`, o design system e, sobretudo,
  `references/banned-components/list.txt`, que tem a **checklist de entrega** na
  secção 7. Ler antes de escrever HTML e outra vez antes de entregar.
- **Tomás Marques:** `~/Desktop/tomas-marques-landing` (local, DESACTUALIZADO) e
  **tomasmarques.imogrow.pt** (a fonte boa).
- **Diogo R. Silva:** `~/Desktop/_refs/diogo/`.
- O género está descrito em
  `~/.claude/projects/-Users-tomasferreira/memory/reference_realtor_site_house_style.md`.
