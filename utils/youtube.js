const Song = require('../Models/Song');
const userSong = require('../Models/UserSong');
const axios = require("axios");
const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const ffmetadata = require("ffmetadata");
const database = require("../Database/database")
const path = require("path");
const fs = require("fs");
const spotify = require('../utils/spotify');
require('dotenv').config();


async function getInfo(url){
    const songInfo = await ytdl.getInfo(url);
    const songNameOriginal = songInfo.videoDetails.title.replace(/\//g, "-");
    const artist = songInfo.videoDetails.author.name;
    const thumbnail = songInfo.videoDetails.thumbnails[0].url;
    const videoId = songInfo.videoDetails.videoId;

    return new Song(videoId, url, thumbnail, songNameOriginal, artist);
}


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
async function downloadSong(songLink,subUser ,res) {
    try {

        donwloadPath = process.env.CACHE_DIR;

        if (!fs.existsSync(donwloadPath)) {
            fs.mkdirSync(donwloadPath, { recursive: true });
        }

        const song = await getInfo(songLink);
        const history = new userSong(song, subUser);
        database.addSongToHistoryUser(history);

        const filePath = path.join(donwloadPath, `${song.songId}.mp3`);      
        if (fs.existsSync(filePath)) {
            sendFile(song.title,filePath, res);
            return;
        }

        const stream = ytdl(songLink, {
            filter: "audioonly",
            quality: "highestaudio",
        });

        const metadata = {
            title: song.title,
            artist: song.artist,
        };

        ffmpeg(stream)
            .audioBitrate(128)
            .save(filePath)
            .outputOptions([
                '-metadata', `title=${metadata.title}`,
                '-metadata', `artist=${metadata.artist}`
            ])
            .on('end', ()=>{
                sendFile(song.title,filePath, res);
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
    res.set("songName", `${encodeURIComponent(songName)}`);

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



async function donwloadVideo(videoLink,subUser ,res) {
    try {

        donwloadPath = process.env.CACHE_DIR;

        if (!fs.existsSync(donwloadPath)) {
            fs.mkdirSync(donwloadPath, { recursive: true });
        }

        const videoInfo = await ytdl.getInfo(songLink);
        const videoNameOriginal = songInfo.videoDetails.title.replace(/\//g, "-");
        const artist = songInfo.videoDetails.author.name;
        const thumbnail = songInfo.videoDetails.thumbnails[0].url;
        const videoId = songInfo.videoDetails.videoId;

        const song = new Song(videoId, songLink, thumbnail, songNameOriginal, artist);
        const history = new userSong(song, subUser);
        database.addSongToHistoryUser(history);

        const filePath = path.join(donwloadPath, `${videoId}.mp4`);      
        if (fs.existsSync(filePath)) {
            sendFile(videoNameOriginal,filePath, res);
            return;
        }

        const stream = ytdl(songLink, {
            quality: 'highestvideo',
        });

        const metadata = {
            title: videoNameOriginal,
            artist: artist,
        };

        ffmpeg(stream)
            .videoBitrate(1024)
            .save(filePath)
            .outputOptions([
                '-metadata', `title=${metadata.title}`,
                '-metadata', `artist=${metadata.artist}`
            ])
            .on('end', ()=>{
                sendFile(videoNameOriginal,filePath, res);
            })
            .on('error', (error) => {
                console.error(error);
                res.status(500).send('Errore durante la conversione in mp4');
            });
        

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).send('Errore durante il download del video');
        }
    }
}

async function DownloadBySpotify(link, subUser ,res){
    try{
        console.log("[DownloadBySpotify] res: ", res)
        songName = await spotify.getSongName(link);
        artistName = await spotify.getSongArtist(link);
        console.log("[INFO] Song Name: ", songName);
        song = (await searchSong(songName + " " + artistName + " Official video"))[0];
        console.log("[INFO] Song: ", song);
        await downloadSong(song.link,subUser, res);
    } catch (error) {
        throw error;
    }
}

module.exports = { searchSong, downloadSong, donwloadVideo, getInfo, DownloadBySpotify };