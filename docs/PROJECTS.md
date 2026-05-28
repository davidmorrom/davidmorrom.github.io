# PROJECTS.md — Proyectos destacados

> 4 proyectos. Orden en el sitio: **ORS Registro de Horario → SOMA → Sanea → App
> Renovación de Dispositivos (Deloitte)**.
> Dos productos personales (SOMA, Sanea) y dos proyectos profesionales: Registro de
> Horario (@ ORS) y la app de Deloitte (también referenciada como bullet en
> CONTENT.md → Deloitte).
> Para cada uno: nombre, una línea de gancho, qué resuelve, stack (chips), estado,
> y el "¿Por qué?". Mantener el tono equilibrado. Respetar las notas de privacidad.
>
> Sugerencia visual: etiqueta "Proyecto profesional" en los de entorno laboral (Registro
> de Horario y app de Deloitte) frente a los productos personales, sin que parezca de
> segunda.

---

## 1. ORS Registro de Horario

**Gancho:** SaaS multi-tenant de registro horario laboral con integridad criptográfica
demostrable, diseñado para el marco legal español.

**Qué resuelve:** Toda empresa en España está obligada por ley (art. 34.9 ET, RDL
8/2019) a registrar la jornada diaria, conservarla 4 años y tenerla disponible para la
Inspección de Trabajo. Muchas soluciones flojean en lo esencial: registros editables o
sin evidencia de no manipulación. Esta app lo resuelve con fichaje **append-only**
encadenado por hash SHA-256 y cierre diario sellado por una Autoridad de Sellado de
Tiempo (TSA RFC 3161), de modo que se puede **probar ante la Inspección** que ningún
registro se ha alterado. Tres superficies: web de escritorio (RRHH), PWA móvil
(empleado, con modo offline) y kiosco táctil (PIN/NFC). Incluye turnos, cálculo de
horas, ausencias con aprobación, portal para el inspector y exportación oficial
(PDF firmado + CSV con hashes).

**Stack:** Node.js 22 · NestJS · Prisma · PostgreSQL 16 (RLS multi-tenant) · Redis ·
BullMQ · Next.js 15 · React 19 · Tailwind · TanStack Query · PWA offline · SHA-256
sobre JSON canonicalizado (RFC 8785) · TSA RFC 3161 · AES-256-GCM · Docker · Hetzner ·
Grafana/Loki/Prometheus · CI/CD GitHub Actions · Vitest/Playwright/k6 · Turborepo +
pnpm (TypeScript).

**Estado:** En fase final de hardening pre-producción (núcleo construido y validado;
pendientes los gates de seguridad y cumplimiento antes del go-live). *No decir que ya
está en producción hasta que lo esté.*

**Porqué:** Producto propio de ORS para un dolor real de su mercado (registro horario
fiable y no manipulable), en modelo marca blanca. Anticipa el Real Decreto de Registro
de Jornada en tramitación.

**Por qué impresiona (para el dueño, no para publicar literal):** une dominio legal +
implementación criptográfica + stack de producción maduro. Es el mejor puente entre su
experiencia de consultoría y su capacidad de ingeniería.

---

## 2. SOMA

**Gancho:** App personal multiplataforma de optimización de salud: centraliza datos
dispersos de wearables y analíticas en un score diario tipo Whoop, con análisis por IA.

**Qué resuelve:** Datos de salud repartidos en muchas apps (wearables, PDFs de
analíticas, registros manuales) sin punto de consolidación ni correlación. SOMA los
unifica y los convierte en un score compuesto (0–100) ponderando varios pilares
(sueño, actividad, adherencia, composición corporal, tensión). Parsea analíticas en
PDF, automatiza el tracking y usa IA para detectar correlaciones y lanzar alertas
proactivas. 10 módulos operativos + un sistema propio de import/export (SOMA-DIS) en
JSON/CSV con validación por schema y upsert por clave natural.

**Stack:** React Native (Expo) · React (web) · Turborepo (monorepo, componentes
compartidos) · Supabase (PostgreSQL + Auth + Storage + Realtime) · Row Level Security
desde día 1 · Health Connect · IA (Llama 3 / Gemini) · Expo Notifications + Edge
Functions · pdf.js · arquitectura offline-first. Toda la infra por ≤5 €/mes sobre free
tiers.

**Estado:** En uso. App funcional con sus módulos operativos.

**Porqué:** Necesidad propia + vehículo de aprendizaje de un stack (React Native +
Supabase) fuera de su terreno habitual (.NET/Node/SQL Server).

> PRIVACIDAD — IMPORTANTE: SOMA contiene datos de salud personales del dueño. En el
> portfolio, **enfatizar arquitectura y decisiones técnicas** (RLS día 1, offline-first,
> control de costes, integración de wearables, IA con propósito). Ser **discreto con el
> detalle clínico personal**: presentarla como "app de salud / biohacking" a nivel
> producto, SIN listar medicación, dosis ni datos médicos concretos del dueño.

