//Crear los constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

function UI() {}

Seguro.prototype.cotizaSeguros = function () {
  /*
 si la marca es 1 el precio va  amultiplicarse por 1.15
 si es 2 se multiplicara por 1.05
 si es 3 se multiplicara por 1.35
 */
  let cantidad;
  const base = 3000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;

    default:
      break;
  }

  //seleccionar el year
  const diferencia = new Date().getFullYear() - this.year;

  //cada vez que baje un modelo el precio caera en 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
si el tipo de seguro es basico este aumenta en un 30%
si el tipo de seguro es completo este aumenta en un 50%
*/

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

UI.prototype.llenarFechas = () => {
  const max = new Date().getFullYear(),
    min = max - 23;

  const seleccionaYear = document.querySelector("#year");
  for (let i = max; i > min; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    seleccionaYear.appendChild(option);
  }
};
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  //crear el div
  const DIV = document.createElement("DIV");

  if (tipo === "error") {
    DIV.classList.add("error");
  }
  if (tipo === "exito") {
    DIV.classList.add("correcto");
  }

  DIV.classList.add("mensaje", "mt-10");
  DIV.textContent = mensaje;

  //AGREGAR EN EL HTML
  const formulario = document.querySelector("#cotizar-seguro"); //no tiene nada de malo seleccionar otra vez un elemento o ponerlo global
  formulario.insertBefore(DIV, document.querySelector("#resultado"));

  setTimeout(() => {
    DIV.remove();
  }, 2000);
};
UI.prototype.mostrarResultados = (total, seguro) => {
  const { marca, year, tipo } = seguro;
  let textoMarca;
  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;

    default:
      break;
  }
  //crear el div contenedor del resultado
  const DIV = document.createElement("DIV");
  DIV.classList.add("mt-10");

  DIV.innerHTML = `
        <p class="header">TU RESUMEN</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${textoMarca}</span></p>
        <p class="font-bold">Modelo: <span class="font-normal"> ${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal"> $ ${total}</span></p>
    `;
  const resultadoDiv = document.querySelector("#resultado");

  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";

  setTimeout(() => {
    spinner.style.display = "none";
    resultadoDiv.appendChild(DIV);
  }, 2000);
};

//Instanciar UI
const ui = new UI();

//Cuando el documento este cargado
document.addEventListener("DOMContentLoaded", () => {
  ui.llenarFechas();
});

//registrar event listeners
EventListeners();
function EventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  //leer la marca seleccionada
  const marca = document.querySelector("#marca").value;
  //leer el year seleccionado
  const year = document.querySelector("#year").value;
  //leer el tipo de seguro checkeado
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  //evaluar si estan vacios
  if (marca === "" || year === "" || tipo === "") {
    //mostrar mensaje de error
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando", "exito");
  
  //ocultar las cotizaciones previas
  const resultados = document.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }

  //instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizaSeguros();
  //instanciar el prototipe que va a cotizar
  ui.mostrarResultados(total, seguro);
}
