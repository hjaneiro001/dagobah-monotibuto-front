
export class ApiService {

  constructor() {

    this.env = "_local"

    if (this.env == "production" || this.env == "stage") {
      this.url = `https://dagobah-service-${this.env}.up.railway.app/`
    } else {
      this.url = "http://localhost:5000/"
    }

    this.token = sessionStorage.getItem("token");

  }

  _validateAccess(requiredPermissions) {
    if (!auth.authGuard()) {
      alert("Token inválido o expirado")
      return {
        valid: false,
        status: 401,
        error: "Token inválido o expirado"
      };
    }

    if (!requiredPermissions) {
      return { valid: true };
    }

    const token = sessionStorage.getItem("token");
    const payload = auth.parseJwt(token);

    const hasAnyPermission = Array.isArray(requiredPermissions)
      ? requiredPermissions.some(p => payload.permissions?.includes(p))
      : payload.permissions?.includes(requiredPermissions);

    if (!hasAnyPermission) {
      alert("Permiso denegado")
      return {
        valid: false,
        status: 403,
        error: "Permiso denegado"
      
      };
    }

    return { valid: true };
  }



  // CLIENTES

  async getAllClientes() {

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

    try {
      let response = await fetch(this.url + "clients/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      });

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
        getBody: () => ({ error: error.message })
      };
    }
  }


  async getCliente(id) {

      const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }
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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }
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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

    const access = this._validateAccess(['HOLOCRON_ALL','HOLOCRON_READ']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

    try {
      let response = await fetch(this.url + "products/" + id);
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

    const access = this._validateAccess(['HOLOCRON_ALL']);
    if (!access.valid) {
      return {
        getStatus: () => access.status,
        getBody: () => ({ error: access.error })
      };
    }

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

