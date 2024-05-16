const Song = require('../Models/Song');
const axios = require("axios");
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffmetadata = require("ffmetadata");
const database = require("../Database/database")
async function searchSong(songName) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                key: 'AIzaSyDQt7sZPhP0qOnPlpS6nFn7QLP_ismBfo0',
                q: songName,
                part: 'snippet',
                type: 'video',
                maxResults: 10
            }
        });
        const songs = response.data.items.map((item) => {
            return {
                title: item.snippet.title,
                id: item.id.videoId
            }
        });
        var songsList = [];
        for (var i = 0; i < songs.length; i++) {
            songsList.push(new Song(
                response.data.items[i].id.videoId,
                `https://www.youtube.com/watch?v=${songs[i].id}`,
                `https://i.ytimg.com/vi/${songs[i].id}/hqdefault.jpg`,
                response.data.items[i].snippet.title,
                response.data.items[i].snippet.channelTitle
            ));
        }
    } catch (error) {
        console.log(error.message);
    }
    return songsList;
}
async function downloadSong(songLink, res) {
    try {
        const songInfo = await ytdl.getInfo(songLink);
        const songNameOriginal = songInfo.videoDetails.title.replace(/\//g, "-");
        const artist = songInfo.videoDetails.author.name;
        // take thumbnail
        const thumbnail = songInfo.videoDetails.thumbnails[0].url;
        // take the id of the video
        const videoId = songInfo.videoDetails.videoId;

        const song = new Song(videoId, songLink, thumbnail, songNameOriginal, artist);

        const stream = ytdl(songLink, {
            filter: "audioonly",
            quality: "highestaudio",
        });

        res.setHeader('Content-Type', 'audio/mpeg');
        // Add metadata
        const metadata = {
            title: songNameOriginal,
            artist: artist,
        };
        // Stream MP3 with metadata directly to the response
        ffmpeg(stream)
            .audioCodec("libmp3lame")
            .format("mp3")
            .outputOptions([
                '-metadata', `title=${metadata.title}`,
                '-metadata', `artist=${metadata.artist}`
            ])
            .on("error", (err) => {
                console.error(err);
                res.status(500).send('Errore durante la generazione del file MP3');
            })
            .pipe(res); // Stream directly to response
            
            
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore durante il download della canzone');
    }
}
module.exports = { searchSong, downloadSong };