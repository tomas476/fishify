"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, NAV, WA_MESSAGES, wa } from "@/content/site";
import Logo from "@/components/logo";

/* =========================================================================
   NAVBAR EM CÁPSULA FLUTUANTE

   Dois estados, e é o CSS que trata dos dois a partir de dois atributos:
   • data-solid: a cápsula ganha corpo branco assim que a página sai do
                   topo. Em cima do hero é transparente com tinta branca.
   • data-hidden: esconde-se ao descer, reaparece ao subir.

   Na home o topo é vídeo, por isso `solid` arranca em falso. Nas outras
   rotas o topo é papel branco, e uma cápsula de tinta branca sobre papel
   branco seria invisível: aí arranca já sólida.
   ========================================================================= */

export default function SiteHeader() {
  const pathname = usePathname();
  const overVideo = pathname === "/";

  const [solid, setSolid] = useState(!overVideo);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setSolid(!overVideo || y > 40);
      /* Não se esconde no topo nem com o menu aberto: fugir com o painel
         aberto deixava o menu a pairar sozinho. */
      setHidden(y > 220 && y > last && !open);
      last = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overVideo, open]);

  return (
    <header className="nav" data-solid={solid} data-hidden={hidden}>
      <div className="nav__bar">
        <Link href="/" aria-label={`${BRAND.name}, ir para o início`}>
          <Logo className="nav__logo" />
        </Link>

        <nav className="nav__links" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav__link"
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
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
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
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

      {open && (
        <div className="nav__panel" id="menu-principal">
          {/* fecha no clique, e não num efeito ligado à rota: uma navegação
              para a mesma página não muda o pathname e o painel ficava
              aberto por baixo do conteúdo novo */}
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a
            className="btn btn--solid btn--block"
            style={{ marginTop: 8 }}
            href={wa(WA_MESSAGES.order)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Encomendar pelo WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
