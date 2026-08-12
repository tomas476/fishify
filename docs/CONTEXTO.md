# Fishify, contexto do projeto

Estado em **13 de agosto de 2026**. Este ficheiro é a memória do projeto: o que
é, porque está como está, e o que ficou por confirmar com o cliente.

---

## 1. O cliente

**Fishify**, peixaria de Peniche que entrega em casa. São duas pessoas: o
**Rui** e a **Beatriz**.

| | |
|---|---|
| WhatsApp | **+351 934 243 797** (`351934243797`) |
| Email | geral@fishify.pt |
| Instagram | **@fishify.pt**, 24,2 mil seguidores, 528 publicações |
| Domínio anunciado | fishify.pt |
| Horário | 08:00 às 14:00, todos os dias menos **segunda** |
| Zonas | Grande Lisboa, Margem Sul, Oeste, Leiria, Santarém |

Tudo isto saiu do perfil de WhatsApp Business e do perfil de Instagram, em
capturas de ecrã. **Não há briefing escrito além do texto de "quem somos"**,
que eles escreveram e está em `src/content/site.ts` na voz deles, passado para
pt-PT (dezasseis, peixeiras, há gerações) sem lhe mudar o conteúdo.

---

## 2. Onde vive e como se corre

```
~/Desktop/fishify
npm run dev -- --port 3310     # http://localhost:3310
npm run build                  # tem de passar antes de dar algo por feito
npx tsc --noEmit
npx eslint src --max-warnings=0
```

**Stack:** Next.js **16.2.12** (App Router, `src/`), React 19.2, TypeScript,
**Tailwind v4**, sem framer-motion (o movimento deste site é canvas e CSS).

Armadilhas desta stack, já pagas noutro projeto e válidas aqui:

1. **Não existe `tailwind.config.js`.** A configuração vive no `@theme inline`
   dentro de `globals.css`.
2. **Next 16 tem breaking changes.** Os docs estão em
   `node_modules/next/dist/docs/01-app/`. **Consultar, não adivinhar.**
3. O ESLint deste projeto proíbe `setState` síncrono dentro de um efeito. É por
   isso que existe `src/lib/use-reduced-motion.ts` com `useSyncExternalStore`.

---

## 3. Design system: `src/app/globals.css`

Paleta **clara**, um único acento.

| Variável | Valor | O que é |
|---|---|---|
| `--paper` | `#ffffff` | branco puro, e é **de propósito** (ver secção 5) |
| `--paper-2` / `--paper-3` | `#eff5fa` / `#dce9f4` | faixas alternadas, cards |
| `--deep` | `#0e2237` | azul de fundo do mar: rodapé e CTA final |
| `--ink` | `#0e1a24` | quase-preto azulado, nunca `#000` |
| `--ink-2` / `--ink-3` | `#3f5361` / `#5a6d7b` | texto secundário / legendas |
| `--accent` | **`#4c7fb4`** | azul da marca |
| `--accent-deep` | `#2f5e90` | acento em **texto** sobre papel |

O azul **não foi escolhido**: foi amostrado com PIL do logótipo no avatar do
Instagram. Sobre branco, `--accent` dá 3,54:1 e por isso **não serve para texto
pequeno**; `--accent-deep` dá 6,05:1 e é esse que leva tinta.

**Tipografia:** display → **Outfit** (a geometria mais próxima do lettering do
próprio logótipo); corpo → **Instrument Sans**.

**Classes:** `.shell` `.section` `.band` `.band--deep` `.panel` `.display`
`.kicker` `.lede` `.btn` `.reveal` `.facts`.

### Regras não negociáveis

1. **Um só acento.** Azul e mais nada.
2. **Cores sempre por variável.**
3. Zero traços decorativos, e nada de traço a meio de frase no texto visível.
4. **Nunca `tel:` num CTA de navegação** (em macOS abre o FaceTime).
5. **Formulários não existem**: tudo abre WhatsApp pré-preenchido via `wa.me`.
6. pt-PT. `prefers-reduced-motion` respeitado.

### As camadas do CSS não são decoração

Tudo em `globals.css` está dentro de `@layer base` ou `@layer components`. CSS
sem camada ganha **sempre** a CSS em camada, por muito baixa que seja a
especificidade. Enquanto o ficheiro esteve solto, `a { text-decoration: none }`
matava a utilitária `underline` do rodapé e `.kicker` comia um `text-white/80`
aplicado no mesmo elemento. **Não tirar as regras das camadas.**

---

## 4. Estrutura

```
/             home
/sobre        a história do Rui e da Beatriz + a dourada que se abre ao scroll
/entregas     as cinco zonas, como funciona, perguntas frequentes
/contactos    horário e contactos
/privacidade
```

