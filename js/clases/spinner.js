export class Spinner{

    constructor() {

    }

    show(){
        document.getElementById("spinner").classList.remove("d-none")
    }

    hide(){
        document.getElementById("spinner").classList.add("d-none")
    }


}

  