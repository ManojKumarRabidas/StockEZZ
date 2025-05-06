const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    code: {type: String, required: true},
    name: {type: String, required: true},
    company_name: {type: String},
    branch: {type: String},
    phone: {type: String},
    email: {type: String},
    address: {type: String},
    pin: {type: String},
    active: {type: Boolean},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

sellerSchema.index({ company_id: 1, name: 1 }, { unique: true });
const Seller = mongoose.model('sellers', sellerSchema)
module.exports = Seller