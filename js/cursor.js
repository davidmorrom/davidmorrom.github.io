/* ==========================================================================
   Cursor personalizado por sección — IIFE sin dependencias.

   - Solo escritorio con puntero fino: con (pointer: coarse) / (hover: none)
     o prefers-reduced-motion NO se inicializa nada (cursor del sistema).
   - El cursor nativo se oculta vía html.cursor-active (ver CSS), que se
     añade SOLO tras montar el elemento y recibir el primer mousemove:
     si este script falla, el cursor del sistema queda intacto.
   - El símbolo cambia según la sección visible (IntersectionObserver con
     banda central, mismo mecanismo que el scrollspy de Experiencia):
     cohete (#stack), llaves (#proyectos), pin (#experiencia), birrete
     (#formacion); cruz CAD en el resto (hero, sobre mí, contacto).
   - El elemento es decorativo: aria-hidden, pointer-events: none.
   - El visor de certificados es un <dialog> en el top layer (el cursor
     quedaría debajo de su backdrop): con html.cert-modal-lock el CSS
     restaura el cursor nativo y oculta el personalizado.
   ========================================================================== */
(function () {
  "use strict";

  var finePointer = window.matchMedia("(pointer: fine)").matches &&
                    window.matchMedia("(hover: hover)").matches;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer || reducedMotion.matches) return;

  /* --- Símbolos (trazo fino, tintados con currentColor vía CSS) --- */
  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">';
  var GLYPHS = {
    // Retícula CAD: cruz fina con hueco central + punto
    cross: SVG_OPEN +
      '<path d="M12 2.5v6M12 15.5v6M2.5 12h6M15.5 12h6"/>' +
      '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/></svg>',
    // Cohete (Stack / constelación)
    rocket: SVG_OPEN +
      '<path d="M12 2.7c2.7 2 4 5 4 8.1 0 1.5-.3 2.8-.8 3.9H8.8c-.5-1.1-.8-2.4-.8-3.9 0-3.1 1.3-6.1 4-8.1z"/>' +
      '<circle cx="12" cy="9.3" r="1.6"/>' +
      '<path d="M8.6 13.4l-2.4 3.9 3.1-1M15.4 13.4l2.4 3.9-3.1-1M12 17.2v3.6"/></svg>',
    // Llaves de código (Proyectos)
    braces: SVG_OPEN +
      '<path d="M9.5 3.5c-2 0-3 1-3 3v2.6c0 1.2-.6 2.2-2 2.9 1.4.7 2 1.7 2 2.9v2.6c0 2 1 3 3 3"/>' +
      '<path d="M14.5 3.5c2 0 3 1 3 3v2.6c0 1.2.6 2.2 2 2.9-1.4.7-2 1.7-2 2.9v2.6c0 2-1 3-3 3"/></svg>',
    // Pin / marcador (Experiencia)
    pin: SVG_OPEN +
      '<path d="M12 21.4c-3.8-3.7-5.7-6.9-5.7-9.7a5.7 5.7 0 1 1 11.4 0c0 2.8-1.9 6-5.7 9.7z"/>' +
      '<circle cx="12" cy="11.4" r="2"/></svg>',
    // Birrete (Formación)
    cap: SVG_OPEN +
      '<path d="M2.5 9.3L12 5l9.5 4.3L12 13.6 2.5 9.3z"/>' +
      '<path d="M6.5 11.3v4c0 1 2.6 2.2 5.5 2.2s5.5-1.2 5.5-2.2v-4"/>' +
      '<path d="M21.5 9.3v4.4"/></svg>'
  };

  var SECTION_GLYPH = {
    stack: "rocket",
    proyectos: "braces",
    experiencia: "pin",
    formacion: "cap"
  };

  /* --- Montaje (decorativo: aria-hidden + pointer-events: none en CSS) --- */
  var cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.dataset.glyph = "cross";
  var inner = '<span class="cursor-glyphs">';
  Object.keys(GLYPHS).forEach(function (name) {
    inner += '<span class="cursor-glyph" data-name="' + name + '">' + GLYPHS[name] + "</span>";
  });
  cursor.innerHTML = inner + "</span>";
  document.body.appendChild(cursor);

  /* --- Seguimiento: translate3d dentro de rAF, con easing corto --- */
  var targetX = -100, targetY = -100; // fuera de pantalla hasta el 1er movimiento
  var x = targetX, y = targetY;
  var rafId = null;
  var visible = false;
  var active = false; // html.cursor-active solo tras el primer mousemove

  function frame() {
    // seguimiento ceñido (sin lag perceptible) pero con suavizado
    x += (targetX - x) * 0.4;
    y += (targetY - y) * 0.4;
    cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    if (visible || Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
      rafId = requestAnimationFrame(frame);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function show() {
    if (!visible) {
      visible = true;
      cursor.classList.add("is-visible");
    }
    startLoop();
  }

  function hide() {
    visible = false;
    cursor.classList.remove("is-visible");
  }

  document.addEventListener("mousemove", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active) {
      // primer movimiento: confirma que el cursor custom funciona antes de
      // ocultar el nativo, y aparece ya en su sitio (sin viaje desde 0,0)
      active = true;
      x = targetX;
      y = targetY;
      document.documentElement.classList.add("cursor-active");
    }
    show();
  }, { passive: true });

  // Bordes de ventana y pérdida de foco: ocultar (sin cursor "fantasma")
  document.documentElement.addEventListener("mouseleave", hide);
  document.documentElement.addEventListener("mouseenter", function () {
    if (active) show();
  });
  window.addEventListener("blur", hide);

  /* --- Feedback sobre interactivos: el símbolo crece (ver CSS) --- */
  var INTERACTIVE = "a, button, input, select, textarea, summary, [role='button']";
  document.addEventListener("mouseover", function (event) {
    var hit = event.target.closest && event.target.closest(INTERACTIVE);
    cursor.classList.toggle("is-pointer", !!hit);
  }, { passive: true });

  /* --- Símbolo por sección: banda central del viewport (scrollspy) --- */
  var sections = [];
  Object.keys(SECTION_GLYPH).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sections.push(el);
  });

  if (sections.length && "IntersectionObserver" in window) {
    var inBand = {};

    var pickGlyph = function () {
      var glyph = "cross";
      sections.forEach(function (section) {
        if (inBand[section.id]) glyph = SECTION_GLYPH[section.id];
      });
      if (cursor.dataset.glyph !== glyph) cursor.dataset.glyph = glyph;
    };

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inBand[entry.target.id] = entry.isIntersecting;
      });
      pickGlyph();
    }, { rootMargin: "-45% 0px -45% 0px" });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* --- Si el usuario activa reduced-motion en caliente: desmontar todo --- */
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", function (event) {
      if (!event.matches) return;
      document.documentElement.classList.remove("cursor-active");
      hide();
      cursor.remove();
    });
  }
})();
