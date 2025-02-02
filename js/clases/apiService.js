
export class ApiService {

    constructor() {
        this.url = "http://localhost:5000/"
     //   this.url = "https://tatooine.herokuapp.com/"
        this.headers = {
            'Content-Type': 'application/json'
        }

    //    this.token = localStorage.getItem("token");

    }

    //Agrega Token al header
    #addToken() {

        this.headers["Authorization"] = "Bearer " + this.token;
    
    }

    //CLIENTES
    async getAllClientes(){
      try {
        let response = await fetch(this.url + "clients/");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        let data = await response.json();
    
        return {
          getStatus: () => response.status,
          getBody: () => data             
        };

      } catch (error) {
        console.error("Error fetching clients:", error);
        return {
          getStatus: () => null, 
          getBody: () => { return { error: error.message }; }
        };
      }

    }

    async getCliente(id){

      let response = await fetch("http://localhost:5000/clients/"+id);
      let data = await response.json();

      return {
        getStatus: () => response.status, 
        getBody: () => data             
      };

    }

    
    //PRODUCTOS
    async getAllProductos(){
      try {
        let response = await fetch(this.url + "products/");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        let data = await response.json();
    
        return {
          getStatus: () => response.status,
          getBody: () => data             
        };

      } catch (error) {
        console.error("Error fetching productss:", error);
        return {
          getStatus: () => null, 
          getBody: () => { return { error: error.message }; }
        };
      }

    }

    //Documentos
    async postDocument(document) {
      
      let response = await fetch(this.url + "documents/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(document),
      });
    
      let data = await response.json();
    
      return {
        getStatus: () => response.status,
        getBody: () => data,
      };
    }
    
    async getBill(id){

        let response = await fetch(`http://localhost:5000/documents/bill/${id}`);
    
        if (!response.ok) {
            throw new Error(`Error al obtener el PDF: ${response.statusText}`);
        }
    
        let blob = await response.blob(); // Convertir la respuesta en un Blob
        let url = window.URL.createObjectURL(blob); // Crear una URL para el Blob
    
        // Abrir el PDF en una nueva pestaña
        window.open(url, '_blank');
    
        // Liberar la URL creada cuando ya no se necesite
        setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  
    }
   
}

