const imagenesSrc = [
  "img/bebe tiquita.jfif",
  "img/blusa asul.jpeg",
  "img/blusa negra.jpeg",
  "img/mi amor.jfif",
  "img/mi vida cel.jpeg",
  "img/mucha shishi.jfif",
  "img/ojitos 1.jpg",
  "img/ojitos 3.jpg"
];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mensajeEl = document.getElementById("mensaje");
const videoBeso = document.getElementById("videoBeso");
const planeta = document.getElementById("planeta");
const cartaEspecial = document.getElementById("cartaEspecial");

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const imagenes = [];
let cargadas = 0;

imagenesSrc.forEach((src) => {
  const img = new Image();
  img.src = src;
  img.onload = () => { cargadas++; if (cargadas === imagenesSrc.length) iniciar(); };
  img.onerror = () => { cargadas++; if (cargadas === imagenesSrc.length) iniciar(); };
  imagenes.push(img);
});

const textoCompleto = `eres una niña tan maravillosa, no se que haría sin ti, muchas gracias por llegar a mi vida y a enseñarme a amar, gracias por enseñarme que se siente ser amado y por estar contigo todo este tiempo, te amo y siempre te amare con toda mi alma por qué eres la mejor niña de todo el universo gracias por existir y gracias por todo lo que as hecho por mi todo este tiempo que hemos estado juntas, somos adolescentes pero espero pasar mucho tiempo a tu lado y ser felices para toda la vida, eres la mejor novia y la mejor mujer en todo tipo de aspectos, eres la niña más hermosa de todo este mundo, amo tu personalidad, amo tu forma de ser, amo tus chismes, amo tus labios amo tu pelo, amo tus ojos y amo tu sonrisa te amo con todos los defectos que dices tener aunque no, estoy demasiado orgulloso por ti por qué a pesar que tienes malos momentos sigues adelante sin importar que mal estés, estaré contigo para siempre si dios quiere, gracias por no irte de mi lado en mis peores momentos gracias mi amor te amo mucho por qué eres el amor de mi vida no te vallas nunca mi bebé te amo mi bebé hermosa 🫶🏼`;

let indiceTexto = 0;
let escribiendo = false;

function escribirTexto() {
  if (indiceTexto < textoCompleto.length) {
    mensajeEl.textContent = textoCompleto.substring(0, indiceTexto + 1);
    indiceTexto++;
    setTimeout(escribirTexto, 28);
  }
}

const TOTAL = 12;
const RADIO_FINAL = 400;
const ANCHO = 125;
const ALTO = 180;

let anguloGlobal = 0;
let camZ = 950;
let tiempo = 0;
let tarjetasVisibles = 1;
let fase = "abriendo";
let ultimoAñadido = 0;

