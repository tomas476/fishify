"use client";

import { useEffect, useState } from "react";
import { BRAND, NAV, WA_MESSAGES, wa } from "@/content/site";
import Logo from "@/components/logo";

/* =========================================================================
   NAVBAR EM CÁPSULA FLUTUANTE

   O site é uma página só, por isso os links são ÂNCORAS e não navegação:
   `<a href="#seccao">` simples, sem `next/link`. Com `next/link` um hash
   passa pelo router, e num telemóvel onde a hidratação falhe o menu deixa
   de fazer seja o que for. Assim, mesmo sem JavaScript nenhum, tocar num
   item salta para a secção certa.

   UM estado, tratado pelo CSS a partir de um atributo:
   • data-solid: a cápsula ganha corpo branco assim que a página sai do topo

   A navbar NÃO se esconde ao descer. Escondia-se, e foi mandado abaixo:
   num site de uma página só, em que o menu é a única forma de saltar
   entre secções, tirá-lo do ecrã a meio da leitura obriga a subir para o
   ir buscar.

   O painel do menu está SEMPRE no DOM e é o atributo `data-aberto` que o
   mostra. Montá-lo e desmontá-lo fazia o primeiro toque perder-se em iOS,
   porque o elemento nascia debaixo do dedo a meio do gesto.
   ========================================================================= */

export default function SiteHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fechar = () => setOpen(false);

  return (
    <header className="nav" data-solid={solid}>
      <div className="nav__bar">
        <a href="#topo" aria-label={`${BRAND.name}, ir para o início`}>
          <Logo className="nav__logo" />
        </a>

        <nav className="nav__links" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav__link">
              {item.label}
            </a>
          ))}
          <a
            className="btn btn--solid"
            href={wa(WA_MESSAGES.order)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Encomendar
          </a>
        </nav>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
            /* o SVG não pode receber o toque: em iOS o alvo passava a ser o
               <path> e o clique perdia-se antes de chegar ao botão */
            style={{ pointerEvents: "none" }}
          >
            {open ? (
              <>
                <path d="M3 3l14 8" />
                <path d="M17 3L3 11" />
              </>
            ) : (
              <>
                <path d="M1 2h18" />
                <path d="M1 7h18" />
                <path d="M1 12h12" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div className="nav__panel" id="menu-principal" data-aberto={open}>
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={fechar}>
            {item.label}
          </a>
        ))}
        <a
          className="btn btn--solid btn--block"
          style={{ marginTop: 8 }}
          href={wa(WA_MESSAGES.order)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={fechar}
        >
          Encomendar pelo WhatsApp
        </a>
      </div>
    </header>
  );
}
