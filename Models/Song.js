const mongoose = require('mongoose');

class Song {
    constructor(id, link, thumbnailUrl, title, artist, duration) {
        this.songId = id;
        this.title = title;
        this.artist = artist;
        this.thumbnail = thumbnailUrl;
        this.link = link;
        this.duration = duration;
    }
};


const songSchema = new mongoose.Schema({
    songId: {type: String, unique: true},
    title: String,
    artist: String,
    thumbnail: String,
    link: String,
    duration: String

});

module.exports = { Song, songSchema};

