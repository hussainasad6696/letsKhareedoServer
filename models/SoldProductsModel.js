const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoldProductsSchema = new Schema({
    uuid: {
        type: String,
    },
    imagePath: {
        type: String,
    },
    price: {
        type: String,
    },
    quantity: {
        type: int,
    },
    description: {
        type: String,
    },
    material: {
        type: String,
    },
    brand: {
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

const SoldProducts = mongoose.model('SoldProduct', SoldProductsSchema);
module.exports = SoldProducts;