// models/authentication.js
const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  login_id: {type: String, required: true, unique: true,},
  password: {type: String, required: true},
  user_type: {type: String, default: null},
  active: {type: Number, default: 0},
  last_log_in: {type: String, default: null},
  first_log_in: {type: Boolean,},

});
authenticationSchema.index({ login_id: 1 }, { unique: true });
const Authentication = mongoose.model('Authentication', authenticationSchema);
module.exports = Authentication;
