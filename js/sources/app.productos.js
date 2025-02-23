import {
    ApiService
} from "../clases/apiService.js"

import {
    Spinner
} from "../clases/spinner.js"

import{
    ProductBody
} from "../clases/bodys/product_body.js"

import{
    Alert
}from "../clases/alert.js"

let apiservice = new ApiService
let product_body = new ProductBody
let obj_alert = new Alert

// Inicilaiza y lanza spinner
let obj_spinner = new Spinner
obj_spinner.show()

// Crea array para datatable
var array_data = []
array_data = await apiservice.getAllProducts()
var data_products = array_data.getBody()

// Define variable table del dtatable
var products_table

$(document).ready(function () {

    products_table = $('#products-table').DataTable({

        data: data_products,

        ordering: false,

        "autoWidth": false,

        "bInfo": false,

        "searching": true,

        "lengthMenu": [10, 20],

        "pageLength": 10,

        "bLengthChange": false,

        columns: [{
            data: 'product_id'
        },
        {
            data: ''
        },
        {
            data: ''
        },
        {
            data: ''
        },
        {
            data: ''
        },
        {
            data: ''
        },
        {
            data: ''
        }
        ],

        columnDefs: [{
            targets: 0,
            "visible": false
        },
        {
            targets: 1,
            width: '10%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0">${row.code}</p></div>`;
            }
        },
        {
            targets: 2,
            width: '35%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 fw-bold">${row.name}</p><p class="mb-0 ">${row.description}</p></div>`;
            }
        },
        {
            targets: 3,
            width: '15%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-end">${row.currency} ${row.price}</p></div>`;
            }
        },
        {
            targets: 4,
            width: '10%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-center">${row.iva}</p></div>`;
            }
        },
        {
            targets: 5,
            width: '10%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-center">${row.product_type}</p></div>`;
            }
        },
        {
            targets: -1,
            width: '10%',
            data: null,
            render: function (data, type, row, meta) {
                return '<button id="boton-delete-pr" class="btn btn-outline-secondary me-2"><i class="bi bi-trash"></i></button><button id="boton-editar-pr" class="btn btn-outline-secondary mr-2" data-toggle="modal" data-target="#form-prod"><i class="bi bi-pen"></i></button>'
            }
        }
        ],

        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },

        info: false,

        fixedHeader: true,

        stateSave: false,

        initComplete: function (settings, json) {
            obj_spinner.hide()
        },

    })

})

// Alta Producto
$("#product-form").submit(async function (event) {
    obj_spinner.show()

    event.preventDefault();
  
    let form = document.getElementById('product-form');
  
    if (!form.checkValidity()) {
      event.stopPropagation(); 
      form.classList.add('was-validated'); 
      obj_spinner.hide()
      return; 
    }
  

    try{
        let product_body_sent = construir_producto()
        let response = await apiservice.postProduct(product_body_sent)

        let response_error = response.getStatus()
        if(response_error >= 400){
            if(response_error == 409){
                obj_alert.show("Producto ya existente",salirAlerta)
                return
            }
            else if(response_error == 500){
                obj_alert.show("Internal api error",salirAlerta)
                return
            }
        else{
            obj_alert.show("Hubo un error en el alta del producto",salirAlerta)
            return
            }
        }
        
        obj_spinner.hide()
        obj_alert.show("Producto creado con exito",salirAlerta)
        $("#product-modal").modal("hide");

      }
      catch(error){
        obj_alert.show(error.message,salirAlerta)
        obj_spinner.hide()
      }

  });
  
function construir_producto(){

    product_body.setName($('#nombre-prod').val())
    product_body.setDescription($('#descripcion-prod').val())
    product_body.setCode($('#codigo-prod').val())
    product_body.setBarCode($('#codigo-barras-prod').val())
    product_body.setIva($('#iva-prod option:selected').text())
    product_body.setCurrency($("#moneda-prod option:selected").text())
    product_body.setPrice($('#precio-prod').val())
    product_body.setProductType($('#tipo-prod option:selected').text())
    product_body.setPack($('#packing-prod').val())

    return product_body.getProduct()

}


async function refreshTableProductos(){
    array_data = await apiservice.getAllProducts()
    data_products = array_data.getBody()   
    products_table.clear().rows.add(data_products).draw();
}

function salirAlerta(){
    refreshTableProductos()
}

// Edicion Producto


