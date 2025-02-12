const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    code: {type: String, required: true},
    category: {type: String, required: true},
    sub_categories: {type: [String], required: true},
    active: {type: Boolean},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

categorySchema.index({ code: 1, category: 1 }, { unique: true });
const Category = mongoose.model('categories', categorySchema)
module.exports = Category