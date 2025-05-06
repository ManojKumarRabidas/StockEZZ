const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    code: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String},
    email: {type: String},
    address: {type: String},
    pin: {type: String},
    aadhar: {type: String},
    active: {type: Boolean},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

buyerSchema.index({ company_id: 1, name: 1, phone: 1 }, { unique: true });
const Buyer = mongoose.model('buyers', buyerSchema)
module.exports = Buyer