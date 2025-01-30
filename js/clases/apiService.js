
// // Clase Response (devolucion de la clase Request en caso de exito)
// class Response {

//     constructor(body, status) {

//         this.body = body;
//         this.status = status;

//     }

//     async getBody() {
//         return this.body.data;
//     }

//     getStatus() {
//         return this.status;
//     }
// }


// //Clase Request
// class Request {

//     constructor() {}

//     async #send(endPoint, req) {

//         const resp = await fetch(endPoint, req);
//         let datos = await resp.json();
//         return new Response(datos, resp.status);

//     }

//     async #sendWithoutBody(method, endPoint, headers) {

//         let req = {
//             method: method,
//             headers: headers
//         };

//         return this.#send(endPoint, req);

//     }

//     async #sendWithBody(method, endPoint, headers, body) {

//         let req = {
//             method: method,
//             headers: headers,
//             body: JSON.stringify(body)
//         };

//         return this.#send(endPoint, req);

//     }

//     async GET(endPoint, headers) {

//         return await this.#sendWithoutBody("GET", endPoint, headers)

//     }

//     async POST(endPoint, headers, body) {

//         return await this.#sendWithBody("POST", endPoint, headers, body)
//     }


//     async PUT(endPoint, headers, body) {

//         return await this.#sendWithBody("PUT", endPoint, headers, body)
//     }


//     async DELETE(endPoint, headers, body) {

//         return await this.#sendWithBody("DELETE", endPoint, headers, body)
//     }

// }

export class ApiService {

    constructor() {
        this.url = "http://localhost:5000/"
     //   this.url = "https://tatooine.herokuapp.com/"
        this.headers = {
            'Content-Type': 'application/json'
        }

    //  this.request = new Request();
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

   
}
