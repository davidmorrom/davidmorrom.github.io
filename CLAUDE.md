# CLAUDE.md

> Memoria persistente del proyecto. Léelo al inicio de cada sesión antes de tocar nada.

## Qué es esto

Portfolio personal de **David Moreno Romero**, desarrollador y consultor tecnológico.
Sitio **estático puro** (HTML/CSS/JS vanilla), single-page con scroll, alojado en
**GitHub Pages** como *user page* (se sirve en la raíz del dominio).

- **URL en producción:** https://davidmorrom.github.io
- **Repo:** `git@github.com:davidmorrom/davidmorrom.github.io.git` (rama `main`)
- **Carpeta local:** `~/dev/davidmoreno.github.io` (el nombre de carpeta tiene un typo
  histórico "davidmoreno"; NO afecta a git, el remote es correcto)

## Reglas duras (no negociables)

1. **Sin build, sin frameworks, sin bundler.** HTML + CSS + JS vanilla. El sitio debe
   funcionar abriendo `index.html` directamente y servirse tal cual en GitHub Pages.
   Permitido: micro-librerías por CDN o como archivo local (p.ej. Lenis para smooth
   scroll). NO React, NO Vite, NO Next, NO Tailwind CLI, NO pasos de compilación.
2. **Rendimiento primero.** El sitio debe cargar rápido. Animaciones con CSS y
   `IntersectionObserver`; evitar librerías pesadas. Lazy-load de imágenes.
3. **Accesibilidad real.** Semántica HTML correcta, contraste suficiente, navegación
   por teclado, `prefers-reduced-motion` respetado (las animaciones se desactivan).
4. **Responsive de verdad.** Mobile-first. Probar en viewport estrecho (~380px).
5. **Sin datos de contacto expuestos.** NO email visible, NO formulario. El contacto
   es un botón a LinkedIn. (Decisión tomada por el dueño del proyecto.)
6. **Honestidad en los textos.** Tono "vendo bien pero sin inventar". No inflar
   títulos ni certificaciones. Ver `docs/CONTENT.md` para el fraseo aprobado.
7. **No inventes contenido.** Si falta un dato, déjalo como `TODO:` visible en el
   código y pregunta. Nunca rellenes con datos falsos (fechas, métricas, enlaces).

## Flujo de trabajo y despliegue

- Editar en VS Code; previsualizar con Live Server.
- Desplegar: `git add . && git commit -m "..." && git push`. GitHub Pages publica en
  1-2 min desde `main` / raíz.
- Entorno local ya configurado: Node LTS vía fnm, git + SSH verificado, VS Code con
  Live Server y Prettier.

## Estado actual

Esqueleto vacío ya en el repo: `index.html` mínimo, `css/styles.css`, `js/main.js`,
`assets/`, `.gitignore`. **Aún sin contenido de portfolio.** Esta es la primera
construcción real.

## Dónde está cada cosa

- `docs/DESIGN.md` — dirección de diseño, paleta, tipografía, animaciones.
- `docs/CONTENT.md` — todos los textos aprobados (bio, experiencia, formación).
- `docs/PROJECTS.md` — fichas de los 3 proyectos destacados.
- `docs/STRUCTURE.md` — secciones del sitio y orden.
- `PROMPT.md` — el prompt de arranque para la primera sesión de construcción.

## Persona del dueño (para acertar el tono)

David es perfil híbrido: técnico real + visión de negocio. Autodidacta desde
adolescente, curioso, end-to-end, "puente entre negocio y código", metódico.
El portfolio debe transmitir eso SIN caer en clichés de "developer junior".
Referencias estéticas: portfolios de creativos (tipografía gigante, animación al
scroll, hovers, gradientes). **Descartado explícitamente: estética terminal/consola.**
