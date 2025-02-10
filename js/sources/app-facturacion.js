
import {
  ApiService
} from "../clases/apiService.js"

import {
  Spinner
} from "../clases/spinner.js"

import {
  Alert
} from "../clases/alert.js"

import {
  DocumentBody
} from "../clases/document_body.js"


const apiservice = new ApiService()

// Crea Document_body
let document_body = new DocumentBody()

//Crea Spinner
let obj_spinner = new Spinner

// Crea Alert
let obj_alert = new Alert

// Var del Datatable
var table;

//Inicializa comprobantes
inicializaFechas()
bloquear_comprobantes()


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
  option.setAttribute("data-id", producto.product_id); // Establece el atributo data-id correctamente
  option.setAttribute("data-precio", producto.price); // Establece el atributo data-precio correctamente
  option.text = producto.name; // Usa el nombre del producto
  selectElement.appendChild(option);
});
// // Fin carga productos

// document.getElementById("select-producto").addEventListener("change", function() {
//   let selectedOption = selectElement.options[selectElement.selectedIndex];
//   let productId = selectedOption.getAttribute("data-id");
//   let productPrice = selectedOption.getAttribute("data-precio");

//   console.log("ID del producto:", productId);
//   console.log("Precio del producto:", productPrice);
// });


// Tipo Comprobante
const dropdownButton = document.getElementById('dropdownButton');
const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedText = item.getAttribute('data-value');
    const document_type = item.getAttribute('arca-value')
    document_body.setDocumentType(document_type)
    dropdownButton.querySelector('span').textContent = selectedText;
  });
});


