export class Alert {
    constructor() {
        this.callback = null; 
        this.init();
    }

    init() {
        const closeButton = document.getElementById("btn-close-alert");
        if (closeButton) {
            closeButton.addEventListener("click", () => {
                this.hide();
                if (this.callback) {
                    this.callback(); // Ejecuta la función asignada
                }
            });
        }
    }

    show(msg, callback = null) {
        let alertElement = document.getElementById("alert");
        let overlayElement = document.getElementById("overlay");
        let msgElement = document.getElementById("alert-msg");

        if (msgElement) {
            msgElement.innerHTML = msg;
        }

        alertElement.classList.remove("d-none");
        overlayElement.classList.remove("d-none");

        this.callback = callback;
    }

    hide() {
        const alertElement = document.getElementById("alert");
        const overlayElement = document.getElementById("overlay");
    
        if (this.callback) {
            this.callback();  // Ejecuta la función antes de ocultar la alerta
            this.callback = null; // Limpia después de ejecutarla
        }
    
        alertElement.classList.add("d-none");
        overlayElement.classList.add("d-none");
    }
    
}
