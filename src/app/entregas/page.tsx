import type { Metadata } from "next";
import Link from "next/link";
import Entregas from "@/components/entregas";
import Faq from "@/components/faq";
import Passos from "@/components/passos";
import { BRAND, ZONES } from "@/content/site";

export const metadata: Metadata = {
  title: "Entregas",
  description:
    "Entregamos peixe fresco da lota de Peniche na Grande Lisboa, Margem Sul, Oeste, Leiria e Santarém. Veja os concelhos de cada zona e agende pelo WhatsApp.",
};

/* A página detalhada das entregas. A landing dá o mapa e um convite; aqui
   estão os concelhos escritos, os passos e as perguntas frequentes, que
   são coisas que ninguém lê a passar mas toda a gente procura quando
   quer mesmo encomendar. */
export default function EntregasPagina() {
  return (
    <>
      <section
        className="section"
        style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}
      >
        <div className="shell">
          <p className="kicker" data-reveal>
            Entregas
          </p>
          <h1
            className="display display--lg mt-4 max-w-[20ch]"
            data-reveal="palavras"
          >
            Levamos o peixe a cinco zonas do país.
          </h1>
          <p className="lede mt-6 max-w-[54ch]" data-reveal>
            A carrinha sai de {BRAND.origin} com o peixe escolhido nessa manhã
            e faz uma zona de cada vez. Toque na sua no mapa para abrir a
            conversa já com o nome dela escrito.
          </p>

          <div className="mt-12">
            <Entregas />
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <h2 className="display display--lg max-w-[20ch]" data-reveal="palavras">
            Os concelhos de cada zona.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2" data-reveal="cascata">
            {ZONES.map((zona) => (
              <div key={zona.name}>
                <h3 className="display display--md">{zona.name}</h3>
                <p className="mt-2 text-[var(--color-ink-2)]">{zona.note}</p>
              </div>
            ))}
          </div>
          <p className="muted mt-10 max-w-[54ch]" data-reveal>
            Não vê a sua terra na lista? Mande mensagem na mesma. Há semanas em
            que a carrinha estica o percurso, e há sítios onde combinamos um
            ponto de recolha.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="kicker" data-reveal>
            Como funciona
          </p>
          <h2
            className="display display--lg mt-4 max-w-[18ch]"
            data-reveal="palavras"
          >
            Da mensagem à mesa.
          </h2>
          <Passos className="mt-14" />
        </div>
      </section>

      <Faq />

      <section className="section--tight">
        <div className="shell shell--narrow text-center">
          <Link className="btn btn--solid" data-reveal href="/encomendar">
            Fazer uma encomenda
          </Link>
        </div>
      </section>
    </>
  );
}
