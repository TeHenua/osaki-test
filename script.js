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

function comprobar(i, opciones) {
  if (respondida) return;

  respondida = true;

  const correcta = opciones.findIndex((op) => op.correcta);
  const botones = document.querySelectorAll("#opciones button");

  if (i === correcta) {
    aciertos++;
    mostrarFeedback("✔", true);
  } else {
    mostrarFeedback("✖", false);

    const id = preguntas[actual].id;
    if (!falladas.includes(id)) {
      falladas.push(id);
      localStorage.setItem("falladas", JSON.stringify(falladas));
    }
  }

  botones.forEach((btn, index) => {
    if (index === correcta) {
      btn.classList.add("correcta");
    }

    if (index === i && i !== correcta) {
      btn.classList.add("incorrecta");
    }
  });
  setTimeout(() => {
    siguiente();
  }, 800);
}

function mostrarFeedback(simbolo, correcto) {
  const div = document.getElementById("resultado");

  div.innerText = simbolo;
  div.style.color = correcto ? "#22c55e" : "#ef4444";
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

  const opcionesMezcladas = p.opciones.map((texto, index) => ({
    texto,
    correcta: index === p.correcta,
  }));

  // mezclar
  opcionesMezcladas.sort(() => Math.random() - 0.5);

  opcionesMezcladas.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.innerText = op.texto;

    btn.onclick = () => comprobar(i, opcionesMezcladas);

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
