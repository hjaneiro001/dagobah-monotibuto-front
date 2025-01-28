
import {
  ApiService
} from "../clases/apiService.js"

const apiservice = new ApiService()

// Dropdown Tipo Facturas
const dropdownButton = document.getElementById('dropdownButton');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedText = item.getAttribute('data-value');
    dropdownButton.querySelector('span').textContent = selectedText;
  });
});


let getAllClientes = await apiservice.getAllClientes()
const options = await getAllClientes.getBody()

const input = document.getElementById("searchInput");
const dropdownList = document.getElementById("dropdownList");

input.addEventListener("input", () => {
const query = input.value.toLowerCase();
dropdownList.innerHTML = "";

const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(query)
);

// Llena lista desplegable
if (filteredOptions.length > 0 && query !== "") {
    dropdownList.classList.add("show");

    filteredOptions.forEach(option => {
      const li = document.createElement("li");
      li.innerHTML = `<button 
          type="button" 
          class="dropdown-item" 
          data-id="${option.pk_client}" 
          data-cuit="${option.tax_id}">
            ${option.name} (${option.tax_id})
          </button>`;
      dropdownList.appendChild(li);
    });
  } else {
    dropdownList.classList.remove("show");
  }
});

// Selecciona item
dropdownList.addEventListener("click", async (event) => {
  if (event.target.tagName === "BUTTON") {
    const name = event.target.textContent;
    const clientId = event.target.getAttribute("data-id");
    const clientCuit = event.target.getAttribute("data-cuit");

    input.value = name;
    
    let datos_cliente = await BuscarCliente(clientId)
    cargar_encabezado(datos_cliente.getBody())
    console.log(datos_cliente.getBody())

    showDatosClientePanel()
  }
});

// Cierra lista desplegable con missclick
document.addEventListener("click", (event) => {
  if (!dropdownList.contains(event.target) && event.target !== input) {
    dropdownList.classList.remove("show");
  }
});

// Busca Cliente por id seleccionado
async function BuscarCliente(params) {

  return apiservice.getCliente(params)
 
}

// Carga los datos del cliente en encabezado documento

function cargar_encabezado(datos){

  document.getElementById("nombre-cliente").innerText = datos.name
  document.getElementById("direccion-cliente").innerText = datos.address
  document.getElementById("localidad-cliente").innerText = datos.city + " - " + datos.state
  document.getElementById("cuit-cliente").innerText = "Cuit : " + datos.tax_id
  document.getElementById("condicion-cliente").innerText = "Condicion : " + datos.tax_condition

}

function showCustomerSelect() {
  document.getElementById('customer-select').classList.remove('d-none');
  document.getElementById('datos-cliente-panel').classList.add('d-none');
}

function showDatosClientePanel() {
  document.getElementById('datos-cliente-panel').classList.remove('d-none');
  document.getElementById('customer-select').classList.add('d-none');
  showMoreOptions()
}

function showMoreOptions(){
  document.getElementById("flush-collapseOne").classList.add("show")

}




