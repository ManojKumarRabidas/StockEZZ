const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    sl_no: {type: String},
    date: {type: Date},
    time: {type: Date},
    company_code: {type: String},
    sellerId: {type: mongoose.Schema.Types.ObjectId},
    categoryId: {type: mongoose.Schema.Types.ObjectId},
    sub_category: {type: String},
    itemId: {type: mongoose.Schema.Types.ObjectId},
    batch_no: {type: String},
    quantity: {type: Number},
    batch_price: {type: Number},
    item_status: {type: String},
    return_reason: {type: String},
    remarks: {type: String},
    stock_details: {type: [Object]},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const Stock = mongoose.model('stock', stockSchema)
module.exports = Stock