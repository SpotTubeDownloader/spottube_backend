const express = require("express")
const userRouter = express.Router()
const database = require('../Database/database');
const userSong = require('../Models/UserSong');
const { searchSong, downloadSong, getInfo } = require('../utils/youtube');

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
    database.getHistory(subUser).then((history)=>{
        res.send(history);
    }).catch((error)=>{
        console.log(error);
    });
})


userRouter.post("/history/deleteElementinHistoryBySongId", (req,res)=>{
    const songId = req.body.songId;
    const subUser = req.body.subUser;
    console.log("[Database Delete]: ",songId);
    console.log("[Database Delete]: ",subUser);

    database.deleteElementinHistoryBySongId(songId,subUser).then((data)=>{
        database.getHistory(subUser).then((history)=>{
            res.send(history);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});

userRouter.get("/favorites/:sub", (req,res)=>{
    const subUser = req.params.sub;
    database.getFavorites(subUser).then((favorites)=>{
        res.send(favorites);
    }).catch((error)=>{
        console.log(error);
    });
})

userRouter.post("/favorites/addFavorite", (req,res)=>{
    const videoLink = req.body.videoLink;
    const subUser = req.body.sub;

    getInfo(videoLink).then((song)=>{
        const favorite = new userSong(song, subUser)
        database.addFavorite(favorite).then(()=>{
            database.getFavorites(subUser).then((favorites)=>{
                res.send(favorites);
            }).catch((error)=>{
                console.log(error);
            });
        }).catch((error)=>{
            console.log(error);
        });
    }
    )
});

userRouter.post("/favorites/deleteFavorite", (req,res)=>{
    const songId = req.body.songId;
    const subUser = req.body.subUser;

    database.deleteFavoriteBySongId(songId,subUser).then(()=>{
        console.log("Favorite deleted");
        database.getFavorites(subUser).then((favorites)=>{
            console.log("Favorites: ",favorites);
            res.send(favorites);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});

module.exports = userRouter;