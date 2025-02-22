const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    code: {type: String, required: true},
    name: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, required: true},
    sub_category: {type: String},
    companyId: {type: mongoose.Schema.Types.ObjectId},
    active: {type: Boolean},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

itemSchema.index({ code: 1, name: 1 }, { unique: true });
const Item = mongoose.model('items', itemSchema)
module.exports = Item