"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, WA_MESSAGES, wa } from "@/content/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* =========================================================================
   PERGUNTAS QUE NOS FAZEM

   As três primeiras são as que já estavam na página de entregas, com o texto
   tal e qual. A quarta responde ao que mais perguntam por mensagem: o dia da
   zona. Esse dia não está em lado nenhum do material do cliente, por isso
   remete para o WhatsApp em vez de inventar um calendário.
   ========================================================================= */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.015 },
  },
};

const letter = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3 },
  },
};

/**
 * Revela o texto carácter a carácter, cada um a entrar de desfocado.
 *
 * Quem tem `prefers-reduced-motion` recebe o texto de uma vez, sem spans.
 * O espaço vai como espaço normal dentro de um span com `pre-wrap`, e não
 * como `&nbsp;`: o espaço inseparável impedia a quebra de linha e punha o
 * parágrafo a transbordar da coluna a 390px.
 */
export const BlurredStagger = ({ text = "" }: { text?: string }) => {
  const reduced = useReducedMotion();

  if (reduced) return <span>{text}</span>;

  return (
    // o texto lido em bloco pelo leitor de ecrã, os caracteres escondidos dele
    <motion.span
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {Array.from(text).map((char, index) => (
        <motion.span
          aria-hidden="true"
          key={`${char}-${index}`}
          style={{ whiteSpace: "pre-wrap" }}
          variants={letter}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

/** A frase de contacto aparece duas vezes: no título em desktop, por baixo do
    acordeão em telemóvel. Uma só cópia do texto, dois sítios onde entra. */
function ContactoWhatsApp({ className }: { className?: string }) {
  return (
    <p className={className}>
      <span className="muted">Falta alguma coisa? </span>
      <a
        className="font-medium text-[var(--color-accent-deep)] underline underline-offset-4"
        href={wa(WA_MESSAGES.general)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Pergunte pelo WhatsApp
      </a>
      <span className="muted">, respondemos no mesmo dia.</span>
    </p>
  );
}

export default function Faq() {
  return (
    <section className="section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="kicker reveal">Dúvidas</p>
            <h2 className="display display--lg reveal mt-4 max-w-[16ch]">
              Perguntas que nos fazem
            </h2>
            <p className="lede reveal mt-5 max-w-[38ch]">
              O que nos chega por mensagem quase todas as semanas, respondido de
              uma vez.
            </p>
            {/* em telemóvel esta frase vai para depois do acordeão.
                Sem `.reveal`: escondida por `display:none`, o observador nunca
                a via entrar e ela ficava presa em opacity 0 se a janela
                crescesse até desktop já com a página aberta. */}
            <ContactoWhatsApp className="mt-6 hidden text-[0.95rem] lg:block" />
          </div>

          <div className="lg:col-span-3">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <BlurredStagger text={faq.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <ContactoWhatsApp className="mt-8 text-[0.95rem] lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
