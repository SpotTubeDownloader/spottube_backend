const express = require("express")
const userRouter = express.Router()
const database = require('../Database/database');
const userSong = require('../Models/UserSong');
const RatingSite = require('../Models/RatingSite');
//const { searchSong, downloadSong, getInfo } = require('../utils/youtube');
const youtube = require('../utils/youtube');

userRouter.post('/searchName', (req, res) => {
    const songName = req.body.songName + " original song";
    youtube.searchSong(songName).then((songs) => {
        res.send(songs);
    });
});
userRouter.post("/downloadSongBySongName", (req, res) => {
    const songLink = req.body.songLink;
    const subUser = req.body.sub;

    const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]{16}$/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (songLink.match(spotifyRegex)) {
            youtube.DownloadBySpotify(songLink,subUser ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(songLink.match(youtubeRegex)){
            youtube.downloadSong(songLink,subUser ,res).then(() => {
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

userRouter.post("/downloadVideoByLink", (req, res) => {
    const videoLink = req.body.videoLink;
    const subUser = req.body.sub;

    const spotifyRegex = /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]{22}\?si=[a-zA-Z0-9]{16}$/;
    const youtubeRegex = /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+$/;
    try{
        if (videoLink.match(spotifyRegex)) {
            youtube.DownloadBySpotify(videoLink,subUser ,res).then(() => {}).catch((error) => {
                console.log(error);
            });
        }
        else if(videoLink.match(youtubeRegex)){
            youtube.downloadSong(videoLink,subUser ,res).then(() => {
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

    youtube.getInfo(videoLink).then((song)=>{
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

userRouter.get("/getRatingByUserSub/:sub", (req,res)=>{
    const userSub = req.params.sub;
    database.getRatingByUserSub(userSub).then((rating)=>{
        res.json({ rating: rating });
    }).catch((error)=>{
        console.log(error);
    });
});

userRouter.post("/updateRatingByUserSub", (req,res)=>{
    const userSub = req.body.userSub;
    const rating = req.body.rating;

    console.log("Rating: ", rating);
    console.log("UserSub: ", userSub)

    const userRating = new RatingSite(userSub, rating);
    database.updateRatingByUserSub(userRating).then(()=>{
        res.send("Rating set");
    }).catch((error)=>{
        console.log(error);
    });
});



module.exports = userRouter;