Navbar em **cápsula flutuante**: transparente com tinta branca em cima do vídeo
do hero, corpo branco assim que a página sai do topo. Esconde-se ao descer.

---

## 5. A dourada que se abre ao scroll: `src/components/fish-explode.tsx`

É a peça central do `/sobre` e ocupa o lugar onde estaria o retrato deles.

**61 frames WebP** de 440×1105, tirados do vídeo original do cliente
(`~/Desktop/kling_20260813_VIDEO_Photoreali_1702_0.mp4`, 5,04 s a 24 fps,
ficaram os pares). O scroll conduz o índice do frame; subir junta o peixe outra
vez porque o índice é função pura da posição.

Três decisões, todas medidas:

- **Fundo branco achatado, e não canal alfa.** Com alfa, os 121 frames pesavam
  **9,4 MB** e o alfa é guardado sem perdas, por isso baixar a qualidade não
  fazia diferença nenhuma. Achatados sobre branco e reduzidos a 61, pesam
  **2,3 MB**. É por isto que `--paper` é `#ffffff` puro: **se o papel mudar,
  aparece um rectângulo à volta do peixe.**
- **Canvas, e não 61 `<img>` empilhados.** Com `<img>` o browser só descodifica
  a imagem quando ela fica visível e a primeira passagem engasgava.
- **Frames, e não um `<video>` com `currentTime`.** O seek de um vídeo
  comprimido salta para o keyframe anterior; re-encodar tudo em keyframes daria
  um ficheiro maior do que estes 2,3 MB.

O carregamento faz o primeiro e o último frame à cabeça e vai buscando os do
meio; enquanto um frame não chegou, desenha-se o mais próximo que já existe.

### O bug que custou uma tarde

O palco é `position: sticky`. Não estava a colar, e o peixe passava de raspão.
A causa era `overflow-x: hidden` no `<body>`: isso faz do body um **contentor de
scroll**, e um contentor de scroll é o fim do `sticky` de tudo o que está lá
dentro. O corte horizontal é feito por `overflow-x: clip` no `<html>`, que não
cria contentor nenhum. **Não voltar a pôr `overflow-x: hidden` no body.**

---

## 6. Assets: `public/`

| Ficheiro | O que é | Origem |
|---|---|---|
| `video/hero.mp4` (5,0 MB) | filme da marca, 26,5 s, 1080×1920 | `~/Desktop/0812.mp4`, 4K60 de 183 MB |
| `video/hero-sm.mp4` (2,0 MB) | o mesmo a 608×1080, para telemóvel | idem |
| `img/hero-poster.webp` | poster do vídeo | frame aos 2 s |
| `img/logo.svg` · `img/mark.svg` | logótipo e símbolo, `fill="currentColor"` | vectorizados com **potrace** a partir do avatar do Instagram |
| `img/og.png` | cartão de partilha 1200×630 | montado em HTML e capturado com Chrome |
| `frames/fish-001..061.webp` (2,3 MB) | a dourada | ver secção 5 |
| `reels/<id>.webp` | capas dos cinco reels | miniaturas via `yt-dlp --cookies-from-browser chrome` |

**O original do vídeo tem 32 s e acaba com uma cartela de logótipo sobre fundo
escurecido.** Está cortado aos **26,5 s**, antes dessa cartela: em loop, a
cartela aparecia e desaparecia de duas em duas voltas.

**Não há ficheiro original do logótipo.** Os dois SVG são um decalque. Se o
cliente mandar o original, substituir os dois.

O `webm` foi gerado e **deitado fora**: ficou em 5,8 MB contra os 5,0 MB do
mp4, ou seja pagava-se um formato extra para o ficheiro ficar maior.

Os vídeos dos reels **não estão alojados aqui**. Os cartões levam ao Instagram,
que é onde a Fishify já tem público.

---

## 7. Por confirmar com o cliente

- [ ] **Os dias de entrega de cada zona.** Não estão em lado nenhum do material
      e não se inventaram: cada zona abre uma conversa de WhatsApp já escrita
      com o nome dela. Quando o Rui mandar o mapa semanal, entra um campo `day`
      no `ZONES` e mostra-se ao lado do nome.
- [ ] **Os concelhos de cada zona.** Estão preenchidos com os concelhos que
      fazem sentido geográfico, **não com uma lista que eles tenham dado**.
- [ ] **Preços e espécies.** Decisão do utilizador: este build não os tem.
- [ ] **Domínio.** O perfil deles anuncia `fishify.pt`. Falta decidir se este
      site vai para lá ou para um subdomínio de pré-visualização.
- [ ] **Fotografias do Rui e da Beatriz.** Não há nenhuma no material. A página
      `/sobre` vive só do texto e da dourada.
