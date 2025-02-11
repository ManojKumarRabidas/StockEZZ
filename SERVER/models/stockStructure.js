const mongoose = require('mongoose');

const stockStructureSchema = new mongoose.Schema({
    sl_no: {type: Boolean},
    date: {type: Boolean},
    time: {type: Boolean},
    companyCode: {type: Boolean},
    seller: {type: Boolean},
    category: {type: Boolean},
    sub_category: {type: Boolean},
    itemName: {type: Boolean},
    batchNo: {type: Boolean},
    quantity: {type: Boolean},
    batchPrice: {type: Boolean},
    itemStatus: {type: Boolean},
    returnReason: {type: Boolean},
    remarks: {type: Boolean},
    model: {type: Boolean},
    uniqueCode: {type: Boolean},
    mfgDate: {type: Boolean},
    expDate: {type: Boolean},
    item_buy_price: {type: Boolean},
    item_sell_price: {type: Boolean},
    sold_date: {type: Boolean},
    sold_to: {type: Boolean},
    warrantee_guarente: {type: Boolean},
    warrantee_guarente_duration: {type: Boolean},
    companyId: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const StockStructure = mongoose.model('stockstructure', stockStructureSchema)
module.exports = StockStructure