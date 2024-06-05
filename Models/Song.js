const mongoose = require('mongoose');

class Song {
    constructor(id, link, thumbnailUrl, title, artist) {
        this.songId = id;
        this.title = title;
        this.artist = artist;
        this.thumbnail = thumbnailUrl;
        this.link = link;
    }
};


const songSchema = new mongoose.Schema({
    songId: String,
    title: String,
    artist: String,
    thumbnail: String,
    link: String

});

module.exports = { Song, songSchema};

