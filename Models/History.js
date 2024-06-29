const mongoose = require('mongoose');
const songSchema = require('./Song').songSchema;


const historySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    songs: [songSchema]
});

const historyModel = mongoose.model('histories', historySchema);

module.exports = { historyModel, historySchema };

