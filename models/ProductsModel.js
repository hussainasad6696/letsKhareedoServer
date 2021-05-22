const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
    name: {
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
    },
    gender: {
        type: String,
    },
    kids: {
        type: String,
    },
    hotOrNot: {
        type: Boolean,
    }
});

const Products = mongoose.model('Product', ProductsSchema);
module.exports = Products;