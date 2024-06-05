const mongoose = require('mongoose');

const userSongSchema = require('./UserSong').userSongSchema;

const historyModel = mongoose.model('history', userSongSchema);

module.exports = { historyModel };

