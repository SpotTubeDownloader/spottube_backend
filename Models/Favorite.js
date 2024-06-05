const mongoose = require('mongoose');

const userSongSchema = require('./UserSong').userSongSchema;

const favoriteModel = mongoose.model('favorites', userSongSchema);

module.exports = { favoriteModel };

