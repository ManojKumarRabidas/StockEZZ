const mongoose = require('mongoose');

const stockStructureSchema = new mongoose.Schema({
    sl_no: {type: Boolean},
    date: {type: Boolean},
    time: {type: Boolean},
    sub_category: {type: Boolean},
    item: {type: Boolean},
    brand: {type: Boolean},
    color: {type: Boolean},
    capacity: {type: Boolean},
    height: {type: Boolean},
    power: {type: Boolean},
    description: {type: Boolean},
    seller: {type: Boolean},
    quantity: {type: Boolean},
    batch_no: {type: Boolean},
    batch_buy_price: {type: Boolean},
    batch_sell_price: {type: Boolean},
    per_peace_buy_price: {type: Boolean},
    per_peace_sell_price: {type: Boolean},
    batch_mfg_date: {type: Boolean},
    batch_exp_date: {type: Boolean},
    batch_warrantee_guarantee: {type: Boolean},
    batch_warrantee_guarantee_duration: {type: Boolean},
    item_status: {type: Boolean},
    return_reason: {type: Boolean},
    remarks: {type: Boolean},
    model: {type: Boolean},
    unique_code: {type: Boolean},
    mfg_date: {type: Boolean},
    exp_date: {type: Boolean},
    item_buy_price: {type: Boolean},
    item_sell_price: {type: Boolean},
    warrantee_guarantee: {type: Boolean},
    warrantee_guarantee_duration: {type: Boolean},
    companyId: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const StockStructure = mongoose.model('stockstructure', stockStructureSchema)
module.exports = StockStructure