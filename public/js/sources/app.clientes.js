import {
    ApiService
} from "../clases/apiService.js"

import {
    Spinner
} from "../clases/spinner.js"

import {
    ClientBody
}from "../clases/bodys/client_body.js"

import{
    ClientModificacionBody
}from "../clases/bodys/client_modificacion_body.js"

import {
    Alert
} from "../clases/alert.js"

let apiservice = new ApiService
let client_body = new ClientBody
let client_modificacion_body = new ClientModificacionBody
let obj_alert = new Alert

// Inicilaiza y lanza spinner
let obj_spinner = new Spinner
obj_spinner.show()

// Crea array para datatable
var array_data = []
array_data = await apiservice.getAllClientes()
var data_clients = array_data.getBody()

// controla si es ALTA O MODIFICACION
var tipo_persistencia

// Define variable table del dtatable
var clients_table

$(document).ready(function () {

    clients_table = $('#clients-table').DataTable({

        data: data_clients,

        ordering: true,

        "autoWidth": false,

        "bInfo": false,

        "searching": true,

        "lengthMenu": [10, 20],

        "pageLength": 10,

        "bLengthChange": false,

        columns: [{
            data: 'pk_client'
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
            width: '25%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 fw-bold">${row.name}</p>
                <p class="mb-0">${row.address} ${row.city} ${row.state} </p></div>`
            }
        },
        {
            targets: 2,
            width: '15%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-end">${row.email}</p></div>`;
            }
        },
        {
            targets: 3,
            width: '15%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-center">${row.phone}</p></div>`;
            }
        },
        {
            targets: 4,
            width: '15%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-center">${row.type_id} ${row.tax_id}</p></div>`;
            }
        },
        {
            targets: 5,
            width: '10%',
            render: (data, type, row, meta) => {
                return `<div><p class="mb-0 text-center">${row.tax_condition}</p></div>`;
            }
        },
        {
            targets: -1,
            width: '10%',
            data: null,
            orderable: false,
            render: function (data, type, row, meta) {
                return `
                    <button class="btn btn-outline-secondary me-2 boton-delete-cliente"
                    data-bs-toggle="modal" data-bs-target="#deleteClientModal" data-id="${row.pk_client}">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-outline-secondary mr-2 boton-editar-cliente" 
                        data-bs-toggle="modal" data-bs-target="#client-modal" 
                        data-id="${row.pk_client}">
                        <i class="bi bi-pen"></i>
                    </button>
                `;
            }
        }
        ],

        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
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
$("#client-form").submit(async function (event) {
    obj_spinner.show()
    event.preventDefault();
    let form = document.getElementById('client-form');

    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        obj_spinner.hide()
        return;
    }

    if (tipo_persistencia == "POST") {
        await post_client()
    } else if (tipo_persistencia == "PUT") {
        await put_client()
    } else {
        obj_alert.show("Error en la transaccion", salirAlerta,'warning')
        return
    }

});

// Alta Cliente
document.getElementById("btn-alta-cliente").addEventListener("click", () => {
    $("#client-form")[0].reset();
    document.getElementById("clientModalLabel").innerText = "Alta Cliente"
    document.getElementById('numero-identificacion-cliente').disabled = false
    tipo_persistencia = "POST"
})

async function post_client() {

    try {
        let client_body_sent = construir_cliente()
   
        let response = await apiservice.postClient(client_body_sent)
        
        let response_error = response.getStatus()
        if (response_error >= 400) {
            if (response_error == 409) {
                obj_alert.show("Cliente ya existente", salirAlerta,'warning')
                obj_spinner.hide()
                return
            }
            else if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta,'warning')
                obj_spinner.hide()
                return
            }
            else {
                obj_alert.show("Hubo un error en el alta del Cliente", salirAlerta,'warning')
                obj_spinner.hide()
                return
            }
        }

        obj_spinner.hide()
        obj_alert.show("Cliente creado con exito", salirAlerta,'success')
        $("#client-modal").modal("hide");
        refreshTableClients()
        reset_form()
    }
    catch (error) {
        obj_alert.show(error.message, salirAlerta,'warning')
        obj_spinner.hide()
        $("#client-modal").modal("hide");
        reset_form()
    }
}


// Edicion Cliente

$('#clients-table tbody').on('click', '.boton-editar-cliente', function () {
    let clientId = $(this).data('id');
    document.getElementById("clientModalLabel").innerText = "Modificar Cliente"
    document.getElementById('numero-identificacion-cliente').disabled = true
    tipo_persistencia = "PUT"
    if (clientId) {
        editar_cliente(clientId)
    }
});

