import type { Metadata } from "next";
import { BRAND, HOURS, WA_MESSAGES, wa } from "@/content/site";

export const metadata: Metadata = {
  title: "Contactos",
  description: `Falar com a Fishify: ${BRAND.phoneLabel}, ${BRAND.email}. Aberto de terça a domingo, das 08:00 às 14:00.`,
};

export default function Contactos() {
  return (
    <>
      <section className="section" style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}>
        <div className="shell">
          <p className="kicker reveal">Contactos</p>
          <h1 className="display display--lg reveal mt-4 max-w-[18ch]">
            A encomenda começa numa mensagem.
          </h1>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="reveal">
              <h2 className="display display--md">Falar connosco</h2>
              <ul className="mt-5 space-y-3 text-[var(--color-ink-2)]">
                <li>
                  WhatsApp:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={wa(WA_MESSAGES.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BRAND.phoneLabel}
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={`mailto:${BRAND.email}`}
                  >
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    className="underline underline-offset-4"
                    href={BRAND.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {BRAND.instagramHandle}
                  </a>
                </li>
              </ul>
              <a
                className="btn btn--solid mt-8"
                href={wa(WA_MESSAGES.order)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Encomendar pelo WhatsApp
              </a>
            </div>

            <div className="reveal">
              <h2 className="display display--md">Horário</h2>
              <div className="facts mt-5">
                {HOURS.map((h) => (
                  <div key={h.day}>
                    <span>{h.day}</span>
                    <span className={h.hours ? "" : "muted"}>
                      {h.hours ?? "encerrado"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="muted mt-4 text-[0.92rem]">
                As entregas fazem-se no dia de cada zona. Se mandar mensagem
                fora deste horário, respondemos na manhã seguinte.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
