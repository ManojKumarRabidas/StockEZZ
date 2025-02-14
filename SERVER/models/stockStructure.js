const mongoose = require('mongoose');

const stockStructureSchema = new mongoose.Schema({
    sl_no: {type: Boolean},
    date: {type: Boolean},
    time: {type: Boolean},
    company_code: {type: Boolean},
    seller: {type: Boolean},
    category: {type: Boolean},
    sub_category: {type: Boolean},
    item_name: {type: Boolean},
    batch_no: {type: Boolean},
    quantity: {type: Boolean},
    batch_price: {type: Boolean},
    item_status: {type: Boolean},
    return_reason: {type: Boolean},
    remarks: {type: Boolean},
    model: {type: Boolean},
    unique_code: {type: Boolean},
    mfg_date: {type: Boolean},
    exp_date: {type: Boolean},
    item_buy_price: {type: Boolean},
    item_sell_price: {type: Boolean},
    sold_date: {type: Boolean},
    sold_to: {type: Boolean},
    warrantee_guarantee: {type: Boolean},
    warrantee_guarantee_duration: {type: Boolean},
    companyId: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const StockStructure = mongoose.model('stockstructure', stockStructureSchema)
module.exports = StockStructure