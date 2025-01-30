
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

    const nombre= name.split(" (")[0];
    input.value = name.split(" (")[0].trimStart();


    let datos_cliente = await BuscarCliente(clientId)
    cargar_encabezado(datos_cliente.getBody())
    dropdownList.classList.remove("show");
    showDatosClientePanel()
  }
});

// Cierra lista desplegable con missclick
document.addEventListener("click", (event) => {
  if (!dropdownList.contains(event.target) && event.target !== input && dropdownList.classList.contains("show"))  {
    dropdownList.classList.remove("show");
    input.value = ""
  }
});

// Limpia Input
input.addEventListener("click", ()=> {
  resetDatosCliente()
})


// Busca Cliente por id seleccionado
async function BuscarCliente(params) {

  return apiservice.getCliente(params)
 
}

// Carga los datos del cliente en encabezado documento

function cargar_encabezado(datos){

  document.getElementById("direccion-cliente").innerText = datos.address
  document.getElementById("localidad-cliente").innerText = datos.city + " - " + datos.state
  document.getElementById("cuit-cliente").innerText = "Cuit : " + datos.tax_id
  document.getElementById("condicion-cliente").innerText = "Condicion : " + datos.tax_condition

}

function resetDatosCliente(){
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

function showMoreOptions(){
  document.getElementById("flush-collapseOne").classList.add("show")

}

function hideMoreOptions(){
  document.getElementById("flush-collapseOne").classList.remove("show")
}



//DATATABLE

$(document).ready(function() {
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
  $(document).on("input change", ".producto, .cantidad, .precio", function() {
      $("#btnNuevoItem").prop("disabled", !ultimaFilaCompleta());
  });

  // Evento para calcular el total en tiempo real
  $(document).on("input change", ".cantidad, .precio, .descuento", function() {
      let fila = $(this).closest("tr");
      let cantidad = parseFloat(fila.find(".cantidad").val()) || 0;
      let precio = parseFloat(fila.find(".precio").val()) || 0;
      let descuento = parseFloat(fila.find(".descuento").val()) || 0;
      
      let subtotal = cantidad * precio;
      let totalConDescuento = subtotal - (subtotal * descuento / 100);
      
      fila.find(".total").text(totalConDescuento.toFixed(2));
  });

  // Evento para asignar precio automáticamente según el producto seleccionado
  $(document).on("change", ".producto", function() {
      let fila = $(this).closest("tr");
      let precioBase = $(this).find("option:selected").data("precio") || 0;
      fila.find(".precio").val(precioBase).trigger("input"); // Disparar evento de input para recalcular
  });

  // Evento para agregar una nueva fila
  $("#btnNuevoItem").click(function() {
      if (!ultimaFilaCompleta()) return;

      table.row.add([
          `<select class="producto">
              <option value="">Seleccionar producto</option>
              <option value="Producto A" data-precio="100">Producto A</option>
              <option value="Producto B" data-precio="200">Producto B</option>
              <option value="Producto C" data-precio="300">Producto C</option>
          </select>`,
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
  $(document).on("click", ".btn-delete", function() {
      table.row($(this).closest("tr")).remove().draw(false);
      $("#btnNuevoItem").prop("disabled", !ultimaFilaCompleta());
  });
});