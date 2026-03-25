let preguntas = [];
let actual = 0;
let falladas = JSON.parse(localStorage.getItem("falladas")) || [];

fetch("preguntas.json")
  .then((res) => res.json())
  .then((data) => {
    preguntas = data;
    mostrarPregunta();
  });

function mostrarPregunta() {
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
    alert("✅ Correcto");
  } else {
    alert("❌ Incorrecto");

    const id = preguntas[actual].id;
    if (!falladas.includes(id)) {
      falladas.push(id);
      localStorage.setItem("falladas", JSON.stringify(falladas));
    }
  }
}

function siguiente() {
  actual++;
  if (actual >= preguntas.length) actual = 0;
  mostrarPregunta();
}

function modoFallos() {
  const filtradas = preguntas.filter((p) => falladas.includes(p.id));

  if (filtradas.length === 0) {
    alert("No tienes preguntas falladas todavía 😎");
    return;
  }

  preguntas = filtradas;
  actual = 0;
  mostrarPregunta();
}
