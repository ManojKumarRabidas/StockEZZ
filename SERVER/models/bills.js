const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    billNo: {type: String},
    date: {type: Date, required: true},
    items: {type: [Object], required: true},
    total: {type: Number},
    additional_charges: {type: Number},
    discount: {type: Number},
    grandTotal: {type: Number},
    payment_type: {type: String},
    paid_amount: {type: Number},
    profit: {type: Number},
    total_profit: {type: Number},
    remaining_amount: {type: Number},
    pending_installation: {type: String},
    info: {type: String},
    buyer_id: {type: mongoose.Schema.Types.ObjectId},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const Bill = mongoose.model('bills', billSchema)
module.exports = Bill