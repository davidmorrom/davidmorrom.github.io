/* ==========================================================================
   Tech constellation 3D — Three.js (módulos ES desde CDN, sin build step)

   - Estrellas, líneas y halos viven en una escena WebGL.
   - Los nodos siguen siendo <button> reales (CSS2DRenderer) → accesibles
     con teclado y lector de pantalla, igual que la versión 2D.
   - Clic/Enter en un nodo: la cámara viaja de verdad hasta la estrella
     y se abre el panel con qué es / dónde.
   - Degradación: con prefers-reduced-motion o en móvil este módulo no se
     inicializa (CSS ya muestra la lista). Si WebGL o el CDN fallan, el
     watchdog de main.js añade .is-failed y aparece la lista accesible.
   ========================================================================== */
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const root = document.querySelector("[data-constellation]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let started = false;

function isVisible() {
  return root && getComputedStyle(root).display !== "none";
}

function tryInit() {
  if (started || reduceMotion || !isVisible()) return;
  started = true;
  try {
    build();
    root.dataset.ready = "true";
  } catch (err) {
    root.classList.add("is-failed");
  }
}

tryInit();
window.addEventListener("resize", tryInit, { passive: true });

function build() {
  const sky = root.querySelector(".constellation-sky");
  const panel = root.querySelector(".tech-panel");
  const panelTitle = root.querySelector(".tech-panel-title");
  const panelBody = root.querySelector(".tech-panel-body");
  const panelClose = root.querySelector(".tech-panel-close");

  /* --- Escena, cámara y renderers --- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  sky.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.classList.add("constellation-labels");
  sky.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  const HOME = new THREE.Vector3(0, 0, 46);
  const HOME_LOOK = new THREE.Vector3(0, 0, 0);
  camera.position.copy(HOME);
  const lookTarget = HOME_LOOK.clone();

  /* --- Campo de estrellas: dos capas con parpadeo por shader --- */
  function makeStars(count, spread, depth, size) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62;
      positions[i * 3 + 2] = 6 - Math.random() * depth;
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = size * (0.5 + Math.random());
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: [
        "attribute float aPhase;",
        "attribute float aSize;",
        "uniform float uTime;",
        "varying float vAlpha;",
        "void main() {",
        "  vAlpha = 0.45 + 0.45 * sin(uTime * 0.9 + aPhase);",
        "  vec4 mv = modelViewMatrix * vec4(position, 1.0);",
        "  gl_PointSize = aSize * (140.0 / -mv.z);",
        "  gl_Position = projectionMatrix * mv;",
        "}"
      ].join("\n"),
      fragmentShader: [
        "varying float vAlpha;",
        "void main() {",
        "  float d = length(gl_PointCoord - 0.5);",
        "  float a = smoothstep(0.5, 0.0, d) * vAlpha;",
        // blanco-cian (firma de la paleta cobalto+cian; el cielo es oscuro
        // en ambos temas, ver tokens --sky-* en css/styles.css)
        "  gl_FragColor = vec4(0.55, 0.93, 0.90, a);",
        "}"
      ].join("\n")
    });

    return new THREE.Points(geometry, material);
  }

  const starsNear = makeStars(240, 95, 70, 2.4);
  const starsFar = makeStars(420, 150, 130, 1.5);
  scene.add(starsNear, starsFar);

  /* --- Nodos: posición 3D + halo (sprite) + botón accesible (CSS2D) --- */
  function glowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    // cian #22e0d6 (mismo valor que --star en css/styles.css)
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.25, "rgba(34, 224, 214, 0.85)");
    grad.addColorStop(1, "rgba(34, 224, 214, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  const haloTexture = glowTexture();
  // Más separación entre estrellas: más amplitud en x/y y menos profundidad
  // (la z lejana comprime las posiciones hacia el centro por perspectiva)
  const SPREAD_X = 36;
  const SPREAD_Y = 22;
  const SPREAD_Z = 12;
  const items = document.querySelectorAll("#stack .tech-item");
  const nodes = [];

  items.forEach((item, i) => {
    const name = item.querySelector(".tech-name").textContent;
    // x/y vienen de la lista accesible (en %); z se reparte de forma
    // determinista para que cada estrella tenga su profundidad
    const pos = new THREE.Vector3(
      ((parseFloat(item.dataset.x) - 50) / 50) * SPREAD_X,
      -((parseFloat(item.dataset.y) - 50) / 50) * SPREAD_Y,
      (((i * 37) % 100) / 100 - 0.5) * SPREAD_Z
    );

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    halo.position.copy(pos);
    halo.scale.setScalar(2.6);
    scene.add(halo);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "tech-node";
    button.setAttribute("aria-haspopup", "dialog");
    button.innerHTML =
      '<span class="tech-node-dot" aria-hidden="true"></span>' +
      '<span class="tech-node-label">' + name + "</span>";

    const labelObj = new CSS2DObject(button);
    labelObj.position.copy(pos);
    scene.add(labelObj);

    const node = { item, pos, halo, button, labelObj, hoverScale: 2.6 };
    button.addEventListener("click", () => openPanel(node));
    button.addEventListener("mouseenter", () => { node.hoverScale = 4; });
    button.addEventListener("mouseleave", () => { node.hoverScale = 2.6; });
    button.addEventListener("focus", () => { node.hoverScale = 4; });
    button.addEventListener("blur", () => { node.hoverScale = 2.6; });
    nodes.push(node);
  });

  const byId = {};
  nodes.forEach(n => { byId[n.item.id] = n; });

  /* El botón es una columna dot+etiqueta, pero CSS2DRenderer lo ancla por su
     centro geométrico: el halo 3D quedaría desplazado media altura respecto
     al dot. Se corrige midiendo dónde cae el dot dentro del botón y usando
     ese punto como ancla (center). Requiere el botón ya maquetado en el DOM,
     por eso se llama tras el primer render y al cargar las fuentes. */
  function alignAnchors() {
    nodes.forEach(node => {
      const dot = node.button.querySelector(".tech-node-dot");
      const h = node.button.offsetHeight;
      if (!dot || !h) return;
      node.labelObj.center.set(0.5, (dot.offsetTop + dot.offsetHeight / 2) / h);
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignAnchors);
  }

  /* --- Líneas de constelación entre nodos conectados --- */
  const linePoints = [];
  nodes.forEach(node => {
    (node.item.dataset.connect || "").split(/\s+/).filter(Boolean).forEach(id => {
      if (byId[id]) linePoints.push(node.pos, byId[id].pos);
    });
  });
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(linePoints),
    new THREE.LineBasicMaterial({ color: 0x22e0d6, transparent: true, opacity: 0.22 })
  );
  scene.add(lines);

  /* --- Vuelo de cámara (tween propio, sin dependencias) --- */
  let mode = "home"; // home | flying | node
  let flight = null;

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function flyTo(toPos, toLook, duration, onDone) {
    flight = {
      t0: performance.now(),
      duration,
      fromPos: camera.position.clone(),
      toPos: toPos.clone(),
      fromLook: lookTarget.clone(),
      toLook: toLook.clone(),
      onDone
    };
  }

  /* --- Parallax suave hacia el puntero (solo en reposo) --- */
  const pointer = { x: 0, y: 0 };
  sky.addEventListener("pointermove", event => {
    const rect = sky.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  });

  /* --- Panel (mismo contrato de accesibilidad que la versión 2D) --- */
  let lastFocused = null;
  let hideTimer = null;

  function openPanel(node) {
    if (mode !== "home") return;
    mode = "flying";
    lastFocused = node.button;

    const dir = new THREE.Vector3().subVectors(camera.position, node.pos).normalize();
    const dest = node.pos.clone().addScaledVector(dir, 8);

    flyTo(dest, node.pos, 850, () => {
      mode = "node";
      panelTitle.textContent = node.item.querySelector(".tech-name").textContent;
      panelBody.innerHTML =
        node.item.querySelector(".tech-what").outerHTML +
        node.item.querySelector(".tech-where").outerHTML;
      clearTimeout(hideTimer);
      panel.hidden = false;
      void panel.offsetWidth; // dispara la transición desde el estado inicial
      root.classList.add("is-open");
      panelClose.focus();
    });
  }

  function closePanel() {
    if (mode !== "node") return;
    mode = "flying";
    root.classList.remove("is-open");
    hideTimer = setTimeout(() => { panel.hidden = true; }, 420);
    flyTo(HOME, HOME_LOOK, 850, () => { mode = "home"; });
    if (lastFocused) lastFocused.focus();
  }

  panelClose.addEventListener("click", closePanel);
  panel.addEventListener("click", event => {
    if (event.target === panel) closePanel();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mode === "node") closePanel();
    // Mientras el panel está abierto, el foco se queda en su botón de cierre
    if (event.key === "Tab" && mode === "node") {
      event.preventDefault();
      panelClose.focus();
    }
  });

  /* --- Tamaño y bucle de render (pausado fuera de viewport) --- */
  function resize() {
    const w = sky.clientWidth;
    const h = sky.clientHeight;
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();

  let rafId = null;
  let inView = false;
  let anchorsAligned = false;

  function frame(now) {
    const t = now / 1000;
    starsNear.material.uniforms.uTime.value = t;
    starsFar.material.uniforms.uTime.value = t;
    starsFar.rotation.y += 0.00012;

    if (flight) {
      const p = Math.min((now - flight.t0) / flight.duration, 1);
      const e = easeInOut(p);
      camera.position.lerpVectors(flight.fromPos, flight.toPos, e);
      lookTarget.lerpVectors(flight.fromLook, flight.toLook, e);
      if (p === 1) {
        const done = flight.onDone;
        flight = null;
        if (done) done();
      }
    } else if (mode === "home") {
      camera.position.x += (pointer.x * 3 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 1.8 - camera.position.y) * 0.04;
    }
    camera.lookAt(lookTarget);

    nodes.forEach(node => {
      const target = node.hoverScale;
      node.halo.scale.x += (target - node.halo.scale.x) * 0.12;
      node.halo.scale.y = node.halo.scale.z = node.halo.scale.x;
    });

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    if (!anchorsAligned) {
      // primer render: los botones ya están en el DOM y se pueden medir
      anchorsAligned = true;
      alignAnchors();
    }
    rafId = requestAnimationFrame(frame);
  }

  function startLoop() {
    if (rafId === null && inView) rafId = requestAnimationFrame(frame);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) startLoop();
    else stopLoop();
  }, { rootMargin: "80px" }).observe(root);
}