// Dropdown Cliente

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
    document_body.setClientId(clientId)
    const clientCuit = event.target.getAttribute("data-cuit");

    const nombre = name.split(" (")[0];
    input.value = name.split(" (")[0].trimStart();


    let datos_cliente = await BuscarCliente(clientId)
    cargar_encabezado(datos_cliente.getBody())
    dropdownList.classList.remove("show");
    showDatosClientePanel()
    desbloquear_comprobantes()
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
  table = $('#facturaItems').DataTable({
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
    let productoID = $(this).find("option:selected").data("data-id");
    alert(productoID)
  });

  // Evento para agregar una nueva fila
  $("#btnNuevoItem").click(function () {

    // if (!ultimaFilaCompleta()) return;

    let selectHTML = `<select class="producto">
                          <option value="">Seleccionar producto</option>`;

    array_productos.forEach(producto => {
      selectHTML += `<option data-id="${producto.product_id}" data-precio="${producto.price}">( ${producto.code} ) - ${producto.name}</option>`;
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

    //Prueba
  //   $(document).on('change', '.producto', function() {
  //     let selectedOption = $(this).find(':selected'); 
  //     let productId = selectedOption.data('id'); 
  //     let price = selectedOption.data('precio');
  
  //     console.log("Producto ID:", productId);
  //     console.log("Precio:", price);
  
  //     // Opcional: establecer el precio automáticamente en el input correspondiente
  //     let row = $(this).closest('tr');
  //     row.find('.precio').val(price);
  // });
  

    // Deshabilitar el botón hasta que la nueva fila tenga datos
    $("#btnNuevoItem").prop("disabled", true);
  });

  // Evento para eliminar una fila
  $(document).on("click", ".btn-delete", function () {
    table.row($(this).closest("tr")).remove().draw(false);
    // $("#btnNuevoItem").prop("disabled", !ultimaFilaCompleta());
    $("#btnNuevoItem").prop("disabled", false);
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

document.getElementById("date-vto").addEventListener("change", function() {
    let fecha = this.value; // Formato YYYY-MM-DD
    document_body.setDateExpiration(fecha.replace(/-/g, "")); // Remueve los guiones
})

document.getElementById("date-from").addEventListener("change", function() {
  let fecha = this.value; // Formato YYYY-MM-DD
  document_body.setDateFrom(fecha.replace(/-/g, "")); // Remueve los guiones
})

document.getElementById("date-to").addEventListener("change", function() {
  let fecha = this.value; // Formato YYYY-MM-DD
  document_body.setDateTo(fecha.replace(/-/g, "")); // Remueve los guiones
})

// Construye items en el body
// function construir_items() {
//   $("#facturaItems tbody tr").each(function () {
//       let fila = $(this);
//       let select = fila.find("select.producto");

//       console.log(select)
//       if (select.length === 0) {
//           console.error("No se encontró el select en la fila:", fila);
//           return;
//       }

//       // Obtener el valor del atributo "value" de la opción seleccionada
//       let productId = select.find("option:selected").attr("data-id");
//       let quantity = parseFloat(fila.find("input.cantidad").val()) || 0;
//       let unitPrice = parseFloat(fila.find("input.precio").val()) || 0;
//       let discount = parseFloat(fila.find("input.descuento").val()) || 0;

//   });
// }

document.getElementById("emitir-documento").addEventListener("click", async () => {
  obj_spinner.show()
  construir_items()
  // document_body.addItem(11, 11, 1.0, "IVA 21%", 1000.0);
  console.log(document_body.data)

  // let document_body = {
  //   "client_id": 15,
  //   "document_type": "FACTURAC",
  //   "date": "20250131",
  //   "date_serv_from": "20250131",
  //   "date_serv_to": "20250131",
  //   "expiration_date": "20250131",
  //   "currency": "PESOS",
  //   "exchange_rate": 1.0,
  //   "CondicionIVAReceptorId": 6,
  //   "items": [
  //     {
  //       "document_id": 11,
  //       "product_id": 11,
  //       "quantity": 1.0,
  //       "tax_rate": "IVA 21%",
  //       "unit_price": 1000.0
  //     }
  //   ]
  // }

  // let response = await apiservice.postDocument(document_body)
  // let body = response.getBody()
  obj_spinner.hide()
  let msg = `
       Factura emitida con exito <a id="get-bill" class="alert-link" style="cursor: pointer">C 00100-00000002</a>. 
       click para descargar
       `
  obj_alert.message(msg)
  obj_alert.show()
  inicializa_comprobante()

})


//DESCARGAR COMPROBANTE
document.body.addEventListener("click", async (event) => {
  if (event.target && event.target.id === "get-bill") {
    obj_spinner.show()
    location.hash = "/comprobantes"
    await apiservice.getBill(225)
    obj_spinner.hide()
    obj_alert.hide()
  }
});


//Incializa Comprobante
document.getElementById("reset-comprobante").addEventListener("click", () => {
  resetComprobantes()
})

function resetComprobantes() {
  inicializa_comprobante()
  $("#btnNuevoItem").prop("disabled", true);
}

function inicializaFechas() {
  let hoy = new Date().toISOString().split('T')[0]
  document.getElementById("date-vto").value = hoy
  document.getElementById("date-from").value = hoy
  document.getElementById("date-to").value = hoy
}

function eraseDatatable() {
  table.clear().draw()
  $("#btnNuevoItem").prop("disabled", false);
}


function inicializa_comprobante() {

  document.getElementById("searchInput").value = ""
  inicializaFechas()
  resetDatosCliente()
  eraseDatatable()
  bloquear_comprobantes()

}

function bloquear_comprobantes() {
  $("#accordionFlushExample .accordion-button,  #select-comprobantes").addClass("disabled");
  $("#facturaItems input, #facturaItems select, #facturaItems button, #select-comprobantes").prop("disabled", true);
  document.getElementById("dropdownButton").innerHTML =
    `<svg class="bi"><use xlink:href="#file-earmark" /></svg> <span>Factura</span>`;
}

function desbloquear_comprobantes() {
  $("#accordionFlushExample .accordion-button").removeClass("disabled");
  $("#facturaItems input, #facturaItems select, #facturaItems button").prop("disabled", false);
  $("#accordionFlushExample .accordion-button,  #select-comprobantes").removeClass("disabled");
  document.getElementById("dropdownButton").innerHTML =
    `<svg class="bi"><use xlink:href="#file-earmark" /></svg> <span>Factura</span>`;
  $("#btnNuevoItem").prop("disabled", false);
}

//Salir Facturacion
document.getElementById("btn-salir-facturacion").addEventListener("click", () => {
  resetComprobantes()
  location.hash = "/comprobantes"
})