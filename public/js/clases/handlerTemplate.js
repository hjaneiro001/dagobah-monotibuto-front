export class handlerTemplate {

    async html(url) {
        let response = await fetch(url)
        return await response.text()
    }

    // Pages
    async getHome(){
        return await this.html("./pages/home.html")
    }

    async getFacturacion(){
        return await this.html("./pages/facturacion.html")
    }
  
    async getComprobantes(){
        return await this.html("./pages/comprobantes.html")
    }
  
    async getClientes(){
        return await this.html("./pages/clientes.html")
    }

    async getProductos(){
        return await this.html("./pages/productos.html")
    }


}