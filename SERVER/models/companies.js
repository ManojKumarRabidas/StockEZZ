const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    code: {type: 'string', required: true},
    company_type: {type: 'string', required: true},
    name: {type: 'string', required: true},
    phone: {type: 'number', required: true},
    email: {type: 'string', required: true},
    address: {type: 'string', required: true},
    pin: {type: 'number', required: true},
    gstNo: {type: 'number', required: true},
    active: {type: Boolean},
    subscription: {type: Boolean},
    subscriptionDuration: {type: 'number'},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
}, { timestamps: true });

companySchema.index({ code: 1 }, { unique: true });
const Company = mongoose.model('companies', companySchema)
module.exports = Company