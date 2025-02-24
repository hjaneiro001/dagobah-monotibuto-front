export class ClientBody {

    constructor(){
       this.reset()
    }
    
    reset() {

        this.name = ""
        this.address = ""
        this.city = "Avellaneda"
        this.state= ""
        this.country = ""
        this.email = ""
        this.phone = ""
        this.tax_id= ""
        this.tax_condition = ""
        this.type_id = ""
        this.client_type = "CLIENTE"

    }

    setName(_name) {
        this.name = _name;
    }

    setAddress(_address) {
        this.address = _address;
    }

    setCity(_city) {
        this.city = _city;
    }

    setState(_state) {
        this.state = _state;
    }

    setCountry(_country) {  
        this.country = _country;
    }

    setEmail(_email){
        this.email = _email
    }

    setPhone(_phone){
        this.phone = _phone
    }
   
    setTaxId(_tax_id){
        this.tax_id= _tax_id
    }
   
    setTaxCondition(_tax_condition){
        this.tax_condition = _tax_condition
    }

    setTypeId(_type_id){
        this.type_id = _type_id
    }

    getClient() {
        return { ...this };
    }
}
