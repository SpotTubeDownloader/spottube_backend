class Song {
    constructor(id, link, thumbnailUrl, title, artist) {
        this.songId = id;
        this.title = title;
        this.artist = artist;
        this.thumbnail = thumbnailUrl;
        this.link = link;
    }
}
module.exports = Song;

