/* =========================================================================
   FONTE ÚNICA DE FACTOS

   Nunca escrever um facto à mão numa página. Tudo o que está aqui saiu de
   material do cliente: o perfil de WhatsApp Business, o perfil de Instagram
   @fishify.pt e o texto que o Rui e a Beatriz escreveram sobre eles.

   O texto de "quem somos" foi passado para pt-PT (dezasseis, peixeiras,
   há gerações) e pontuado, sem lhe mexer no conteúdo nem na ordem.
   ========================================================================= */

export const BRAND = {
  name: "Fishify",
  tagline: "A frescura do mar de Peniche à sua mesa",
  domain: "fishify.pt",
  url: "https://fishify.pt",
  email: "geral@fishify.pt",
  /** Só para `wa.me`. Nunca usar em `tel:` num CTA de navegação. */
  whatsapp: "351934243797",
  phoneLabel: "+351 934 243 797",
  instagram: "https://www.instagram.com/fishify.pt/",
  instagramHandle: "@fishify.pt",
  followers: "24,2 mil",
  origin: "Peniche",
} as const;

/** Do perfil de WhatsApp Business. Segunda é o dia de folga. */
export const HOURS = [
  { day: "Segunda", hours: null },
  { day: "Terça", hours: "08:00 às 14:00" },
  { day: "Quarta", hours: "08:00 às 14:00" },
  { day: "Quinta", hours: "08:00 às 14:00" },
  { day: "Sexta", hours: "08:00 às 14:00" },
  { day: "Sábado", hours: "08:00 às 14:00" },
  { day: "Domingo", hours: "08:00 às 14:00" },
] as const;

/* As cinco zonas são as que eles anunciam no perfil. Os DIAS de cada zona
   não estão em lado nenhum do material, por isso não estão aqui: quem quer
   saber o dia da sua zona agenda pelo WhatsApp. Se o Rui mandar o mapa
   semanal, é aqui que ele entra, num campo `day`. */
export const ZONES = [
  {
    name: "Grande Lisboa",
    note: "Lisboa, Amadora, Odivelas, Loures, Sintra, Cascais e Oeiras.",
  },
  {
    name: "Margem Sul",
    note: "Almada, Seixal, Barreiro, Montijo e Setúbal.",
  },
  {
    name: "Oeste",
    note: "Peniche, Caldas da Rainha, Óbidos, Bombarral, Torres Vedras e Lourinhã.",
  },
  {
    name: "Leiria",
    note: "Leiria, Marinha Grande, Praia da Vieira e concelhos vizinhos.",
  },
  {
    name: "Santarém",
    note: "Santarém, Rio Maior, Cartaxo e Almeirim.",
  },
] as const;

/** Como funciona uma encomenda, do ponto de vista de quem nunca comprou. */
export const STEPS = [
  {
    title: "Diz onde está",
    body: "Manda mensagem com a sua zona. Respondemos com o dia em que a carrinha lá passa e a hora a que fecha a encomenda.",
  },
  {
    title: "Escolhe o peixe",
    body: "Dizemos o que veio da lota nessa semana e a que preço. Escolhe as espécies, a quantidade e como o quer preparado.",
  },
  {
    title: "Recebe em casa",
    body: "Vai fresco, em caixa térmica com gelo, no dia da sua zona. Paga na entrega.",
  },
] as const;

/** Três coisas que os separam de um supermercado. Todas verificáveis. */
export const PILLARS = [
  {
    title: "Peixe de Peniche",
    body: "Vem da lota de Peniche, um dos maiores portos de pesca do país. Não passa por intermediários nem por armazém.",
  },
  {
    title: "Duas famílias do mar",
    body: "O Rui vem de pescadores e peixeiros desde os bisavós. A Beatriz aprendeu com a avó e a bisavó, na Praia da Vieira.",
  },
  {
    title: "Preparado como pedir",
    body: "Escamado, amanhado, em posta ou em filete. Chega a casa pronto a ir para a panela.",
  },
] as const;

/** Texto do Rui e da Beatriz, na voz deles. */
export const STORY = {
  kicker: "Quem somos",
  title: "Antes de sermos a Fishify, somos duas pessoas que nasceram do mar",
  paragraphs: [
    "Duas famílias inteiras ligadas ao peixe, há gerações.",
    "Eu sou o Rui. Cresci no meio dos mercados a ver os meus pais trabalhar. Venho de uma família de pescadores e peixeiros desde os bisavós, e sempre ouvi dizer que o mar nos corre nas veias.",
    "Eu sou a Beatriz. Cresci na Praia da Vieira, numa família de mulheres fortes. A minha avó e a minha bisavó eram peixeiras. Aprendi a arte desde pequena.",
    "Conhecemo-nos em 2016, na faculdade em Leiria. Ficámos na mesma turma e o destino tratou de nos aproximar. A Fishify surgiu como trabalho final de curso. A ideia era simples: levar o melhor peixe de Peniche diretamente às pessoas.",
    "Hoje somos o Rui e a Beatriz, pessoas de família, humildes e trabalhadoras, que continuam uma tradição de gerações.",
  ],
  closing: "Fishify, a frescura do mar de Peniche, à sua mesa.",
} as const;

/* Os cinco reels com mais gostos do perfil deles, com a contagem de gostos
   lida do próprio Instagram no dia 13 de agosto de 2026. As capas são as
   miniaturas dos reels. O cartão leva ao Instagram: não alojamos os vídeos. */
export const REELS = [
  { id: "DYcog1ptO45", likes: 22155 },
  { id: "DZk5CqfNZzA", likes: 5330 },
  { id: "DWwoqFoAS5Y", likes: 4793 },
  { id: "DVEm4ZSgMo9", likes: 4341 },
  { id: "DX4vpNqsx59", likes: 2518 },
] as const;

/* As perguntas que mais fazem por mensagem. O dia de cada zona não está
   no material do cliente, por isso a resposta remete para o WhatsApp. */
export const FAQS = [
  {
    id: "zona",
    question: "A minha zona não está na lista.",
    answer:
      "Mande mensagem na mesma. Há semanas em que a carrinha estica o percurso, e há sítios onde combinamos um ponto de recolha.",
  },
  {
    id: "peixe",
    question: "Como vem o peixe?",
    answer:
      "Em caixa térmica com gelo, já escamado e amanhado, ou em posta e em filete se pedir assim. Chega pronto a ir para a panela.",
  },
  {
    id: "pagamento",
    question: "Como se paga?",
    answer:
      "Na entrega. O valor é confirmado por mensagem antes de a carrinha sair, já com o peso certo de cada peixe.",
  },
  {
    id: "dia",
    question: "Em que dia entregam na minha zona?",
    answer:
      "Combina-se por WhatsApp. Diga onde mora e respondemos com o dia em que a carrinha passa na sua zona e a hora a que fecha a encomenda dessa semana.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Quem somos" },
  { href: "/entregas", label: "Entregas" },
  { href: "/contactos", label: "Contactos" },
] as const;

/** Abre uma conversa de WhatsApp já escrita. Sem backend, como sempre. */
export function wa(message: string): string {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGES = {
  order: "Olá! Vi o site da Fishify e queria encomendar peixe. A minha zona é ",
  zone: (zone: string) =>
    `Olá! Vi o site da Fishify. Queria saber em que dia entregam na zona ${zone} e como faço a encomenda.`,
  schedule:
    "Olá! Vi o site da Fishify e queria agendar uma entrega. A minha zona é ",
  general: "Olá! Vi o site da Fishify e queria fazer uma pergunta.",
} as const;
