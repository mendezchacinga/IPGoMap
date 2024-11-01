import { MyIP, ObtenerCoor } from "./geoipify.js";

const dbcremoverLoader = debounce(removerLoader, 2000);

// Funciones de Inicio
function removerLoader() {
  const container = document.getElementById("container");
  const loader2 = document.getElementById("loader2");
  loader2.style.display = "none";
  container.style.height = "100%";
}

function iniciarLoader() {
  const loader2 = document.getElementById("loader2");
  const container = document.getElementById("container");
  container.style.height = "500px";
  loader2.style.display = "flex";
}

// Precarga
async function Home() {
  const loader = document.getElementById("loader");
  loader.remove();
  const hidden = document.querySelector(".hidden");
  hidden.classList.remove("hidden");
}

window.onload = Home();

// ***Map controller***
let map = L.map("map");
let osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  }
);
osmLayer.addTo(map);

// ***Startup of map based on IP***
try {
  const geoIpData = await MyIP();
  await CrearDiv(geoIpData);
  const lat = geoIpData.latitud;
  const lng = geoIpData.longitud;
  let userMarker = L.marker([lat, lng]);
  userMarker.addTo(map);
  map.setView([lat, lng], 13);
} catch (error) {
  Swal.fire(
    '¡No se pudo obtener tu dirección IP!',
    '¡Presione el botón para continuar!',
    'error'
  )
  removerLoader();
  console.log(error)
}


// ***Input Search (based on IP or Domain)***
function Buscar(text) {
  iniciarLoader();
  Ipsearch(text);
}

// Eventos para Buscar
let searchInput = document.getElementById("search");
let searchIp = document.getElementById('bsearch');

searchIp.addEventListener('click', function (event) {
  let text = searchInput.value;
  Buscar(text);
})

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    let text = searchInput.value;
    Buscar(text);
  }
});

// Buscar dominio o IP
async function Ipsearch(ip_domain) {
  try {
    const geoIpData = await ObtenerCoor(ip_domain);
    await BorrarDiv()
    await CrearDiv(geoIpData);
    const lat = geoIpData.latitud;
    const lng = geoIpData.longitud;
    let userMarker = L.marker([lat, lng]);
    userMarker.addTo(map);
    map.setView([lat, lng], 13);
  } catch (error) {
    Swal.fire(
      '¡Dirección IP o Dominio Incorrectos!',
      '¡Presione el botón para continuar!',
      'error'
    )
    removerLoader();
  }
}

// Crear Div
async function CrearDiv(geoIpData) {
  // Div Dinámico
  const infDinamicoDiv = document.querySelector(".inf_dinamico");
  console.log(geoIpData)
  const title = ["Dirección IP", "País", "Estado", "Ciudad", "Zona Horaria", "Código Postal", "Latitud", "Longitud", "Nombre", "Dominio", "ISP"];
  const properties = Object.keys(geoIpData);
  let cont = 0;
  for (const property of properties) {
    // Create a new div
    const div = document.createElement("div");
    div.classList.add("propiedades");

    // Create a title div
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerHTML = `<label>${title[cont]}:</label>`;

    // Create a metadatos div
    const metadatosDiv = document.createElement("div");
    metadatosDiv.classList.add("metadatos");
    if (geoIpData.hasOwnProperty(property) && geoIpData[property] !== undefined && geoIpData[property] !== "") {
      metadatosDiv.innerHTML = `<label> ${geoIpData[property]}</label>`;
    } else {
      metadatosDiv.innerHTML = `<label>No encontrado</label>`;
    }

    div.appendChild(titleDiv);
    div.appendChild(metadatosDiv);

    infDinamicoDiv.appendChild(div);

    cont++;
    await dbcremoverLoader();
  }
}

// Borrar Div
async function BorrarDiv() {
  const divsToDelete = document.querySelectorAll(".propiedades");
  for (const div of divsToDelete) {
    await div.remove();
  }
}

// Modo claro y Oscuro
const mode = document.getElementById('mode');
// Sweet Alert

mode.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  var stylesheet = document.body.classList.contains('dark') ? '../style/dark_sweetalert2.css' : '../style/sweetalert2.css';
  document.getElementById('styleSweet').href = stylesheet;
})

// Función debounce

function debounce(funcion, tiempo) {
  let timeoutid;
  return function () {

    if (timeoutid) {
      clearTimeout(timeoutid);
    }

    const context = this;
    const argumento = arguments;

    timeoutid = setTimeout(() => {
      funcion.apply(context, argumento);
    }, tiempo)
  }
}
