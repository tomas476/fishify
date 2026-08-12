import type { Metadata } from "next";
import { BRAND } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como a Fishify trata os dados de quem visita o site.",
};

export default function Privacidade() {
  return (
    <section className="section" style={{ paddingTop: "clamp(120px, 22vh, 180px)" }}>
      <div className="shell shell--narrow prose">
        <h1 className="display display--lg">Privacidade</h1>
        <p className="mt-6">
          Este site não tem formulários, não tem conta de utilizador e não
          guarda nada sobre quem o visita. Não há analítica nem cookies de
          terceiros.
        </p>
        <p>
          Os botões de encomenda abrem uma conversa de WhatsApp com uma
          mensagem já escrita. A partir do momento em que a envia, os dados
          dessa conversa passam a ser tratados pelo WhatsApp e por nós, e
          servem apenas para preparar e entregar a sua encomenda.
        </p>
        <p>
          As capas dos vídeos são as miniaturas dos reels do nosso perfil de
          Instagram e estão alojadas neste site. Os vídeos abrem no Instagram,
          que aplica as regras de privacidade dele.
        </p>
        <p>
          Para apagar o que quer que seja que tenhamos sobre si, escreva para{" "}
          <a className="underline underline-offset-4" href={`mailto:${BRAND.email}`}>
            {BRAND.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
