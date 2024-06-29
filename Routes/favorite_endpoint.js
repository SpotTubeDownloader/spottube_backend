const express = require('express');
const router = express.Router();
const favoritedb = require('../Database/favoritedb');   
const youtube = require('../utils/youtube');



router.get("/getFavoritesByUserSub/:userSub", (req,res)=>{
    const userSub = req.params.userSub;
    favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{
        res.send(favorites);
    }).catch((error)=>{
        console.log(error);
    });
})


router.post("/addFavoriteByUserSub", (req,res)=>{
    const videoLink = req.body.videoLink;
    const userSub = req.body.userSub;

    youtube.getInfo(videoLink).then((song)=>{
        favoritedb.addFavoriteByUserSub(song,userSub).then(()=>{
            favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{
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


router.post("/deleteFavoriteBySongId", (req,res)=>{
    const songId = req.body.songId;
    const userSub = req.body.userSub;

    favoritedb.deleteFavoriteBySongId(songId,userSub).then(()=>{
        console.log("Favorite deleted");
        favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{
            console.log("Favorites: ",favorites);
            res.send(favorites);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});


module.exports = router;

