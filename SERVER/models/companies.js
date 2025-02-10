const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    code: {type: String, required: true},
    company_type: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    pin: {type: Number, required: true},
    gstNo: {type: String},
    active: {type: Boolean},
    subscription: {type: Boolean},
    subscriptionDuration: {type: Number},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

companySchema.index({ code: 1 }, { unique: true });
const Company = mongoose.model('companies', companySchema)
module.exports = Company