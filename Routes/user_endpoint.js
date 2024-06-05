const express = require("express")
const userRouter = express.Router()
//const { searchSong, downloadSong, getInfo } = require('../utils/youtube');
const youtube = require('../utils/youtube');

userRouter.post('/searchByName', (req, res) => {
    const songName = req.body.songName + " original song";
    youtube.searchSong(songName).then((songs) => {
        res.send(songs);
    });
});
userRouter.post("/downloadSongByLink", (req, res) => {
    const songLink = req.body.songLink;
    const userSub = req.body.userSub;

    const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]{16}$/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (songLink.match(spotifyRegex)) {
            youtube.DownloadBySpotify(songLink,userSub ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(songLink.match(youtubeRegex)){
            youtube.downloadSong(songLink,userSub ,res).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }else{
            throw new Error('Invalid link');
        }
    } catch (error) {
        console.log(error.message);
        res.send("Invalid link");
    }
});

module.exports = userRouter;