class Petalo {
  constructor() { this.reset(true); }
  reset(inicio = false) {
    this.x = Math.random() * W;
    this.y = inicio ? Math.random() * H : -30;
    this.size = Math.random() * 10 + 5;
    this.vy = Math.random() * 1.4 + 0.6;
    this.vx = Math.random() * 1.2 - 0.6;
    this.rot = Math.random() * 360;
    this.rotV = Math.random() * 3 - 1.5;
    this.alpha = Math.random() * 0.5 + 0.4;
  }
  update() {
    this.y += this.vy;
    this.x += this.vx + Math.sin(this.y * 0.01) * 0.5;
    this.rot += this.rotV;
    if (this.y > H + 40) this.reset();
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot * Math.PI / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${325 + Math.random() * 25}, 90%, 68%)`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.3, this.size, 0, this.size * 0.5, this.size * 0.55);
    ctx.bezierCurveTo(0, this.size * 0.9, -this.size * 0.3, this.size * 0.4, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

const petalos = Array.from({ length: 50 }, () => new Petalo());

function proyectar(x, y, z) {
  const fov = 700;
  const scale = fov / (fov + z);
  return { x: W / 2 + x * scale, y: H / 2 + y * scale - 30, scale };
}

function dibujarTarjeta(media, x, y, z, esVideo = false) {
  const p = proyectar(x, y, z);
  if (p.scale < 0.12) return;
  const w = ANCHO * p.scale;
  const h = ALTO * p.scale;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.shadowColor = "rgba(255, 40, 120, 0.65)";
  ctx.shadowBlur = 22 * p.scale;
  ctx.fillStyle = "rgba(255, 170, 210, 0.9)";
  ctx.fillRect(-w / 2 - 2.5, -h / 2 - 2.5, w + 5, h + 5);

  if (esVideo && media && media.readyState >= 2) {
    ctx.drawImage(media, -w / 2, -h / 2, w, h);
  } else if (media && media.complete && media.naturalWidth > 0) {
    ctx.drawImage(media, -w / 2, -h / 2, w, h);
  } else {
    ctx.fillStyle = "#ff6699";
    ctx.fillRect(-w / 2, -h / 2, w, h);
  }
  ctx.restore();
}

function render() {
  tiempo += 0.016;
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, W, H);

  petalos.forEach(p => { p.update(); p.draw(); });

  if (fase === "abriendo") {
    if (tiempo - ultimoAñadido > 0.55 && tarjetasVisibles < TOTAL) {
      tarjetasVisibles++;
      ultimoAñadido = tiempo;
    }
    if (tarjetasVisibles >= TOTAL) fase = "girando";
  }

  if (fase === "girando") {
    anguloGlobal += 0.005;
    if (camZ > 260) camZ -= 1.1;

    if (!escribiendo) {
      escribiendo = true;
      mensajeEl.classList.add("visible");
      setTimeout(escribirTexto, 800);
    }
  }

  const progreso = tarjetasVisibles / TOTAL;
  const radioActual = RADIO_FINAL * Math.min(1, progreso * 1.15);

  const tarjetas = [];
  for (let i = 0; i < tarjetasVisibles; i++) {
    const ang = (i / TOTAL) * Math.PI * 2 + anguloGlobal;
    const x = Math.sin(ang) * radioActual;
    const z = Math.cos(ang) * radioActual + camZ;
    const y = Math.sin(tiempo * 1.5 + i) * 6;
    const esVideo = (i % TOTAL === 3);
    const media = esVideo ? videoBeso : imagenes[i % imagenes.length];
    tarjetas.push({ media, x, y, z, esVideo });
  }

  tarjetas.sort((a, b) => b.z - a.z);
  tarjetas.forEach(t => dibujarTarjeta(t.media, t.x, t.y, t.z, t.esVideo));

  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.translate(0, H * 0.73);
  ctx.scale(1, 0.22);
  tarjetas.forEach(t => dibujarTarjeta(t.media, t.x, t.y + 160, t.z + 40, t.esVideo));
  ctx.restore();
}

function iniciar() {
  if (videoBeso) {
    videoBeso.muted = true;
    videoBeso.play().catch(() => {});
  }

  const musica = document.getElementById("musica");
  if (musica) {
    musica.volume = 0.4;
    musica.play().catch(() => {
      document.body.addEventListener("click", () => {
        musica.play().catch(() => {});
        if (videoBeso) videoBeso.play().catch(() => {});
      }, { once: true });
    });
  }

  render();
}

if (cargadas === imagenesSrc.length) iniciar();

// ===== PLANETA + CARTA =====
let clicsPlaneta = 0;
let porcentajeActual = 0;
let intervaloCarga = null;

function crearCorazones() {
  for (let i = 0; i < 45; i++) {
    const corazon = document.createElement("div");
    corazon.className = "corazon";
    corazon.textContent = ["❤️", "💖", "💗", "💕", "💓"][Math.floor(Math.random() * 5)];
    corazon.style.left = (window.innerWidth - 120) + "px";
    corazon.style.top = "80px";

    const tx = (Math.random() - 0.5) * 600;
    const ty = (Math.random() - 0.3) * 500;
    const tx2 = tx + (Math.random() - 0.5) * 300;
    const ty2 = ty + Math.random() * 400 + 200;

    corazon.style.setProperty("--tx", tx + "px");
    corazon.style.setProperty("--ty", ty + "px");
    corazon.style.setProperty("--tx2", tx2 + "px");
    corazon.style.setProperty("--ty2", ty2 + "px");
    corazon.style.fontSize = (20 + Math.random() * 28) + "px";
    corazon.style.animationDelay = (Math.random() * 0.4) + "s";

    document.body.appendChild(corazon);
    setTimeout(() => corazon.remove(), 4200);
  }
}

function iniciarCarga() {
  porcentajeActual = 0;
  const barra = document.getElementById("barraRelleno");
  const porc = document.getElementById("porcentaje");
  const texto = document.getElementById("textoCargando");
  const error = document.getElementById("mensajeError");
  const btnMic = document.getElementById("btnMicrofono");
  const btnCerrar2 = document.getElementById("cerrarCarta2");
  const corazon = document.getElementById("corazonGrande");
  const fotoFinal = document.getElementById("fotoFinal");
  const barraContainer = document.getElementById("barraContainer");

  error.style.display = "none";
  btnMic.style.display = "none";
  btnCerrar2.style.display = "none";
  fotoFinal.style.display = "none";
  corazon.style.display = "block";
  barraContainer.style.display = "flex";
  texto.style.display = "block";
  texto.textContent = "Cargando...";
  barra.style.width = "0%";
  porc.textContent = "0%";

  intervaloCarga = setInterval(() => {
    if (porcentajeActual < 99) {
      porcentajeActual += 1.8;
      if (porcentajeActual > 99) porcentajeActual = 99;
      barra.style.width = porcentajeActual + "%";
      porc.textContent = Math.floor(porcentajeActual) + "%";
    }
  }, 100);

  setTimeout(() => {
    clearInterval(intervaloCarga);
    porcentajeActual = 99;
    barra.style.width = "99%";
    porc.textContent = "99%";
    texto.style.display = "none";
    error.style.display = "block";
    btnMic.style.display = "inline-block";
  }, 6000);
}

function escucharTeAmo() {
  const btnMic = document.getElementById("btnMicrofono");
  const barra = document.getElementById("barraRelleno");
  const porc = document.getElementById("porcentaje");
  const error = document.getElementById("mensajeError");
  const btnCerrar2 = document.getElementById("cerrarCarta2");
  const audioTeAmo = document.getElementById("audioTeAmo");
  const musica = document.getElementById("musica");
  const corazon = document.getElementById("corazonGrande");
  const fotoFinal = document.getElementById("fotoFinal");
  const barraContainer = document.getElementById("barraContainer");

  // Pausar la música
  if (musica && !musica.paused) {
    musica.pause();
  }

  function completarCarga() {
    clearInterval(intervaloCarga);
    porcentajeActual = 100;
    barra.style.width = "100%";
    porc.textContent = "100%";
    error.style.display = "none";
    btnMic.style.display = "none";

    // Mostrar foto y ocultar corazón/barra
    corazon.style.display = "none";
    barraContainer.style.display = "none";
    fotoFinal.style.display = "block";
    btnCerrar2.style.display = "inline-block";

    // Reproducir audio de WhatsApp
    if (audioTeAmo) {
      audioTeAmo.volume = 1;
      audioTeAmo.play().catch(() => {});
    }

    // Reanudar música después de un rato
    setTimeout(() => {
      if (musica) musica.play().catch(() => {});
    }, 8000);
  }

  if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
    const respuesta = prompt("Escribe: te amo");
    if (respuesta && respuesta.toLowerCase().includes("te amo")) {
      completarCarga();
    } else {
      if (musica) musica.play().catch(() => {});
    }
    return;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const reconocimiento = new Recognition();
  reconocimiento.lang = "es-MX";
  reconocimiento.continuous = false;
  reconocimiento.interimResults = false;

  btnMic.classList.add("escuchando");
  btnMic.textContent = "🎤 Escuchando...";

  reconocimiento.start();

  reconocimiento.onresult = (event) => {
    const texto = event.results[0][0].transcript.toLowerCase();
    if (texto.includes("te amo") || texto.includes("teamo")) {
      completarCarga();
    } else {
      btnMic.textContent = "🎤 Di 'te amo' otra vez";
      btnMic.classList.remove("escuchando");
      if (musica) musica.play().catch(() => {});
    }
  };

  reconocimiento.onerror = () => {
    btnMic.textContent = "🎤 Error, intenta de nuevo";
    btnMic.classList.remove("escuchando");
    if (musica) musica.play().catch(() => {});
  };

  reconocimiento.onend = () => {
    btnMic.classList.remove("escuchando");
  };
}

// Clic en el planeta
planeta.addEventListener("click", () => {
  clicsPlaneta++;
  crearCorazones();

  if (clicsPlaneta === 3) {
    document.getElementById("pantalla1").style.display = "flex";
    document.getElementById("pantalla2").style.display = "none";
    setTimeout(() => {
      cartaEspecial.classList.add("visible");
    }, 600);
  }
});

// Botón Siguiente
document.getElementById("btnSiguiente").addEventListener("click", () => {
  document.getElementById("pantalla1").style.display = "none";
  document.getElementById("pantalla2").style.display = "flex";
  iniciarCarga();
});

// Botones cerrar
document.getElementById("cerrarCarta").addEventListener("click", () => {
  cartaEspecial.classList.remove("visible");
});

document.getElementById("cerrarCarta2").addEventListener("click", () => {
  cartaEspecial.classList.remove("visible");
});

// Micrófono
document.getElementById("btnMicrofono").addEventListener("click", escucharTeAmo);