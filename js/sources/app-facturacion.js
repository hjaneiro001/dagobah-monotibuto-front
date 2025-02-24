
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
} from "../clases/bodys/document_body.js"


const apiservice = new ApiService()

// Crea Document_body
let document_body = new DocumentBody()

//Crea Spinner
let obj_spinner = new Spinner

// Crea Alert
let obj_alert = new Alert

//Inicializa comprobantes
inicializaFechas()
bloquear_comprobantes()


// Carga Productos en select
let productos = await apiservice.getAllProducts()
let array_productos = await productos.getBody()

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


// Var del Datatable
let tabla;

//DATATABLE
$(document).ready(function () {
  tabla = $('#facturaItems').DataTable({
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

    // if (!ultimaFilaCompleta()) return;

    let selectHTML = `<select class="producto">
                          <option value="">Seleccionar producto</option>`;

    array_productos.forEach(producto => {
      selectHTML += `<option data-id="${producto.product_id}" data-precio="${producto.price}">( ${producto.code} ) - ${producto.name}</option>`;
    });

    selectHTML += `</select>`;

    tabla.row.add([
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
    tabla.row($(this).closest("tr")).remove().draw(false);
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

 
});

function calcularTotalFactura() {
  let totalFactura = 0;

  $("#facturaItems tbody tr").each(function () {
    let totalItem = parseFloat($(this).find(".total").text()) || 0;
    totalFactura += totalItem;
  });

  $("#totalFactura").text(totalFactura.toFixed(2));
}

document.getElementById("date-vto").addEventListener("change", function() {
    let fecha = this.value; 
    document_body.setDateExpiration(fecha.replace(/-/g, "")); 
})

document.getElementById("date-from").addEventListener("change", function() {
  let fecha = this.value; 
  document_body.setDateFrom(fecha.replace(/-/g, "")); 
})

document.getElementById("date-to").addEventListener("change", function() {
  let fecha = this.value; 
  document_body.setDateTo(fecha.replace(/-/g, "")); 
})


document.getElementById("emitir-documento").addEventListener("click", async () => {

  obj_spinner.show()

  try{
    construir_items()
    validateDocument(document_body.getDocument()); 
    let response = await apiservice.postDocument(document_body.getDocument())
    if(response.getStatus() >= 400){
      obj_alert("Hubo un error en la emision del documento, intentelo mas tarde",salirFacturacion)
    }
    
    let body = response.getBody()
    let msg = `
    Factura emitida con éxito <a id="get-bill" value=${body.document_id} class="alert-link" style="cursor: pointer">
    ${body.document_type} ${body.pos}-${body.number}
    </a>. Click para descargar.
  `;
 
    obj_spinner.hide()
    obj_alert.show(msg,salirFacturacion)
    inicializa_comprobante()
  
  }
  catch(error){
    obj_alert.show(error.message,cierraAlerta)
    obj_spinner.hide()
  }
  
})

function construir_items() {
  let hasError = false; // Bandera para detectar errores

  $("#facturaItems tbody tr").each(function () {
    let fila = $(this);
    let select = fila.find("select.producto");

    if (select.length == 0) {
      return;
    }

    let productId = select.find("option:selected").attr("data-id");
    let quantity = parseFloat(fila.find("input.cantidad").val()) || 0;
    let unitPrice = parseFloat(fila.find("input.precio").val()) || 0;
    let discount = parseFloat(fila.find("input.descuento").val()) || 0;

    if (productId > 0 && quantity > 0 && unitPrice > 0) {
      document_body.addItem(productId, quantity, unitPrice, discount);
    } else {
      hasError = true;
    }
  });

  if (hasError) {
    obj_alert.show("Error en los items de la factura. Corrige los datos antes de continuar.", cierraAlerta);
    throw new Error("Error en los items de la factura.");
  }
}

function validateDocument(document) {

  if (!document.client_id ||  document.client_id == 0) {
      throw new Error("Debe ingresar un cliente valido");
  }

  if (!["FACTURAC"].includes(document.document_type)) {
      throw new Error("El tipo de documento es invalido");
  }

  const dateFields = ["date", "date_serv_from", "date_serv_to", "expiration_date"];
  for (const field of dateFields) {
      if (!/^\d{8}$/.test(document[field])) {
          throw new Error(`${field} debe estar en formato YYYYMMDD`);
      }
  }

//  Comparar directamente
  if (document.expiration_date < document.date) {
     throw new Error("expiration_date no puede ser menor que date.");
  }

  if (!Array.isArray(document.items) || document.items.length === 0) {
      throw new Error("Debe haber al menos un item en la factura");
  }

}


//DESCARGAR COMPROBANTE
document.body.addEventListener("click", async (event) => {
  if (event.target && event.target.id === "get-bill") {

    let documentId = event.target.getAttribute("value");

    if (documentId) {
      obj_spinner.show()
      location.hash = "/comprobantes"
      await apiservice.getBill(documentId)
      obj_spinner.hide()
      obj_alert.hide()
      window.location.reload()
    } else {
      obj_alert("No se puede descargar el documento",salirFacturacion);
    }
  
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
  tabla.clear().draw()
  $("#btnNuevoItem").prop("disabled", false);
}


function inicializa_comprobante() {

  document.getElementById("searchInput").value = ""
  inicializaFechas()
  resetDatosCliente()
  eraseDatatable()
  calcularTotalFactura()
  bloquear_comprobantes()
  document_body.reset()

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
  salirFacturacion()
})

// Cierra slo alerta alerta 
function cierraAlerta(){
  obj_alert.hide()
}

function salirFacturacion(){
  inicializa_comprobante()
  location.hash = "/comprobantes"
  window.location.reload()
}
