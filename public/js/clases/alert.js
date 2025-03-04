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
            });
        }
    }

    show(msg, callback = null,color = null) {
        if(color=='warning'){
            document.getElementById("alert").classList.remove('alert-success')
            document.getElementById("alert").classList.add('alert-warning')
        }else{
            document.getElementById("alert").classList.remove('alert-warning')
            document.getElementById("alert").classList.add('alert-success')
        }
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

        // Asegurarse de que callback se ejecute solo una vez
        if (this.callback) {
            const tempCallback = this.callback; 
            this.callback = null; // Evita llamadas repetidas
            tempCallback(); // Ejecuta la función después de resetearla
        }

        alertElement.classList.add("d-none");
        overlayElement.classList.add("d-none");
    }
}
