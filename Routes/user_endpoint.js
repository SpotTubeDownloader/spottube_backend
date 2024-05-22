const express = require("express")
const userRouter = express.Router()
const database = require('../Database/database');
const { searchSong, downloadSong } = require('../utils/youtube');

userRouter.post('/searchName', (req, res) => {
    const songName = req.body.songName + " original song";
    searchSong(songName).then((songs) => {
        res.send(songs);
    });
});
userRouter.post("/downloadSongBySongName", (req, res) => {
    const songLink = req.body.songLink;
    const subUser = req.body.sub;
    downloadSong(songLink,subUser ,res).then(() => {
        console.log("Song downloaded");
    }).catch((error) => {
        console.log(error);
    });
});

userRouter.post("/downloadVideoByLink", (req, res) => {
    const videoLink = req.body.videoLink;
    const subUser = req.body.sub;
    downloadSong(videoLink,subUser ,res).then(() => {
    }).catch((error) => {
        console.log(error);
    });
});

userRouter.get("/history/:sub", (req,res)=>{
    const subUser = req.params.sub;
    console.log(subUser);
    database.getHistory(subUser).then((history)=>{
        res.send(history);
    }).catch((error)=>{
        console.log(error);
    });
})


module.exports = userRouter;