const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    code: {type: String, required: true},
    user_type: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: Number, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    pin: {type: Number, required: true},
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

userSchema.index({ code: 1 }, { unique: true });
const User = mongoose.model('user', userSchema)
module.exports = User