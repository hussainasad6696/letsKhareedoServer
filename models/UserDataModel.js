const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDataSchema = new Schema({
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
         type: String,
    },
    address: {
        type: String,
    }
});