async function editar_cliente(id) {

    $('#client-form').attr('data-id', id);
    let client = await apiservice.getCliente(id)
    let data_client = client.getBody()

    if (client.getStatus >= 400) {
        obj_alert.show("Error en la carga del cliente", salirAlerta,'warning')
        $("#client-modal").modal("hide");
    } else {
            $('#nombre-cliente').val(data_client.name)
            $('#direccion-cliente').val(data_client.address)
            $('#localidad-cliente').val(data_client.city)
            $('#provincia-cliente').val(data_client.state)
            $('#pais-cliente').val(data_client.country)
            $('#email-cliente').val(data_client.email)
            $('#telefono-cliente').val(data_client.phone)
            $('#tipo-identificacion-cliente').val(data_client.type_id).trigger("change")
            $('#numero-identificacion-cliente').val(data_client.tax_id)
            $('#categoria-cliente').val(data_client.tax_condition).trigger("change")
    }
}

async function put_client() {

    try {

        let client_body_sent = construir_cliente_modificacion()
        let id = $('#client-form').data('id');

        let response = await apiservice.putClient(id, client_body_sent)

        let response_error = response.getStatus()

        if (response_error >= 400) {

            if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta,'warning')
                obj_spinner.hide()
                return
            }
            else {
                obj_alert.show("Hubo un error en la modificacion del cliente", salirAlerta,'warning')
                obj_spinner.hide()
                return
            }

        }

        obj_spinner.hide()
        obj_alert.show("Cliente modificado con exito", salirAlerta,'success')
        $("#client-modal").modal("hide");
        refreshTableClients()
        reset_form()

    }
    catch (error) {
        $("#client-modal").modal("hide");
        obj_alert.show(error.message, volverForm,'warning')
        obj_spinner.hide()
    }

}


//DELETE 
$('#clients-table tbody').on('click', '.boton-delete-cliente', function () {
    let clientId = $(this).data('id');
    $('#deleteClientModal').attr('data-id', clientId);
});

document.getElementById("btn-eliminar-cliente").addEventListener("click",()=>{
    let clientId = $('#deleteClientModal').data('id');
    delete_client(clientId)
})

async function delete_client(id){

    try {

     
        let response = await apiservice.deleteClient(id)

        let response_error = response.getStatus()

        if (response_error >= 400) {

            if (response_error == 500) {
                obj_alert.show("Internal api error", salirAlerta,'warning')
                return
            }
            else {
                obj_alert.show("Hubo un error en la eliminacion del cliente", salirAlerta,'warning')
                return
            }

        }

        obj_alert.show("Cliente eliminado con exito", salirAlerta,'success')
        refreshTableClients()

    }
    catch (error) {
        obj_alert.show(error.message, salirAlerta,'warning')
        obj_spinner.hide()
    }
}


//COMUNES PARA ALTA Y MODIFICACION
function construir_cliente() {

    client_body.setName($('#nombre-cliente').val())
    client_body.setAddress($('#direccion-cliente').val())
    client_body.setCity($('#localidad-cliente').val())
    client_body.setState($('#provincia-cliente').val())
    client_body.setCountry($('#pais-cliente').val())
    client_body.setEmail($('#email-cliente').val())
    client_body.setPhone($('#telefono-cliente').val())
    client_body.setTypeId($('#tipo-identificacion-cliente option:selected').text())
    client_body.setTaxId($('#numero-identificacion-cliente').val())
    client_body.setTaxCondition($('#categoria-cliente option:selected').text())
    
    return client_body.getClient()

}

function construir_cliente_modificacion() {

    client_modificacion_body.setName($('#nombre-cliente').val())
    client_modificacion_body.setAddress($('#direccion-cliente').val())
    client_modificacion_body.setCity($('#localidad-cliente').val())
    client_modificacion_body.setState($('#provincia-cliente').val())
    client_modificacion_body.setCountry($('#pais-cliente').val())
    client_modificacion_body.setEmail($('#email-cliente').val())
    client_modificacion_body.setPhone($('#telefono-cliente').val())
    client_modificacion_body.setTypeId($('#tipo-identificacion-cliente option:selected').text())
    client_modificacion_body.setTaxCondition($('#categoria-cliente option:selected').text())
    
    return client_modificacion_body.getClient()

}

async function refreshTableClients() {
    let currentPage = clients_table.page(); 
    array_data = await apiservice.getAllClientes();
    data_clients = array_data.getBody();

    clients_table.clear().rows.add(data_clients).draw(false); 
    clients_table.page(currentPage).draw(false); 
}


function salirAlerta() {
    reset_form()
}


function volverForm() {
    return
}

function reset_form() {
    $("#client-form")[0].reset();
    $("#client-form").removeClass("was-validated");
    $('#client-form').attr('data-id', "");
}

