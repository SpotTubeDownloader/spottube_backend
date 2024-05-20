const express = require("express")
const userRouter = express.Router()
const database = require('../Database/database');
const { searchSong, downloadSong } = require('../utils/youtube');

userRouter.post('/saerchName', (req, res) => {
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

userRouter.get("history", (req,res)=>{
    const subUser = req.body.sub;
    database.getHistory(subUser).then((history)=>{
        res.send(history);
    }).catch((error)=>{
        console.log(error);
    });
})

module.exports = userRouter;