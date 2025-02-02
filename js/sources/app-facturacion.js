
import {
  ApiService
} from "../clases/apiService.js"

import {
  Spinner
} from "../clases/spinner.js"

import {
  Alert
} from "../clases/alert.js"

const apiservice = new ApiService()

//Crea Spinner
let obj_spinner = new Spinner

// Crea Alert
let obj_alert = new Alert

// Carga Productos en select
let productos = await apiservice.getAllProductos()
let array_productos = await productos.getBody()

const selectElement = document.getElementById("select-producto"); // Asegúrate de que existe este <select> en tu HTML

// Limpiar opciones anteriores (si las hubiera)
selectElement.innerHTML = "";

// Agregar opción por defecto (opcional)
let defaultOption = document.createElement("option");
defaultOption.text = "Seleccione un producto";
defaultOption.value = "";
selectElement.appendChild(defaultOption);

// Recorrer array y agregar opciones
array_productos.forEach(producto => {
  let option = document.createElement("option");
  option.value = producto.id; // Usa el identificador del producto
  option.setAttribute("data-precio", producto.price); // Establece el atributo data-precio correctamente
  option.text = producto.name; // Usa el nombre del producto
  selectElement.appendChild(option);
});

// Fin carga productos

// Dropdown Cliente

let getAllClientes = await apiservice.getAllClientes()
const options = await getAllClientes.getBody()

const dropdownButton = document.getElementById('dropdownButton');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedText = item.getAttribute('data-value');
    dropdownButton.querySelector('span').textContent = selectedText;
  });
});

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

    const nombre = name.split(" (")[0];
    input.value = name.split(" (")[0].trimStart();


    let datos_cliente = await BuscarCliente(clientId)
    cargar_encabezado(datos_cliente.getBody())
    dropdownList.classList.remove("show");
    showDatosClientePanel()
  }
});

// Cierra lista desplegable con missclick
document.addEventListener("click", (event) => {
  if (!dropdownList.contains(event.target) && event.target !== input && dropdownList.classList.contains("show")) {
    dropdownList.classList.remove("show");
    input.value = ""
  }
});

// Limpia Input
input.addEventListener("click", () => {
  resetDatosCliente()
})


// Busca Cliente por id seleccionado
async function BuscarCliente(params) {

  return apiservice.getCliente(params)

}

function clacular_total() {
  alert(table.row)

}
// Carga los datos del cliente en encabezado documento

function cargar_encabezado(datos) {

  document.getElementById("direccion-cliente").innerText = datos.address
  document.getElementById("localidad-cliente").innerText = datos.city + " - " + datos.state
  document.getElementById("cuit-cliente").innerText = "Cuit : " + datos.tax_id
  document.getElementById("condicion-cliente").innerText = "Condicion : " + datos.tax_condition

}

function resetDatosCliente() {
  input.value = ""
  hideDatosCliente()
  hideMoreOptions()
}

function hideDatosCliente() {
  document.getElementById('datos-cliente-panel').classList.add('d-none');
}

function showDatosClientePanel() {
  document.getElementById('datos-cliente-panel').classList.remove('d-none');
  showMoreOptions()
}

function showMoreOptions() {
  document.getElementById("flush-collapseOne").classList.add("show")

}

function hideMoreOptions() {
  document.getElementById("flush-collapseOne").classList.remove("show")
}



//DATATABLE

