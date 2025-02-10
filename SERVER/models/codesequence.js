const mongoose = require('mongoose');

const CodeSequenceSchema = new mongoose.Schema({
    user_type: {type: 'string', required: true},
    value: {type: 'number', required: true}
});

const CodeSequence = mongoose.model('codesequence', CodeSequenceSchema)
module.exports = CodeSequence