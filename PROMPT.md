# PROMPT.md — Prompt de arranque (primera sesión de construcción)

> Pega esto en Claude Code, en la raíz del repo `davidmorrom.github.io`, con los
> archivos de `docs/`, `CLAUDE.md`, etc. ya colocados. Es el arranque de la PRIMERA
> construcción real del portfolio.

---

```
Vas a construir mi portfolio personal. Antes de escribir una sola línea de código,
lee y asume como contexto estos archivos del repo:

- CLAUDE.md            (reglas duras del proyecto — son innegociables)
- docs/DESIGN.md       (dirección de diseño, paleta, tipografía, animaciones)
- docs/STRUCTURE.md    (secciones del sitio y orden)
- docs/CONTENT.md      (TODOS los textos aprobados — no inventes contenido)
- docs/PROJECTS.md     (fichas de los 3 proyectos, con notas de privacidad)

Reglas que no puedes romper (resumen, el detalle está en CLAUDE.md):
1. Sitio ESTÁTICO PURO: HTML + CSS + JS vanilla. Sin build, sin frameworks, sin
   bundler. Debe servirse tal cual en GitHub Pages y funcionar abriendo index.html.
   Micro-librerías por CDN permitidas (p.ej. Lenis para smooth scroll) con mesura.
2. Rendimiento y accesibilidad de verdad: animaciones CSS + IntersectionObserver,
   imágenes lazy, semántica correcta, navegación por teclado, y respeta
   prefers-reduced-motion (desactiva parallax/animaciones).
3. Contacto = botón a LinkedIn. SIN email visible, SIN formulario.
4. No inventes datos. Si falta algo, déjalo como TODO: visible y pregúntame.
5. Estética: expresiva (tipografía gigante, scroll animado, hovers, gradientes) pero
   aplicada a contenido técnico serio. NADA de estética terminal/consola.

Cómo quiero que trabajes en esta primera sesión:

PASO 1 — Plan. Antes de codear, dame un plan corto: qué fuentes vas a usar (display +
cuerpo, según DESIGN.md), confirmación de la paleta, qué librería de scroll (si alguna)
y la lista de secciones con su orden. Espera mi OK.

PASO 2 — Esqueleto. Monta index.html con la estructura semántica completa de todas las
secciones (de STRUCTURE.md) y el contenido real de CONTENT.md y PROJECTS.md, todavía
con estilos mínimos. Quiero ver que el contenido está completo y correcto antes del
diseño. Enséñamelo.

PASO 3 — Diseño visual. Aplica la dirección de DESIGN.md: tipografía protagonista,
paleta oscura + gradiente distintivo, layout con carácter (asimetría, espacio
negativo). Hazlo sección a sección, empezando por el hero. Para CADA sección, párate y
enséñame antes de seguir a la siguiente.

PASO 4 — Animación. Una vez aprobado el diseño estático: reveal del hero al cargar,
animaciones al scroll, parallax sutil, hovers de las cards de proyecto. Con
prefers-reduced-motion respetado.

PASO 5 — Pulido. Responsive (prueba a 380px), accesibilidad (contraste, teclado, alt),
rendimiento (lazy-load, peso de fuentes), favicon y metadatos (title, description,
Open Graph para que se vea bien al compartir en LinkedIn).

NO hagas commit ni push tú: cuando una fase esté lista y yo dé el OK, yo despliego con
git. Trabaja por fases, enséñame el resultado al final de cada una, y pregunta siempre
que un dato no esté en los docs. Empieza por el PASO 1.
```

---

## Notas para mí (David), no para pegar

- Recordar tener `docs/`, `CLAUDE.md` y este `PROMPT.md` ya en el repo antes de lanzar.
- Si Claude Code propone un build/framework, recordarle la regla 1 (estático puro).
- Decisiones que aún puedo cambiar en construcción: fuentes concretas y matices de la
  paleta. El resto (estructura, contenido, privacidad) está cerrado.
- Pendientes opcionales para más adelante: dominio propio, capturas reales de los
  proyectos, favicon/imagen OG definitiva, sección de blog si algún día apetece.
```
