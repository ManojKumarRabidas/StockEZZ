const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    batch_id: {type: String},
    category_id: {type: mongoose.Schema.Types.ObjectId},
    sl_no: {type: String},
    date: {type: Date, required: true},
    time: {type: Date},
    sub_category: {type: String},
    item_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    brand_id: {type: mongoose.Schema.Types.ObjectId},
    color: {type: String},
    capacity: {type: String},
    height: {type: String},
    power: {type: String},
    description: {type: String},
    model: {type: String},
    seller_id: {type: mongoose.Schema.Types.ObjectId},
    total_quantity: {type: Number},
    quantity: {type: Number},
    batch_no: {type: String},
    batch_buy_price: {type: Number},
    batch_sell_price: {type: Number},
    per_peace_buy_price: {type: Number},
    per_peace_sell_price: {type: Number},
    batch_mfg_date: {type: Date},
    batch_exp_date: {type: Date},
    batch_warrantee_guarantee: {type: String},
    batch_warrantee_guarantee_duration: {type: Number},
    item_status: {type: String},
    return_reason: {type: String},
    remarks: {type: String},
    unique_code: {type: String},
    mfg_date: {type: Date},
    exp_date: {type: Date},
    item_buy_price: {type: Number},
    item_sell_price: {type: Number},
    warrantee_guarantee: {type: String},
    warrantee_guarantee_duration: {type: Number},  
    sell_details: {
        type: [
          {
            buyer_id: mongoose.Schema.Types.ObjectId,
            sell_price: Number,
            quantity: Number,
            profit: Number,
            sold_at: { type: Date, default: Date.now },
          },
        ],
        default: [],
      },
    created_by: {type: mongoose.Schema.Types.ObjectId},
    updated_by: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const Stock = mongoose.model('stock', stockSchema)
module.exports = Stock