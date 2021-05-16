const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
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

const Products = mongoose.model('Product', ProductsSchema);
module.exports = Products;