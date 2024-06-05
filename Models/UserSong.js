const mongoose = require('mongoose');

const songSchema = require('./Song').songSchema;

class userSong{
    constructor(song, userSub){
        this.userSub = userSub;
        this.song = song;
    }
}

const userSongSchema = new mongoose.Schema({
    userSub: String,
    song: songSchema
});


module.exports = { userSong, userSongSchema};