---

## 3. Sanea

**Gancho:** App de gestión financiera personal que reintroduce, por diseño, la fricción
de gastar que las tarjetas de crédito eliminan.

**Qué resuelve:** Reto de diseño de producto: las tarjetas y los fraccionamientos
eliminan el "dolor" de gastar y favorecen el ciclo de deuda. Sanea lo combate con un
sistema de **sobres digitales** (la nómina se reparte automáticamente en categorías y
cada gasto descuenta en tiempo real) y **fricción intencional** (cuando un sobre se
vacía, exige confirmación explícita antes de seguir). Añade módulo de deuda con
calculadora de amortización (avalancha vs bola de nieve) que muestra fecha de libertad
financiera y coste real en intereses, patrimonio neto en tiempo real, importación de
extractos CSV con deduplicación, alertas de patrones y evolución histórica con
exportación a PDF. Datos 100% locales, candado biométrico + PIN, backup cifrado
AES-256-GCM.

**Stack:** React Native + Expo SDK 52 · TypeScript strict · Expo Router · SQLite
(`expo-sqlite`) + Drizzle ORM · Zustand + React Query · `decimal.js` (dinero en
enteros/céntimos, nunca floats) · `react-hook-form` + `zod` · `papaparse` ·
`@noble/ciphers` + `@noble/hashes` (AES-256-GCM) · `react-native-svg` · EAS Build.

**Estado:** En uso activo (APK firmado en dispositivo Android; funcionalidad core
completa).

**Porqué:** Una idea/encargo: resolver un problema concreto de UX financiera —cómo
crear el hábito y la fricción correctos sin conectar con el banco ni ceder datos a
terceros.

> PRIVACIDAD — IMPORTANTE: presentar como **reto de diseño de producto/UX**, en tercera
> persona neutra. NO sugerir que responde a una situación personal de deuda del dueño.
> El ángulo es intelectual: el problema y las decisiones técnicas (decimal.js para
> dinero, datos locales, cifrado), no la motivación personal.

---

## 4. App de Renovación de Dispositivos Corporativos (Deloitte)

**Gancho:** Aplicación interna end-to-end, desarrollada en Power Apps, para gestionar
la renovación del parque de iPhone corporativos por fases.

**Qué resuelve:** Automatiza un proceso logístico que de otro modo sería manual y
propenso a errores: la renovación de dispositivos móviles corporativos (campaña del
iPhone 17), desplegada por fases según el terminal previo de cada empleado. La app
identifica al usuario por su cuenta de Microsoft, cruza su identidad contra unos datos
maestros en SharePoint para determinar qué terminal le corresponde, y aplica
validación condicional: si no hay dispositivo asignado, el flujo no avanza. El empleado
elige renovar o devolver el dispositivo y si necesita soporte de carga inalámbrica;
todo queda registrado y se consolida para el proceso de aprovisionamiento de hardware.
Finalmente, la app ofrece la reserva de cita —según la oficina del empleado— para
recoger el nuevo dispositivo y entregar el antiguo.

**Stack:** Microsoft Power Apps · Power Platform · SharePoint (listas como datos
maestros y registro) · integración con identidad de Microsoft 365 · exportación a
Excel para el flujo de aprovisionamiento.

**Estado:** Desarrollado y entregado durante la etapa en Deloitte. Diseñado para
despliegue por fases (primero un grupo de usuarios, luego el resto).

**Porqué:** Necesidad real de la organización: orquestar una renovación masiva de
dispositivos de forma controlada, con validación de elegibilidad y reserva de citas,
sin gestión manual. Demuestra desarrollo integral de una herramienta interna con lógica
de negocio real (autenticación, cruce de datos, validación condicional, flujo de
decisiones y reserva).

> CONFIDENCIALIDAD: se puede nombrar Deloitte y el modelo (iPhone 17). EVITAR en público
> datos operativos internos: nombre del broker/proveedor de hardware concreto, número
> real de empleados, o estructura interna de oficinas. Describir el flujo y la lógica,
> no los datos sensibles de la empresa.

---

## Hilo común (para la intro de la sección)

Los cuatro proyectos comparten ADN: **arquitectura cuidada, privacidad por diseño, e
IA/automatización con propósito.** Van del producto personal (SOMA, Sanea) al proyecto
profesional: un SaaS comercial con cumplimiento legal y criptografía (Registro de
Horario @ ORS) y herramientas internas en entorno corporativo (app de Deloitte). No son
proyectos sueltos: muestran un patrón —un desarrollador que construye productos
completos de principio a fin—.
