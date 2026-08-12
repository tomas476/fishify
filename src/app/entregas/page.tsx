import type { Metadata } from "next";
import Zones from "@/components/zones";
import { STEPS, WA_MESSAGES, wa } from "@/content/site";

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
          <p className="kicker reveal">Entregas</p>
          <h1 className="display display--lg reveal mt-4 max-w-[20ch]">
            Levamos o peixe a cinco zonas do país.
          </h1>
          <p className="lede reveal mt-6 max-w-[54ch]">
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
          <p className="kicker reveal">Como funciona</p>
          <h2 className="display display--lg reveal mt-4 max-w-[18ch]">
            Da mensagem à mesa.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="panel reveal">
                <p className="kicker">Passo {i + 1}</p>
                <h3 className="display display--md mt-3">{step.title}</h3>
                <p className="mt-3 text-[var(--color-ink-2)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--narrow">
          <h2 className="display display--lg reveal">Perguntas que nos fazem</h2>
          <dl className="mt-10 grid gap-6">
            <div className="reveal">
              <dt className="display display--md">
                A minha zona não está na lista.
              </dt>
              <dd className="mt-2 text-[var(--color-ink-2)]">
                Mande mensagem na mesma. Há semanas em que a carrinha estica o
                percurso, e há sítios onde combinamos um ponto de recolha.
              </dd>
            </div>
            <div className="reveal">
              <dt className="display display--md">Como vem o peixe?</dt>
              <dd className="mt-2 text-[var(--color-ink-2)]">
                Em caixa térmica com gelo, já escamado e amanhado, ou em posta e
                em filete se pedir assim. Chega pronto a ir para a panela.
              </dd>
            </div>
            <div className="reveal">
              <dt className="display display--md">Como se paga?</dt>
              <dd className="mt-2 text-[var(--color-ink-2)]">
                Na entrega. O valor é confirmado por mensagem antes de a carrinha
                sair, já com o peso certo de cada peixe.
              </dd>
            </div>
          </dl>
          <a
            className="btn btn--solid reveal mt-10"
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
