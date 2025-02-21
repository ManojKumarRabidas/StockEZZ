const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    companyId: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    active: {type: Boolean},
    createdBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

brandSchema.index({ companyId: 1, name: 1 }, { unique: true });
const Brand = mongoose.model('brands', brandSchema)
module.exports = Brand