export class DocumentBody {
    constructor() {
        this.data = {
            client_id: null,
            document_type: "FACTURAC",
            date: new Date().toISOString().split('T')[0],
            date_serv_from: new Date().toISOString().split('T')[0],
            date_serv_to: new Date().toISOString().split('T')[0],
            expiration_date: new Date().toISOString().split('T')[0],
            exchange_rate: 1.0,
            items: []
        };
    }

    setClientId(clientId) {
        this.data.client_id = clientId;
    }

    setDocumentType(type) {
        this.data.document_type = type;
    }

    setDate(date) {
        this.data.date = date;
    }

    setDateExpiration(expiration) {
        this.data.expiration_date = expiration;
    }

    setDateFrom(from) {
        this.data.date_serv_from = from;
    }

    setDateTo(to) {  
        this.data.date_serv_to = to;
    }

    addItem(productId, quantity, unitPrice, discount) {
        this.data.items.push({
            product_id: productId,
            quantity: quantity,
            unit_price: unitPrice,
            discount
        });
    }

    getDocument() {
        return this.data;
    }
}
