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

/* Mesma arrumação da página de avaliação do Tomás Marques: rótulo e título
   centrados, o selo da marca por baixo, e o painel do formulário a seguir.
   Aqui o selo é o vídeo do logótipo a girar, que o cliente mandou. */
export default function EncomendarPagina() {
  return (
    <>
      <section
        className="section--tight"
        style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}
      >
        <div className="shell shell--narrow text-center">
          <p className="kicker" data-reveal>
            Encomenda sem compromisso
          </p>
          <h1 className="display display--lg mt-3" data-reveal="palavras">
            Diga-nos o que procura.
          </h1>
          <p className="lede mx-auto mt-5 max-w-[46ch]" data-reveal>
            Respondemos com o que veio da lota de {BRAND.origin} nessa semana,
            a que preço, e em que dia a carrinha passa na sua zona.
          </p>

          <div className="mt-10 flex justify-center" data-reveal="escala">
            <MarcaAnimada className="marca-animada marca-animada--selo" />
          </div>
        </div>
      </section>

      <section className="section--tight pb-[clamp(56px,11vw,120px)]">
        <div className="shell shell--narrow">
          <div className="painel-form" data-reveal="escala">
            <EncomendaForm />
          </div>

          <div className="mt-12" data-reveal>
            <h2 className="display display--md">Quando respondemos</h2>
            <div className="mt-5">
              <Horario />
            </div>
            <p className="muted mt-5 text-[0.92rem]">
              Fora deste horário a mensagem fica à espera e respondemos na
              manhã seguinte.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
