let preguntas = [];
let actual = 0;
let todasPreguntas = [];
let falladas = JSON.parse(localStorage.getItem("falladas")) || [];
let aciertos = 0;
let total = 0;

fetch("preguntas.json")
  .then((res) => res.json())
  .then((data) => {
    todasPreguntas = data;
    preguntas = data;
    mostrarPregunta();
  });

document.body.style.transition = "background 0.3s";

let respondida = false;

function comprobar(i) {
  if (respondida) return;

  respondida = true;

  const correcta = preguntas[actual].correcta;
  if (i === correcta) {
    aciertos++;
  }
  const botones = document.querySelectorAll("#opciones button");

  botones.forEach((btn, index) => {
    if (index === correcta) {
      btn.classList.add("correcta");
    }
    if (index === i && i !== correcta) {
      btn.classList.add("incorrecta");
    }
  });

  // guardar fallos
  if (i !== correcta) {
    const id = preguntas[actual].id;
    if (!falladas.includes(id)) {
      falladas.push(id);
      localStorage.setItem("falladas", JSON.stringify(falladas));
    }
  }
}

function siguiente() {
  respondida = false;
  actual++;

  if (actual >= preguntas.length) {
    alert("🎉 Test terminado");
    actual = 0;
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
  opcionesDiv.innerHTML = "";

  p.opciones.forEach((op, i) => {
    const btn = document.createElement("button");
    btn.innerText = op;
    btn.onclick = () => comprobar(i);
    opcionesDiv.appendChild(btn);
  });
}

function comprobar(i) {
  const correcta = preguntas[actual].correcta;

  if (i === correcta) {
    document.body.style.background = "#d4edda"; // verde
  } else {
    document.body.style.background = "#f8d7da"; // rojo

    const id = preguntas[actual].id;
    if (!falladas.includes(id)) {
      falladas.push(id);
      localStorage.setItem("falladas", JSON.stringify(falladas));
    }
  }
}

function siguiente() {
  respondida = false;
  document.body.style.background = "#f5f7fb";

  actual++;

  if (actual >= preguntas.length) {
    const nota = Math.round((aciertos / preguntas.length) * 100);

    document.getElementById("resultado").innerText =
      `Resultado: ${aciertos}/${preguntas.length} (${nota}%)`;

    return;
  }

  mostrarPregunta();
}

function modoFallos() {
  const filtradas = todasPreguntas.filter((p) => falladas.includes(p.id));

  if (filtradas.length === 0) {
    alert("No tienes preguntas falladas todavía 😎");
    return;
  }

  preguntas = filtradas;
  actual = 0;
  mostrarPregunta();
}

function modoNormal() {
  preguntas = todasPreguntas;
  actual = 0;
  aciertos = 0;
  mostrarPregunta();
}

function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function modoTest(num) {
  const copia = [...todasPreguntas];

  // mezclar
  copia.sort(() => Math.random() - 0.5);

  preguntas = copia.slice(0, num);

  actual = 0;
  aciertos = 0;

  mostrarPregunta();
}
