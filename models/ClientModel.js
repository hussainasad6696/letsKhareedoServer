const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    orderList: [{ 
        date:{
            type: Date,
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
        }],
        bill: {
            type: Number
        }
    }]
});

const Clients = mongoose.model('Client', ClientSchema);
module.exports =Clients;