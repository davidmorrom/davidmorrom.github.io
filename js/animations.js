/* ==========================================================================
   Coreografía de animaciones — GSAP + ScrollTrigger + Lenis (CDN, sin build)

   Principios:
   - Con prefers-reduced-motion no se ejecuta nada.
   - Si los CDN fallan, no pasa nada: el sitio es 100% visible por defecto
     (todas las animaciones parten del estado final con .from / fromTo).
   - Los elementos con animación CSS propia (badges flotantes, portátil)
     solo se animan en opacidad para no pelear con sus keyframes.
   ========================================================================== */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------------------------------------
     Lenis: scroll suave con inercia, integrado con ScrollTrigger
     ------------------------------------------------------------------------ */
  if (window.Lenis) {
    var lenis = new Lenis({ duration: 1.1 });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Anclas internas pasan por Lenis (compensando la cabecera sticky)
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) {
          event.preventDefault();
          lenis.scrollTo(id, { offset: -80 });
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Entrada del hero
     ------------------------------------------------------------------------ */
  var intro = gsap.timeline({ defaults: { ease: "power3.out" } });

  intro
    .from(".hero-eyebrow, .hero-title, .hero-role, .hero-lead, .hero-actions", {
      y: 28, opacity: 0, duration: 0.7, stagger: 0.09
    })
    .from(".portrait-halo", {
      scale: 0.86, opacity: 0, duration: 0.8, ease: "power2.out"
    }, 0.15)
    // badges y portátil tienen keyframes CSS propios (flotación):
    // aquí solo opacidad para no tocar su transform
    .from(".hero-badge", { opacity: 0, duration: 0.5, stagger: 0.09 }, 0.55)
    .from(".hero-laptop", { opacity: 0, duration: 0.5 }, 0.8)
    .from(".scroll-cue", { opacity: 0, duration: 0.5 }, 1);

  /* ------------------------------------------------------------------------
     Reveals al hacer scroll
     ------------------------------------------------------------------------ */
  gsap.utils.toArray(".section-head").forEach(function (head) {
    gsap.from(head, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: head, start: "top 84%", once: true }
    });
  });

  gsap.from(".constellation-sky", {
    opacity: 0,
    scale: 0.975,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: { trigger: "#stack", start: "top 75%", once: true }
  });

  [".about-points li", ".project-card", ".dossier-entry", ".education-card", ".tech-item"]
    .forEach(function (selector) {
      var elements = gsap.utils.toArray(selector);
      if (!elements.length) return;
      ScrollTrigger.batch(elements, {
        start: "top 88%",
        once: true,
        onEnter: function (batch) {
          gsap.fromTo(batch,
            { y: 34, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out", overwrite: true }
          );
        }
      });
    });

  gsap.from(".contact-card", {
    y: 30,
    opacity: 0,
    scale: 0.98,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: { trigger: ".site-footer", start: "top 85%", once: true }
  });

  /* ------------------------------------------------------------------------
     Detalles ligados al scroll (scrub)
     ------------------------------------------------------------------------ */

  // El engranaje de Formación gira con el scroll en lugar de en bucle
  var gear = document.querySelector(".deco-gear .gear-spin");
  if (gear) {
    gear.closest(".deco-gear").classList.add("js-scrub");
    gsap.to(gear, {
      rotation: 360,
      svgOrigin: "60 60",
      ease: "none",
      scrollTrigger: {
        trigger: "#formacion",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  // Parallax sutil del SVG de nodos en Proyectos
  var nodesDeco = document.querySelector(".deco-nodes");
  if (nodesDeco) {
    gsap.fromTo(nodesDeco, { y: 24 }, {
      y: -24,
      ease: "none",
      scrollTrigger: {
        trigger: "#proyectos",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }

})();
