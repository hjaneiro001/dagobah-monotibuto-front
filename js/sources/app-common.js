import {
  handlerTemplate
} from "../clases/handlerTemplate.js"

/////////////////////////////////////
//                                 //
//         MANEJO SPA              //
//                                 //
/////////////////////////////////////

const ctnHome = document.getElementById("home-section")
const ctnFacturacion = document.getElementById("facturacion-section")
const ctnClientes = document.getElementById("clientes-section")
const ctnProductos = document.getElementById("productos-section")

const plantilla = new handlerTemplate

async function mostrarOcultar() {

  let response

  ctnHome.classList.add('d-none')
  ctnFacturacion.classList.add("d-none")
  ctnClientes.classList.add("d-none")
  ctnProductos.classList.add("d-none")

  switch (location.hash) {

    case "#/home":

      ctnHome.classList.remove("d-none")
      if (ctnHome.getAttribute("inicio") == "false") {
        $("#home-section").html(await plantilla.getHome())
        ctnHome.setAttribute("inicio", "true")
      }
      break;

    case "#/facturacion":

      ctnFacturacion.classList.remove("d-none")
      if (ctnFacturacion.getAttribute("inicio") == "false") {
        $("#facturacion-section").html(await plantilla.getFacturacion())
        ctnFacturacion.setAttribute("inicio", "true")
      }
      break;

    case "#/clientes":

      ctnClientes.classList.remove("d-none")
      if (ctnClientes.getAttribute("inicio") == "false") {
        $("#clientes-section").html(await plantilla.getClientes())
        ctnClientes.setAttribute("inicio", "true")
      }
      break;

    case "#/productos":

    ctnProductos.classList.remove("d-none")
    if (ctnProductos.getAttribute("inicio") == "false") {
      $("#productos-section").html(await plantilla.getProductos())
      ctnProductos.setAttribute("inicio", "true")
    }
    break;


  }


}

window.addEventListener("hashchange", mostrarOcultar)

// Delega eventos a varios elementos (Upgradear a Delegacion de eventos es mas nuevo)
var botonHome = document.querySelectorAll(".boton-menu-home")
botonHome.forEach(element => {
  element.addEventListener("click", () => {
    location.hash = "/home"
  });
})

document.getElementById("boton-menu-facturacion").addEventListener("click", () => {
  location.hash = "/facturacion"
})

document.getElementById("boton-menu-clientes").addEventListener("click", () => {
  location.hash = "/clientes"
})

document.getElementById("boton-menu-productos").addEventListener("click", () => {
  location.hash = "/productos"
})


if (!location.hash) {
  location.hash = "/home"
} else {
  mostrarOcultar()
}

/////////////////////////////////////////////
//                                         //
//           FIN MANEJO SPA                //
//                                         //
/////////////////////////////////////////////
