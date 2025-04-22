const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    bill_type: {type: String, required: true},
    bill_no: {type: String},
    date: {type: Date, required: true},
    items: {type: [Object], required: true},
    total: {type: Number},
    additional_charges: {type: Number},
    discount: {type: Number},
    grand_total: {type: Number},
    paid_amount: {type: Number},
    expected_profit: {type: Number},
    total_profit: {type: Number},
    remaining_amount: {type: Number},
    installation_status: {type: String},
    info: {type: String},
    buyer_id: {type: mongoose.Schema.Types.ObjectId},
    payments: {
            type: [
              {
                paid_amount: Number,
                payment_mode: String,
                info: String,
                billed_at: { type: Date, default: Date.now },
                updatedBy: mongoose.Schema.Types.ObjectId,
              },
            ],
            default: [],
    },
    returns: {
            type: [
              {
                item_id: mongoose.Schema.Types.ObjectId,
                quantity: Number,
                billed_at: { type: Date, default: Date.now },
                updatedBy: mongoose.Schema.Types.ObjectId,
              },
            ],
            default: [],
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const Bill = mongoose.model('bills', billSchema)
module.exports = Bill