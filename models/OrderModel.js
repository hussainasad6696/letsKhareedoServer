const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
    customerName: {
        type: String
    },
    customerID: {
        type: String
    },
    date: {
        type: String
    },
    bill: {
        type: String
    },
    status: {
        type: String
    },
    products: [{ 
        productID: { 
            type: String
        },
        quantity: { 
            type: Number
        },
        size: { 
            type: String
        }
    }]
});

const OrderSchema = mongoose.model('OrderSchema', OrderDetailSchema);
module.exports = OrderSchema;