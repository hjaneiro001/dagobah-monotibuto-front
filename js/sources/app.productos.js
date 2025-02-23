import {
    ApiService
} from "../clases/apiService.js"

import {
    Spinner
} from "../clases/spinner.js"

import {
    ProductBody
} from "../clases/bodys/product_body.js"

import {
    Alert
} from "../clases/alert.js"

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

// controla si es ALTA O MODIFICACION
var tipo_persistencia

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
                return `<div><p class="mb-0 text-end">${row.currency['denomination']} ${row.price}</p></div>`;
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
                return `
                    <button class="btn btn-outline-secondary me-2 boton-delete-pr"
                    data-bs-toggle="modal" data-bs-target="#deleteProductModal" data-id="${row.product_id}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-outline-secondary mr-2 boton-editar-pr" 
                        data-bs-toggle="modal" data-bs-target="#product-modal" 
                        data-id="${row.product_id}">
                        <i class="bi bi-pen"></i>
                    </button>
                `;
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

//SUBMIT FORM
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

    if (tipo_persistencia == "POST") {
        await post_product()
    } else if (tipo_persistencia == "PUT") {
        await put_product()
    } else {
        obj_alert.show("Error en la transaccion", salirAlerta)
        return
    }

});

// Alta Producto
document.getElementById("btn-alta-producto").addEventListener("click", () => {
    $("#product-form")[0].reset();
    tipo_persistencia = "POST"
})


async function post_product() {

    try {
        let product_body_sent = construir_producto()

        let response = await apiservice.postProduct(product_body_sent)

        let response_error = response.getStatus()
        if (response_error >= 400) {
            if (response_error == 409) {
                obj_alert.show("Producto ya existente", salirAlerta)
                return
            }
            else if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta)
                return
            }
            else {
                obj_alert.show("Hubo un error en el alta del producto", salirAlerta)
                return
            }
        }

        obj_spinner.hide()
        obj_alert.show("Producto creado con exito", salirAlerta)
        $("#product-modal").modal("hide");
        refreshTableProductos()
        reset_from()

    }
    catch (error) {
        obj_alert.show(error.message, salirAlerta)
        obj_spinner.hide()
    }
}

// Edicion Producto

$('#products-table tbody').on('click', '.boton-editar-pr', function () {
    let productId = $(this).data('id');
    tipo_persistencia = "PUT"
    if (productId) {
        editar_producto(productId)
    }
});

async function editar_producto(id) {

    $('#product-form').attr('data-id', id);
    let product = await apiservice.getProducts(id)
    let data_product = product.getBody()

    if (product.getStatus >= 400) {
        obj_alert.show("Error en la carga del producto", salirAlerta)
    } else {
        $('#nombre-prod').val(data_product.name);
        $('#descripcion-prod').val(data_product.description);
        $('#codigo-prod').val(data_product.code);
        $('#codigo-barras-prod').val(data_product.bar_code);
        $('#iva-prod').val(data_product.iva).trigger("change");
        $('#moneda-prod').val(data_product.currency['value']).trigger("change");
        $('#precio-prod').val(data_product.price);
        $('#tipo-prod').val(data_product.product_type).trigger("change");
        $('#packing-prod').val(data_product.pack);
    }
}

async function put_product() {

    try {

        let product_body_sent = construir_producto()
        let id = $('#product-form').data('id');

        let response = await apiservice.putProduct(id, product_body_sent)

        let response_error = response.getStatus()

        if (response_error >= 400) {

            if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta)
                return
            }
            else {
                obj_alert.show("Hubo un error en la modificacion del producto", salirAlerta)
                return
            }

        }

        obj_spinner.hide()
        obj_alert.show("Producto modificado con exito", salirAlerta)
        $("#product-modal").modal("hide");
        refreshTableProductos()
        reset_from

    }
    catch (error) {
        obj_alert.show(error.message, salirAlerta)
        obj_spinner.hide()
    }

}

//DELETE PRODUCTO
$('#products-table tbody').on('click', '.boton-delete-pr', function () {
    let productId = $(this).data('id');
    $('#deleteProductModal').attr('data-id', productId);
});

document.getElementById("btn-eliminar-producto").addEventListener("click",()=>{
    let productId = $('#deleteProductModal').data('id');
    delete_product(productId)
})

async function delete_product(id){

    try {

     
        let response = await apiservice.deleteProduct(id)

        let response_error = response.getStatus()

        if (response_error >= 400) {

            if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta)
                return
            }
            else {
                obj_alert.show("Hubo un error en la eliminacion del producto", salirAlerta)
                return
            }

        }

        obj_spinner.hide()
        obj_alert.show("Producto eliminado con exito", salirAlerta)
        refreshTableProductos()

    }
    catch (error) {
        obj_alert.show(error.message, salirAlerta)
        obj_spinner.hide()
    }
}



//COMUNES PARA ALTA Y MODIFICACION
function construir_producto() {

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

async function refreshTableProductos() {
    let currentPage = products_table.page(); 
    array_data = await apiservice.getAllProducts();
    data_products = array_data.getBody();
    
    products_table.clear().rows.add(data_products).draw(false); 
    products_table.page(currentPage).draw(false); 
}


function salirAlerta() {
    reset_from()
}

function reset_from() {
    $("#product-form")[0].reset();
    $("#product-form").removeClass("was-validated");
    $('#product-form').attr('data-id', "");
}

