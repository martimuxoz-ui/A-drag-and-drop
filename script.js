const g1 = document.getElementById("grupo1");
const g2 = document.getElementById("grupo2");
const resultado = document.getElementById("resultado");
const contador = document.getElementById("contador");
const mensaje = document.getElementById("mensaje");
const estrellas = document.getElementById("estrellas");
const btnVerificar = document.getElementById("verificar");
let a = 0, b = 0;
let puntos = 0, aciertos = 0, errores = 0, racha = 0;
let intentosSuma = 0, resuelta = false;
function pintarMarcador() {
  document.getElementById("puntos").textContent = puntos;
  document.getElementById("aciertos").textContent = aciertos;
  document.getElementById("errores").textContent = errores;
  document.getElementById("racha").textContent = racha;
}
const aleatorio = () => Math.floor(Math.random() * 10) + 1;
function nuevaSuma() {
  a = aleatorio();
  b = aleatorio();
  g1.innerHTML = g2.innerHTML = "";
  resultado.innerHTML = '<span class="ayuda">Suelta aquí</span>';
  mensaje.textContent = "";
  mensaje.className = "";
  estrellas.textContent = "";
  intentosSuma = 0;
  resuelta = false;
  btnVerificar.disabled = false;
  crearBalones(g1, a);
  crearBalones(g2, b);
  actualizar();
}
function crearBalon() {
  const el = document.createElement("div");
  el.className = "balon";
  el.textContent = "⚽";
  return el;
}
function crearBalones(grupo, n) {
  for (let i = 0; i < n; i++) grupo.appendChild(crearBalon());
}
function balonesEnResultado() {
  return resultado.querySelectorAll(".balon").length;
}
function actualizar() {
  const n = balonesEnResultado();
  contador.textContent = "Balones: " + n;
  const ayuda = resultado.querySelector(".ayuda");
  if (n === 0 && !ayuda) resultado.innerHTML = '<span class="ayuda">Suelta aquí</span>';
  if (n > 0 && ayuda) ayuda.remove();
}
function dentro(rect, x, y) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
function empezarArrastre(e) {
  e.preventDefault();
  const origen = e.currentTarget;
  const esFuente = origen.id === "fuente";
  const fantasma = crearBalon();
  fantasma.classList.add("fantasma");
  document.body.appendChild(fantasma);
  if (!esFuente) origen.classList.add("arrastrando");
  const mover = (ev) => {
    fantasma.style.left = ev.clientX - 22 + "px";
    fantasma.style.top = ev.clientY - 22 + "px";
    resultado.classList.toggle("encima", dentro(resultado.getBoundingClientRect(), ev.clientX, ev.clientY));
  };
  const soltar = (ev) => {
    document.removeEventListener("pointermove", mover);
    document.removeEventListener("pointerup", soltar);
    document.removeEventListener("pointercancel", soltar);
    const sobre = dentro(resultado.getBoundingClientRect(), ev.clientX, ev.clientY);
    if (esFuente) {
      if (sobre) agregarAlResultado();
    } else if (!sobre) {
      origen.remove();
    } else {
      origen.classList.remove("arrastrando");
    }
    resultado.classList.remove("encima");
    fantasma.remove();
    mensaje.textContent = "";
    mensaje.className = "";
    actualizar();
  };
  mover(e);
  document.addEventListener("pointermove", mover);
  document.addEventListener("pointerup", soltar);
  document.addEventListener("pointercancel", soltar);
}
function agregarAlResultado() {
  const el = crearBalon();
  el.addEventListener("pointerdown", empezarArrastre);
  resultado.appendChild(el);
}
document.getElementById("fuente").addEventListener("pointerdown", empezarArrastre);
btnVerificar.addEventListener("click", () => {
  if (resuelta) return;
  const n = balonesEnResultado();
  const total = a + b;
  intentosSuma++;
  if (n === total) {
    resuelta = true;
    aciertos++;
    racha++;
    const ganadas = intentosSuma === 1 ? 3 : intentosSuma === 2 ? 2 : 1;
    puntos += ganadas * 10 + (racha >= 3 ? 5 : 0);
    mensaje.textContent = `¡Correcto! ${a} + ${b} = ${total}`;
    mensaje.className = "ok";
    estrellas.textContent = "⭐".repeat(ganadas) + "☆".repeat(3 - ganadas);
    btnVerificar.disabled = true;
  } else {
    errores++;
    racha = 0;
    mensaje.textContent = n < total
      ? `Incorrecto: tienes ${n} y la suma da más. Te faltan balones.`
      : `Incorrecto: tienes ${n} y la suma da menos. Te pasaste.`;
    mensaje.className = "mal";
    estrellas.textContent = "";
  }
  pintarMarcador();
});
document.getElementById("nuevo").addEventListener("click", nuevaSuma);
nuevaSuma();