export class ProductBody {

    constructor(){
       this.reset()
    }
    
    reset() {

        this.code = ""
        this.bar_code = ""
        this.name = ""
        this.description= ""
        this.iva = ""
        this.currency = ""
        this.pack = 0
        this.price= 0
        this.product_type = ""

    }

    setCode(_code) {
        this.code = _code;
    }

    setBarCode(_bar_code) {
        this.bar_code = _bar_code;
    }

    setName(_name) {
        this.name = _name;
    }

    setDescription(_description) {
        this.description = _description;
    }

    setIva(_iva) {  
        this.iva = _iva;
    }

    setCurrency(_currency){
        this.currency = _currency
    }

    setPack(_pack){
        this.pack = _pack
    }
   
    setPrice(_price){
        this.price= _price
    }
   
    setProductType(_product_type){
        this.product_type = _product_type
    }

    getProduct() {
        return { ...this };
    }
}
