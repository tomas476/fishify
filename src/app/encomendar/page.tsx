import type { Metadata } from "next";
import EncomendaForm from "@/components/encomenda-form";
import Horario from "@/components/horario";
import MarcaAnimada from "@/components/marca-animada";
import { BRAND } from "@/content/site";

export const metadata: Metadata = {
  title: "Encomendar",
  description:
    "Diga-nos quem é, onde quer receber e o que procura. Abrimos o WhatsApp com o pedido já escrito e respondemos com o peixe da semana e o dia da sua zona.",
};

export default function EncomendarPagina() {
  return (
    <section
      className="section"
      style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}
    >
      <div className="shell">
        <p className="kicker" data-reveal>
          Encomendar
        </p>
        <h1
          className="display display--lg mt-4 max-w-[20ch]"
          data-reveal="palavras"
        >
          Diga-nos o que procura.
        </h1>
        <p className="lede mt-6 max-w-[52ch]" data-reveal>
          Respondemos com o que veio da lota de {BRAND.origin} nessa semana, a
          que preço, e em que dia a carrinha passa na sua zona.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div data-reveal>
            <EncomendaForm />
          </div>

          <aside data-reveal="escala">
            <MarcaAnimada className="marca-animada mb-8" />

            <h2 className="display display--md">Quando respondemos</h2>
            <div className="mt-5">
              <Horario />
            </div>
            <p className="muted mt-5 text-[0.92rem]">
              Fora deste horário a mensagem fica à espera e respondemos na
              manhã seguinte.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
