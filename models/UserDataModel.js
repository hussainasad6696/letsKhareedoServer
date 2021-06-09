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
    },
    sercurityToken: { //for login and authentication
        type: String,
    },
    profileImagePath: {
        type: String,
    }
});

const UserData = mongoose.model('UserData', UserDataSchema);
module.exports = UserData;