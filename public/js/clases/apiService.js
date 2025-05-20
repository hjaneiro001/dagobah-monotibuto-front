
export class ApiService {

  constructor() {

    this.env = "_local"
    
    if(this.env == "production" || this.env == "stage"){
      this.url=`https://dagobah-service-${this.env}.up.railway.app/`  
    }else{
      this.url = "http://localhost:5000/"   
    }
    
    this.headers = {
      'Content-Type': 'application/json'
    }

    //    this.token = sessionStorage.getItem("token");

  }

  //Agrega Token al header
  #addToken() {

    this.headers["Authorization"] = "Bearer " + this.token;

  }

  //CLIENTES
  async getAllClientes() {
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

  async getCliente(id) {

    try {
      let response = await fetch(this.url + "clients/" + id);
      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data
      };
    } catch {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }

  async postClient(client) {

    try {
      let response = await fetch(this.url + "clients/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }

  async putClient(id, client) {

    try {
      let response = await fetch(this.url + "clients/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }


  async deleteClient(id) {

    alert(id)

    try {
      let response = await fetch(this.url + "clients/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching clients:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }


  //DOCUMENTOS
  async postDocument(document) {

    try {
      let response = await fetch(this.url + "documents/factura", {
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

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }

  async getBill(id) {

    let response = await fetch(this.url + `/documents/bill/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener el PDF: ${response.statusText}`);
    }

    let blob = await response.blob();
    let url = window.URL.createObjectURL(blob);

    // Insertar el PDF en el iframe dentro del modal
    let pdfFrame = document.getElementById("pdfFrame");
    pdfFrame.src = url;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById("pdfModal"));
    modal.show();

    // Liberar la URL creada después de un tiempo para evitar desperdicio de memoria
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  }

  async getTicket(id) {
    let response = await fetch(this.url + `documents/ticket/${id}`);

    if (!response.ok) {
      throw new Error(`Error al obtener el PDF: ${response.statusText}`);
    }

    let blob = await response.blob();
    let url = window.URL.createObjectURL(blob);

    // Insertar el PDF en el iframe dentro del modal
    let pdfFrame = document.getElementById("pdfFrame");
    pdfFrame.src = url;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById("pdfModal"));
    modal.show();

    // Liberar la URL creada después de un tiempo para evitar desperdicio de memoria
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  }

  async getAllDocuments() {
    try {
      let response = await fetch(this.url + "documents/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }

  }


  // Productos

  async postProduct(product) {

    try {
      let response = await fetch(this.url + "products/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }


  async putProduct(id, product) {

    try {
      let response = await fetch(this.url + "products/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }

  async getAllProducts() {
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
      console.error("Error fetching clients:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }

  }

  async getProducts(id) {

    try {
      let response = await fetch(this.url +"products/" + id);
      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data
      };

    } catch {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }

  }


  async deleteProduct(id) {

    try {
      let response = await fetch(this.url + "products/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();

      return {
        getStatus: () => response.status,
        getBody: () => data,
      };

    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        getStatus: () => null,
        getBody: () => { return { error: error.message }; }
      };
    }
  }


}

