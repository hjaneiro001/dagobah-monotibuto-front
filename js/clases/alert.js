export class Alert{

    constructor() {

    }

    show(){
        document.getElementById("alert").classList.remove("d-none")
    }

    hide(){
        document.getElementById("alert").classList.add("d-none")
    }

    message(msg){
        document.getElementById("alert-msg").innerHTML = msg
    }

}

  