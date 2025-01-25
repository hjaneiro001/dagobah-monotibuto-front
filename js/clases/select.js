
class Select {

    constructor(id, indiceOption, indiceValue, datos, indiceKey = 0) {

        this.id = id
        this.indiceOption = indiceOption
        this.indiceValue = indiceValue
        this.array = []
        this.datos = datos
        this.indiceKey = indiceKey

    }


    getIndex() {
        return document.getElementById(this.id).selectedIndex
    }

    getValue() {
        return document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].getAttribute("value");
    }

    getText() {
        return document.getElementById(this.id).options[document.getElementById(this.id).selectedIndex].innerText
    }

    setInicio() {
        document.getElementById(this.id).selectedIndex = 0
    }

    async setIndex(index) {
        document.getElementById(this.id).selectedIndex = index
    }

    buscarText(texto) {

        let select = document.getElementById(this.id);


        for (var i = 1; i < select.length; i++) {

            //  console.log(select.options[i].innerText)
            if (select.options[i].innerText == texto) {
                return (select.options[i].getAttribute("value"))
            }

        }


    }

    async buscarSelect(value) {

        let select = document.getElementById(this.id);

        // recorremos todos los valores del select
        for (var i = 1; i < select.length; i++) {
            if (select.options[i].getAttribute("value") == value) {
                // seleccionamos el valor que coincide
                select.selectedIndex = i;
            }
        }


    }

    borrarSelect() {
        let $select = document.getElementById(this.id)
        for (let i = $select.options.length; i >= 1; i--) {
            $select.remove(i);
        }
    }

    async cargarSelect() {

        this.array = await this.datos()
        let select = document.getElementById(this.id);

        this.borrarSelect()

        this.array.forEach(element => {

            // Creacion Dom Element
            let opcion = document.createElement("option");

            // Insertion DOM Element
            select.appendChild(opcion);

            // Insertion Datos Elements 
            opcion.innerText = Object.values(element)[this.indiceOption];
            opcion.setAttribute("value", Object.values(element)[this.indiceValue]);

        })

    }

}

class SelectRubro extends Select {

    constructor(selectID) {

        let id = selectID
        let indiceOption = 1;
        let indiceValue = 0;

        let datos = async () => {

            let tatooineService = new TatooineService()

            let array = []

            let getAllRubros = await tatooineService.getAllRubros();
            if (await getAllRubros.getStatus() == 200) {
                array = await getAllRubros.getBody();
            } else if (await getAllRubros.getStatus() >= 400) {
                alertaTokenInvalido.create()
                alertaTokenInvalido.setAccion(() => {
                    window.location.href = "./login.html"
                    alertaTokenInvalido.borrarAccion()
                })
            } else {
                alertaFalloSelect.create()
            }
            return array
        }

        super(id, indiceOption, indiceValue, datos);

    }

}

