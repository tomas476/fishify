import type { Metadata } from "next";
import Faq from "@/components/faq";
import Passos from "@/components/passos";
import Zones from "@/components/zones";
import { WA_MESSAGES, wa } from "@/content/site";

export const metadata: Metadata = {
  title: "Entregas",
  description:
    "Entregamos peixe fresco de Peniche todas as semanas na Grande Lisboa, Margem Sul, Oeste, Leiria e Santarém. Diga a sua zona pelo WhatsApp e agendamos.",
};

export default function Entregas() {
  return (
    <>
      <section className="section" style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}>
        <div className="shell">
          <p className="kicker" data-reveal>Entregas</p>
          <h1 className="display display--lg mt-4 max-w-[20ch]"
            data-reveal="palavras">
            Levamos o peixe a cinco zonas do país.
          </h1>
          <p className="lede mt-6 max-w-[54ch]" data-reveal>
            A carrinha sai de Peniche com o peixe escolhido nessa manhã e faz uma
            zona de cada vez. Escolha a sua abaixo e abrimos a conversa já com o
            nome da zona escrito.
          </p>
          <div className="mt-12">
            <Zones />
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="shell">
          <p className="kicker" data-reveal>Como funciona</p>
          <h2 className="display display--lg mt-4 max-w-[18ch]"
            data-reveal="palavras">
            Da mensagem à mesa.
          </h2>
          <Passos className="mt-14" />
        </div>
      </section>

      <Faq />

      <section className="section--tight">
        <div className="shell shell--narrow text-center">
          <a
            className="btn btn--solid"
            data-reveal
            href={wa(WA_MESSAGES.schedule)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar uma entrega
          </a>
        </div>
      </section>
    </>
  );
}
