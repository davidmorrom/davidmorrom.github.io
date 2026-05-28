# Portfolio · David Moreno Romero

Sitio personal de **David Moreno Romero** — Developer & Tech Consultant.
Single-page estático (HTML/CSS/JS vanilla) alojado en **GitHub Pages**.

- **En producción:** https://davidmorrom.github.io
- **Repo:** `git@github.com:davidmorrom/davidmorrom.github.io.git` (`main`)
- **Tipo:** user page → se sirve en la raíz del dominio. Sin build.

---

## Cómo usar este paquete de arranque

Estos archivos son el **contexto y el plan** para que Claude Code construya el sitio.
No son el sitio en sí: son las instrucciones, el contenido y las reglas.

1. Copia estos archivos a la raíz del repo del portfolio (junto al esqueleto que ya
   tienes: `index.html`, `css/`, `js/`, `assets/`).
2. Abre Claude Code en esa carpeta.
3. Pega el prompt de `PROMPT.md` para arrancar la primera construcción.
4. Tú haces de project manager: revisas cada fase y das el OK. Claude Code construye;
   tú despliegas con `git add . && git commit && git push`.

## Mapa de archivos

| Archivo | Para qué |
|---|---|
| `CLAUDE.md` | Memoria persistente del proyecto. Claude Code lo lee cada sesión. Reglas duras. |
| `PROMPT.md` | El prompt de arranque de la primera construcción, por fases. |
| `docs/DESIGN.md` | Dirección de diseño: paleta (justificada), tipografía, animaciones, qué evitar. |
| `docs/STRUCTURE.md` | Las 7 secciones del sitio y su orden. |
| `docs/CONTENT.md` | Todos los textos aprobados (bio, experiencia, formación, certs). Verificables. |
| `docs/PROJECTS.md` | Fichas de los 3 proyectos + notas de privacidad. |

## Reglas duras (resumen)

- **Estático puro**: HTML/CSS/JS vanilla, sin build ni frameworks.
- **Rendimiento + accesibilidad** de verdad; respeta `prefers-reduced-motion`.
- **Contacto = botón a LinkedIn**. Sin email, sin formulario.
- **Honestidad**: vender bien sin inventar. Nada de títulos/certs inflados.
- **No inventar contenido**: si falta un dato, `TODO:` + preguntar.
- **Sin estética terminal** (descartada). Sí: tipografía gigante, scroll animado,
  hovers, gradientes — sobre contenido técnico serio.

## Decisiones cerradas

- Identidad: David Moreno Romero · Developer & Tech Consultant · Madrid.
- Enlaces: LinkedIn + GitHub. Contacto vía LinkedIn.
- Estructura: single-page, 7 secciones (ver `docs/STRUCTURE.md`).
- Diseño: oscuro + gradiente distintivo coral→violeta→turquesa (ver `docs/DESIGN.md`).
- Proyectos: ORS Registro de Horario, SOMA, Sanea.
- Tono: equilibrado y verificable.

## Decisiones abiertas (ajustables en construcción)

- Fuentes display y cuerpo concretas (candidatas en `docs/DESIGN.md`).
- Matices de la paleta.
- Pendientes futuros: dominio propio, capturas reales de proyectos, imagen Open Graph,
  posible blog.

## Stack del sitio

HTML5 · CSS3 (variables, grid, animaciones) · JavaScript vanilla (IntersectionObserver;
opcional Lenis para smooth scroll vía CDN). Sin dependencias de build.

## Despliegue

Editar en VS Code → previsualizar con Live Server → `git add . && git commit -m "…" &&
git push`. GitHub Pages publica desde `main` (raíz) en 1–2 min.
