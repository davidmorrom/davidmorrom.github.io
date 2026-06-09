/* ==========================================================================
   Portfolio — David Moreno Romero
   JS base sin dependencias. La constelación 3D vive en js/constellation.js
   (módulo ES con Three.js) y la coreografía de scroll en js/animations.js
   (GSAP + Lenis). Cada módulo se autoanula si sus elementos no existen.
   ========================================================================== */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------------
     Cabecera: estado "scrolled" para marcar el borde inferior
     ------------------------------------------------------------------------ */
  var header = document.querySelector(".site-header");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  if (header) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------------
     Navegación móvil
     ------------------------------------------------------------------------ */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  function closeMenu() {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navLinks.classList.toggle("is-open", !open);
    });

    // Cerrar al elegir un destino o con Escape
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Watchdog de la constelación 3D: si js/constellation.js no llegó a
     inicializar (CDN caído, WebGL no disponible), se muestra la lista
     accesible en su lugar (.is-failed, ver CSS).
     ------------------------------------------------------------------------ */
  var constellationRoot = document.querySelector("[data-constellation]");

  function checkConstellation() {
    if (!constellationRoot) return;
    if (constellationRoot.dataset.ready === "true") return;
    if (getComputedStyle(constellationRoot).display === "none") return;
    constellationRoot.classList.add("is-failed");
  }

  if (constellationRoot) {
    window.addEventListener("load", function () {
      setTimeout(checkConstellation, 2000);
    });

    var constellationResizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(constellationResizeTimer);
      constellationResizeTimer = setTimeout(checkConstellation, 2000);
    });
  }

  /* ------------------------------------------------------------------------
     Experiencia: scrollspy del índice del expediente.
     Marca con aria-current la entrada visible (estilo: borde + negrita,
     no solo color).
     ------------------------------------------------------------------------ */
  var dossierLinks = document.querySelectorAll(".dossier-link");
  var dossierEntries = document.querySelectorAll(".dossier-entry");

  if (dossierLinks.length && dossierEntries.length && "IntersectionObserver" in window) {
    var setCurrent = function (id) {
      dossierLinks.forEach(function (link) {
        var matches = link.getAttribute("href") === "#" + id;
        if (matches) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };

    var entryObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    dossierEntries.forEach(function (entry) { entryObserver.observe(entry); });
  }

  /* ------------------------------------------------------------------------
     Imágenes opcionales (retrato del hero y logos de formación): si el
     archivo aún no existe, se oculta la imagen rota y queda el fallback.
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".portrait-img, .logo-img").forEach(function (img) {
    var fallback = img.parentElement.querySelector(".portrait-fallback, .logo-fallback");

    function markMissing() {
      img.classList.add("is-missing");
    }

    // Con la imagen cargada se oculta el texto de reserva (los logos con
    // transparencia dejarían verlo detrás)
    function markLoaded() {
      if (fallback) fallback.classList.add("is-hidden");
    }

    img.addEventListener("error", markMissing);
    img.addEventListener("load", markLoaded);
    // Por si la carga o el error ocurrieron antes de registrar los listeners
    if (img.complete) {
      if (img.naturalWidth === 0) markMissing();
      else markLoaded();
    }
  });

  /* ------------------------------------------------------------------------
     Cifras de "Sobre mí": contador animado al entrar en viewport.
     Con reduced-motion no se anima nada (el número final ya está en el HTML).
     ------------------------------------------------------------------------ */
  var statNumbers = document.querySelectorAll(".stat-number[data-count]");

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var duration = 900;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length && !prefersReducedMotion.matches && "IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { threshold: 0.6 });

    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* ------------------------------------------------------------------------
     Footer: año automático
     ------------------------------------------------------------------------ */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
