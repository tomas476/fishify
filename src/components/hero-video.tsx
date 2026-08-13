"use client";

import { useEffect, useRef } from "react";

/* =========================================================================
   O VÍDEO DO HERO

   Filme da marca: drone sobre Peniche, a lota, as caixas, a carrinha a ser
   carregada. O original tem 32 s e acaba com uma cartela de logótipo sobre
   fundo escurecido; está cortado aos 26,5 s, antes dessa cartela, porque em
   loop a cartela aparecia e desaparecia de dois em dois voltas.

   Duas fontes e um guarda em JS: o atributo `media` de um <source> é
   avaliado UMA VEZ, no carregamento, e não reage a rodar o telemóvel.
   ========================================================================= */

const SMALL = "(max-width: 900px)";
const SMALL_SRC = "/video/hero-sm.mp4";
const FULL_SRC = "/video/hero.mp4";

/** Fica no poster: sem movimento, sem gastar dados de quem os poupa. */
function paused() {
  if (typeof window === "undefined") return true;
  return (
    document.hidden ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(prefers-reduced-data: reduce)").matches
  );
}

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedData = window.matchMedia("(prefers-reduced-data: reduce)");
    const small = window.matchMedia(SMALL);

    /* Primeiro toque, primeiro scroll ou primeira tecla: tenta outra vez e
       desarma-se. Um `play()` dentro de um gesto conta como intenção do
       utilizador e passa por cima da poupança de energia do iOS, que é o
       único estado em que um vídeo mudo e inline é recusado.

       Declarado como `const` e não como `function`: uma função içada perde
       o estreitamento de tipo do `video` que o guarda acima garantiu. */
    let armado = false;

    const armarGesto = () => {
      if (armado) return;
      armado = true;

      const eventos = ["pointerdown", "touchstart", "keydown", "scroll"] as const;

      const desarmar = () => {
        armado = false;
        for (const nome of eventos) window.removeEventListener(nome, tentar);
      };

      const tentar = () => {
        desarmar();
        video.muted = true;
        void video.play().catch(() => {
          /* recusado outra vez: fica o poster, que é um frame do próprio
             filme e por isso não se lê como erro */
        });
      };

      for (const nome of eventos) {
        window.addEventListener(nome, tentar, { once: true, passive: true });
      }
    };

    const sync = () => {
      /* Antes de tudo: em iOS um vídeo que não esteja mudo NO MOMENTO do
         play é recusado, e o React não escreve o atributo `muted` no HTML
         do servidor. Por isso o mudo põe-se aqui, sempre. */
      video.muted = true;
      video.defaultMuted = true;
      if (paused()) {
        video.pause();
        return;
      }
      void video.play().catch((erro: DOMException) => {
        /* O iOS recusa o arranque automático em MODO DE POUPANÇA DE
           ENERGIA, mesmo com o vídeo mudo e inline. Nesse estado, a única
           coisa que o convence é um gesto do utilizador, e é isso que o
           `armarGesto` abaixo apanha.

           A razão vai para a consola porque o servidor de desenvolvimento
           do Next reencaminha as mensagens do browser para o terminal: é
           assim que se vê, de cá, porque é que um telemóvel recusou. */
        console.warn(
          `[fishify] o vídeo do hero não arrancou sozinho: ${erro.name}, ${erro.message}`
        );
        armarGesto();
      });
    };

    const pickSource = () => {
      const wantsSmall = small.matches;
      const hasSmall = video.currentSrc.includes("hero-sm");
      if (wantsSmall === hasSmall) return;
      video.src = wantsSmall ? SMALL_SRC : FULL_SRC;
      video.load();
    };

    const onChange = () => {
      pickSource();
      sync();
    };

    /* O VÍDEO PARA QUANDO SAI DO ECRÃ E VOLTA A ANDAR QUANDO REGRESSA.

       Sem isto, descer o site todo e voltar ao topo dava com o vídeo
       congelado: o iOS suspende a descodificação de um vídeo que está há
       muito fora de vista e não o retoma sozinho ao voltar. E além de
       resolver isso, poupa bateria enquanto ninguém o está a ver.

       Só o `visibilitychange` não chegava: esse cobre a app em segundo
       plano, não o elemento fora do ecrã. */
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return;
        if (entrada.isIntersecting) sync();
        else video.pause();
      },
      { threshold: 0.01 }
    );
    observador.observe(video);

    sync();
    /* O `canplay` cobre o caso de o efeito correr antes de haver dados:
       aí o primeiro play() falha por razões que não são de política. */
    video.addEventListener("canplay", sync);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", onChange);
    reducedData.addEventListener("change", onChange);
    small.addEventListener("change", onChange);

    return () => {
      observador.disconnect();
      video.removeEventListener("canplay", sync);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", onChange);
      reducedData.removeEventListener("change", onChange);
      small.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        className="hero__video"
        poster="/img/hero-poster.webp"
        /* Igual ao site do Tomás Marques, onde isto está provado em iOS:
           `muted` + `playsInline` + `preload="auto"`, e é o efeito que
           chama o play() depois de garantir o mudo. SEM `autoPlay`: o
           atributo sozinho não convence o iOS (o React nem sequer escreve
           o `muted` no HTML do servidor) e o que aparecia era o botão de
           play por cima do poster. */
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      >
        {/* o pequeno vem primeiro: o primeiro <source> cujo media bate ganha */}
        <source src={SMALL_SRC} type="video/mp4" media={SMALL} />
        <source src={FULL_SRC} type="video/mp4" />
      </video>
      <div className="hero__veil" aria-hidden="true" />
    </>
  );
}