$(document).ready(function () {
  let table = $('#facturaItems').DataTable({
    paging: false,
    searching: false,
    ordering: false,
    info: false
  });

  // Función para verificar si la última fila está completa
  function ultimaFilaCompleta() {
    let ultimaFila = $("#facturaItems tbody tr:last-child");
    let producto = ultimaFila.find(".producto").val();
    let cantidad = ultimaFila.find(".cantidad").val();
    let precio = ultimaFila.find(".precio").val();

    return producto !== "" && cantidad !== "" && cantidad > 0 && precio !== "" && precio > 0;
  }

  // Evento para habilitar el botón "Nuevo Item" si la última fila está completa
  $(document).on("input change", ".producto, .cantidad, .precio", function () {
    $("#btnNuevoItem").prop("disabled", !ultimaFilaCompleta());
  });

  // Evento para calcular el total en tiempo real
  $(document).on("input change", ".cantidad, .precio, .descuento", function () {
    let fila = $(this).closest("tr");
    let cantidad = parseFloat(fila.find(".cantidad").val()) || 0;
    let precio = parseFloat(fila.find(".precio").val()) || 0;
    let descuento = parseFloat(fila.find(".descuento").val()) || 0;

    let subtotal = cantidad * precio;
    let totalConDescuento = subtotal - (subtotal * descuento / 100);

    fila.find(".total").text(totalConDescuento.toFixed(2));
  });

  // Evento para asignar precio automáticamente según el producto seleccionado
  $(document).on("change", ".producto", function () {
    let fila = $(this).closest("tr");
    let precioBase = $(this).find("option:selected").data("precio") || 0;
    fila.find(".precio").val(precioBase).trigger("input"); // Disparar evento de input para recalcular
  });

  // Evento para agregar una nueva fila
  $("#btnNuevoItem").click(function () {

    if (!ultimaFilaCompleta()) return;

    let selectHTML = `<select class="producto">
                          <option value="">Seleccionar producto</option>`;

    array_productos.forEach(producto => {
      selectHTML += `<option value="${producto.id}" data-precio="${producto.price}">( ${producto.code} ) - ${producto.name}</option>`;
    });

    selectHTML += `</select>`;

    table.row.add([
      selectHTML,
      '<input type="number" class="cantidad" min="0.0001">',
      '<input type="number" class="precio" min="0">',
      '<input type="number" class="descuento" min="0" max="100">',
      '<div class="total" style="text-align: right;">0.00</div>',
      '<button class="btn btn-delete">🗑</button>'
    ]).draw(false);

    // Deshabilitar el botón hasta que la nueva fila tenga datos
    $("#btnNuevoItem").prop("disabled", true);
  });

  // Evento para eliminar una fila
  $(document).on("click", ".btn-delete", function () {
    table.row($(this).closest("tr")).remove().draw(false);
    $("#btnNuevoItem").prop("disabled", !ultimaFilaCompleta());
    calcularTotalFactura()
  });

  $(document).on("input change", ".cantidad, .precio, .descuento", function () {
    let fila = $(this).closest("tr");
    let cantidad = parseFloat(fila.find(".cantidad").val()) || 0;
    let precio = parseFloat(fila.find(".precio").val()) || 0;
    let descuento = parseFloat(fila.find(".descuento").val()) || 0;

    let subtotal = cantidad * precio;
    let totalConDescuento = subtotal - (subtotal * descuento / 100);

    fila.find(".total").text(totalConDescuento.toFixed(2));

    calcularTotalFactura();
  });

  function calcularTotalFactura() {
    let totalFactura = 0;

    $("#facturaItems tbody tr").each(function () {
      let totalItem = parseFloat($(this).find(".total").text()) || 0;
      totalFactura += totalItem;
    });

    $("#totalFactura").text(totalFactura.toFixed(2));
  }


});

document.getElementById("emitir-documento").addEventListener("click", async () => {
  obj_spinner.show()
  let document_body = {
    "client_id": 15,
    "document_type": "FACTURAC",
    "date": "20250131",
    "date_serv_from": "20250131",
    "date_serv_to": "20250131",
    "expiration_date": "20250131",
    "currency": "PESOS",
    "exchange_rate": 1.0,
    "items": [
      {
        "document_id": 11,
        "product_id": 11,
        "quantity": 1.0,
        "tax_rate": "IVA 21%",
        "unit_price": 1000.0
      }
    ]
  }

  // let response = await apiservice.postDocument(document_body)
  // let body = response.getBody()
  obj_spinner.hide()
  let msg = `
  
   <div class="me-4">
   <strong>Factura Emitida!</strong> <br>
   </div>
   <a id="get-bill" class="d-flex justify-content-center align-items-center text-dark fw-bold ms-4" style="cursor: pointer; text-decoration: none;">
   <svg class="bi" width="24" height="24">
   <use href="#file-download"></use>
   </svg>
   Descargar factura
   </a>

   <button type="button" id="btn-close-fact" class="btn-close position-absolute top-0 end-0 m-2" data-bs-dismiss="alert" aria-label="Close"></button>
  `
  obj_alert.message(msg)
  obj_alert.show()
})

document.body.addEventListener("click", async (event) => {
  if (event.target && event.target.id === "get-bill") {
    obj_spinner.show()
    await apiservice.getBill(225)
    obj_spinner.hide()
  }
});
