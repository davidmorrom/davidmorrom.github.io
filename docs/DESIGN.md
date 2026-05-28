# DESIGN.md — Dirección de diseño

## Concepto

Un portfolio que parece de **estudio creativo** pero respira **rigor de ingeniería**.
El reto central: el dueño es perfil técnico (ERP, integraciones, criptografía), pero
su gusto visual va por lo expresivo (tipografía gigante, scroll animado, gradientes).
La síntesis: **ejecución visual de creativo aplicada a contenido técnico serio.**
Expresivo en la forma, riguroso en el fondo.

Diferenciador a recordar: *"un developer que construye productos completos —de una
app de salud a un SaaS con cumplimiento legal y criptografía— fuera y dentro de su
trabajo."* El diseño debe dejar que el contenido técnico brille, no taparlo.

## Paleta propuesta (justificada)

**Dirección: oscuro con gradientes, pero con criterio — no el típico morado sobre
blanco ni el azul dev genérico.**

Por qué oscuro: las referencias que más pesan (nivora, daofor, stabondar) son oscuras
o de alto contraste; el oscuro da dramatismo a la tipografía gigante y hace que los
gradientes y la profundidad luzcan. Encaja con perfil técnico sin caer en "consola".

Por qué estos colores concretos (evitar el cliché de gradiente morado):

```
--bg-void:      #0a0b0f   /* casi negro, ligeramente frío */
--bg-raised:    #13151c   /* superficies elevadas (cards) */
--ink:          #f4f5f7   /* texto principal */
--ink-muted:    #9aa0ad   /* texto secundario */
--line:         #23262f   /* bordes sutiles */

/* Acento: gradiente cálido→frío que cruza, distintivo y no genérico */
--accent-a:     #ff5e3a   /* coral/naranja cálido */
--accent-b:     #b14cff   /* violeta */
--accent-c:     #2de2c8   /* turquesa frío (acento de apoyo, usar poco) */
--grad-hero:    linear-gradient(115deg, #ff5e3a 0%, #b14cff 60%, #2de2c8 120%);
```

El gradiente coral→violeta→turquesa es cálido y memorable, se aleja del morado-sobre-
blanco prohibido por la guía de diseño, y conecta con el gusto del dueño por los
gradientes (daofor, nivora). Usar el gradiente con MODERACIÓN: en la tipografía del
hero, en algún borde/glow al hover, en líneas de acento. El resto, monocromo oscuro.

> Esta paleta es una propuesta de arranque. Si en construcción no convence, iterar
> manteniendo el principio: oscuro + UN gradiente distintivo + mucho monocromo.

## Tipografía

Seguir la guía `frontend-design`: NADA de Inter/Roboto/Arial/Space Grotesk.

- **Display (titulares gigantes):** una fuente con carácter y peso fuerte. Candidatas:
  *Clash Display*, *Sora*, *Hanken Grotesk* (variable), o una serif de contraste alto
  para el giro inesperado (*Fraunces*). Elegir UNA y comprometerse.
- **Cuerpo:** una grotesca legible y refinada distinta del display. Candidatas:
  *Hanken Grotesk*, *Geist*, *Satoshi*.
- Cargar por `@font-face` local o Google Fonts/Fontshare por CDN. Subsetting si es
  posible para rendimiento.
- La tipografía es PROTAGONISTA: el nombre y los titulares de sección deben ser
  grandes, con buen tracking negativo y line-height ajustado.

## Animación e interacción (los 4 pilares pedidos)

1. **Tipografía gigante animada** — reveal del nombre al cargar (stagger por
   palabra/letra, `animation-delay`). Titulares de sección que entran al hacer scroll.
2. **Animaciones al scroll / parallax** — `IntersectionObserver` para revelar bloques;
   parallax sutil en capas de fondo/gradiente. Considerar Lenis para smooth scroll
   (ligero, sin build). Nunca bloquear el scroll nativo de forma agresiva.
3. **Hovers e interacciones** — las cards de proyecto reaccionan (elevación, glow con
   el gradiente, desplazamiento sutil). Enlaces con subrayado animado. Cursor o
   estados que "sorprendan" sin recargar.
4. **Gradientes de color** — en el hero (texto o fondo mesh), en glows de hover, en
   separadores. Con moderación: dominante oscuro, acento de gradiente.

**Obligatorio:** respetar `prefers-reduced-motion: reduce` — desactivar parallax y
animaciones, dejar el contenido legible y estático.

## Layout

- Single-page, scroll vertical. Navegación fija o flotante con anclas a secciones.
- Romper la rejilla con intención: asimetría, solapamientos puntuales, espacio
  negativo generoso. NO un apilado aburrido de bloques centrados.
- Mobile-first. En móvil, simplificar parallax y reducir tamaños tipográficos.

## Qué EVITAR (de la guía frontend-design)

- Fuentes genéricas (Inter, Roboto, Arial, system, Space Grotesk).
- Gradiente morado sobre blanco (cliché AI).
- Layouts predecibles, componentes cookie-cutter.
- Estética terminal/consola (descartada por el dueño explícitamente).
