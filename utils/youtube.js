const Song = require('../Models/Song');
const axios = require("axios");
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const database = require("../Database/database")
const path = require("path");
const fs = require("fs");
require('dotenv').config();



async function searchSong(songName) {
    try {
        const response = await axios.get(process.env.YOUTUBE_API_BASE_URL, {
            params: {
                key: process.env.YOUTUBE_API_KEY,
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

        donwloadPath = process.env.CACHE_DIR;

        if (!fs.existsSync(donwloadPath)) {
            fs.mkdirSync(donwloadPath, { recursive: true });
        }

        const songInfo = await ytdl.getInfo(songLink);
        const songNameOriginal = songInfo.videoDetails.title.replace(/\//g, "-");
        const artist = songInfo.videoDetails.author.name;
        const thumbnail = songInfo.videoDetails.thumbnails[0].url;
        const videoId = songInfo.videoDetails.videoId;

        const song = new Song(videoId, songLink, thumbnail, songNameOriginal, artist);

        const filePath = path.join(donwloadPath, `${videoId}.mp3`);      
        if (fs.existsSync(filePath)) {
            sendFile(songNameOriginal,filePath, res);
            return;
        }

        const stream = ytdl(songLink, {
            filter: "audioonly",
            quality: "highestaudio",
        });

        const metadata = {
            title: songNameOriginal,
            artist: artist,
        };

        ffmpeg(stream)
            .audioBitrate(128)
            .save(filePath)
            .on('end', ()=>{
                ffmetadata.write(filePath, metadata, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Errore durante la scrittura dei metadati');
                    }else{
                        sendFile(songNameOriginal,filePath, res);
                    }
                });
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).send('Errore durante la conversione in mp3');
            });
        

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Errore durante il download della canzone');
        }
    }
}

function sendFile(songName,filePath, res){
    res.header("Access-Control-Expose-Headers", "*");
    res.set({
        'Content-Type': 'audio/mpeg',
    });
    res.set("songName", `${songName}`);

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            if(res.headersSent){
            }else{
                return res.sendStatus(500);
            }
        }
    });

}

module.exports = { searchSong, downloadSong };