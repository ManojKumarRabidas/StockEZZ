const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    code: {type: 'string', required: true},
    user_type: {type: 'string', required: true},
    name: {type: 'string', required: true},
    phone: {type: 'number', required: true},
    email: {type: 'string', required: true},
    address: {type: 'string', required: true},
    pin: {type: 'number', required: true},
    createdBy: {type: 'ObjectId'},
    updatedBy: {type: 'ObjectId'}
}, { timestamps: true });

userSchema.index({ code: 1 }, { unique: true });
const User = mongoose.model('user', userSchema)
module.exports = User