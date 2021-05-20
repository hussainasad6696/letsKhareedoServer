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
    
    type: {
        shirt: {
            size: {
                type: String,
            },
        },
        pant:{
            waist: [{
                type: String
            }]
        }
    },
});

const Clients = mongoose.model('Client', ClientSchema);
module.exports =Clients;