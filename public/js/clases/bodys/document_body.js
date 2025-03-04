export class DocumentBody {

    constructor(){
       this.reset()
    }
    
    reset() {
        this.client_id = null;
        this.date = this.getFormattedDate()
        this.date_serv_from = this.getFormattedDate()
        this.date_serv_to = this.getFormattedDate()
        this.expiration_date = this.getFormattedDate()
        this.items = [];
    }

    getFormattedDate(date = new Date()) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }


    setClientId(clientId) {
        this.client_id = clientId;
    }


    setDate(date) {
        this.date = date;
    }

    setDateExpiration(expiration) {
        this.expiration_date = expiration;
    }

    setDateFrom(from) {
        this.date_serv_from = from;
    }

    setDateTo(to) {  
        this.date_serv_to = to;
    }

    addItem(productId, quantity, unitPrice, discount) {
        this.items.push({
            product_id: productId,
            quantity: quantity,
            unit_price: unitPrice,
            discount
        });
    }

    getDocument() {
        return { ...this };
    }
}
