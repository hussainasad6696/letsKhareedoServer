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
        type: Number,
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
        type: String,
    },
    size: {
        type: String
    }
});

const Products = mongoose.model('Product', ProductsSchema);
module.exports = Products;