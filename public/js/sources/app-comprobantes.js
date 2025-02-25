import{
    ApiService
}from "../clases/apiService.js"

import{
    Spinner
}from "../clases/spinner.js"

let apiservice = new ApiService

// Va a Facturacion
document.getElementById("btn-new-comp").addEventListener("click", ()=>{
    location.hash = "/facturacion"
})

// Inicilaiza y lanza spinner
let obj_spinner = new Spinner
obj_spinner.show()

// Crea array para datatable
var array_data = []
array_data = await apiservice.getAllDocuments()
var data = array_data.getBody() 

// Define variable table del dtatable
let table

$(document).ready(function () {

    table = $('#documents-table').DataTable({

        data: data,

        ordering: true,

        "autoWidth": false,

        "bInfo": false,

        "searching": true,

        "lengthMenu": [10,20],

        "pageLength": 10,

        "bLengthChange": false,

        columns: [{
                data: 'document_id'
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
                width: '15%',
                render: (data, type, row, meta) => {
                    return `<div><p class="mb-0">${row.date}</p></div>`;
                }
            },
            {
                targets: 2,
                width: '25%',
                render: (data, type, row, meta) => {
                    return `<div><p class="mb-0 fw-bold">${row.client_name}</p></div>`;
                }
            },
            {
                targets: 3,
                width: '10%',
                render: (data, type, row, meta) => {
                    return `<div><p class="mb-0">${row.document_type.document}</p></div>`;
                }
            },
            {
                targets: 4,
                width: '20%',
                render: (data, type, row, meta) => {
                    return `<div><p class="mb-0">${row.document_type.letter} -  ${row.pos}-${row.number}</p></div>`;
                }
            },
            {
                targets: 5,
                width: '15%',
                render: (data, type, row, meta) => {
                    return `<div><p class="mb-0 text-end">$ ${row.total_amount}</p></div>`;
                }
            },
            {
                targets: -1,
                width: '10%',
                data: null,
                render: function (data, type, row, meta) {                 
                        return `<div class="text-center">
                        <button id="bill-to-pdf" class="btn btn-outline-secondary btn-sm2"  data-bs-toggle="tooltip" title="Descargar factura en PDF">
                        <i class="bi bi-file-earmark-pdf"></i>
                        </button>
                        <button id="ticket-to-pdf" class="btn btn-outline-secondary btn-sm2"  data-bs-toggle="tooltip" title="Descargar ticket en PDF">
                        <i class="bi bi-ticket-perforated"></i>
                        </button>
                        </div>`
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

    $('#documents-table tbody').on('click', '#bill-to-pdf', async function () {

        let rowData = table.row($(this).parents('tr')).data()
        obj_spinner.show()
        await apiservice.getBill(rowData.document_id)
        obj_spinner.hide()

    })


    $('#documents-table tbody').on('click', '#ticket-to-pdf', async function () {

        let rowData = table.row($(this).parents('tr')).data()
        obj_spinner.show()
        await apiservice.getTicket(rowData.document_id)
        obj_spinner.hide()

    })

})

document.addEventListener("DOMContentLoaded", function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

