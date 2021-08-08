const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParternsDetailSchema = new Schema({
    partnerName: {
        type: String
    },
    investment: {
        type: Number
    },
    latestInvestment:{
        type: String
    },
    date: {
        type: String
    },
    investmentDate_timeInput: {
        type: String
    },
    investmentDate_ampm: {
        type: String
    },
    email : {
        type: String
    },
    phoneNumber: {
        type: String
    },
    verifKey : {
        type: String
    },
    password: {
        type: String,
    }
});

const PartnersDetail = mongoose.model('PartnersDetail', ParternsDetailSchema);
module.exports = PartnersDetail;