let preguntas = [];
let actual = 0;
let todasPreguntas = [];
let falladas = JSON.parse(localStorage.getItem("falladas")) || [];
let aciertos = 0;

let respondida = false;

fetch("preguntas.json")
  .then((res) => res.json())
  .then((data) => {
    todasPreguntas = data;
    preguntas = data;
    mostrarPregunta();
  });

function comprobar(i) {
  if (respondida) return;

  respondida = true;

  const correcta = preguntas[actual].correcta;
  const botones = document.querySelectorAll("#opciones button");

  if (i === correcta) {
    aciertos++;
    mostrarFeedback("✔");
  } else {
    mostrarFeedback("✖");

    const id = preguntas[actual].id;
    if (!falladas.includes(id)) {
      falladas.push(id);
      localStorage.setItem("falladas", JSON.stringify(falladas));
    }
  }

  botones.forEach((btn, index) => {
    if (index === correcta) btn.classList.add("correcta");
    if (index === i && i !== correcta) btn.classList.add("incorrecta");
  });
}

function mostrarFeedback(simbolo) {
  const div = document.getElementById("resultado");
  div.innerText = simbolo;
  div.style.opacity = "1";

  setTimeout(() => {
    div.style.opacity = "0.3";
  }, 600);
}

function siguiente() {
  respondida = false;

  actual++;

  if (actual >= preguntas.length) {
    const nota = Math.round((aciertos / preguntas.length) * 100);

    document.getElementById("resultado").innerText =
      `Resultado: ${aciertos}/${preguntas.length} (${nota}%)`;

    return;
  }

  mostrarPregunta();
}

function mostrarPregunta() {
  document.getElementById("opciones").innerHTML = "";

  document.getElementById("contador").innerText =
    `${actual + 1}/${preguntas.length}`;

  const p = preguntas[actual];
  document.getElementById("pregunta").innerText = p.pregunta;

  const opcionesDiv = document.getElementById("opciones");

  p.opciones.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.innerText = op;
    btn.onclick = () => comprobar(i);
    opcionesDiv.appendChild(btn);
  });
}

function modoFallos() {
  const filtradas = todasPreguntas.filter((p) => falladas.includes(p.id));

  if (filtradas.length === 0) {
    alert("No tienes preguntas falladas todavía 😎");
    return;
  }

  preguntas = filtradas;
  actual = 0;
  aciertos = 0;
  mostrarPregunta();
}

function modoNormal() {
  preguntas = todasPreguntas;
  actual = 0;
  aciertos = 0;
  mostrarPregunta();
}

function modoTest(num) {
  const copia = [...todasPreguntas];
  copia.sort(() => Math.random() - 0.5);

  preguntas = copia.slice(0, num);

  actual = 0;
  aciertos = 0;

  mostrarPregunta();
}
