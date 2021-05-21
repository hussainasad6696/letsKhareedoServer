const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoldProductsSchema = new Schema({
    pid: {
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
        type: String,
    },
    pending: {
        type: Number,
    }
});

const SoldProducts = mongoose.model('SoldProduct', SoldProductsSchema);
module.exports = SoldProducts;