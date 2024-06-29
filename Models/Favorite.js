const mongoose = require('mongoose');
const songSchema = require('./Song').songSchema;

const favoriteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    songs: [songSchema]
});


const favoriteModel = mongoose.model('favorites', favoriteSchema);

module.exports = { favoriteModel };

