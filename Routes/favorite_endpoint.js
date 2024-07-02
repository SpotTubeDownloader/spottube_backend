const express = require('express');
const router = express.Router();
const favoritedb = require('../Database/favoritedb');   
const youtube = require('../utils/youtube');


// ottiene i preferiti di un utente tramite userSub
router.get("/getFavoritesByUserSub/:userSub", (req,res)=>{
    const userSub = req.params.userSub;
    favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{
        res.send(favorites);
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
})


// aggiunge una canzone preferita di un utente tramite userSub
router.post("/addFavoriteByUserSub", (req,res)=>{
    const videoLink = req.body.videoLink;
    const userSub = req.body.userSub;

    youtube.getInfo(videoLink).then((song)=>{ // ottiene le informazioni sulla canzone
        favoritedb.addFavoriteByUserSub(song,userSub).then(()=>{ // aggiunge la canzone ai preferiti
            favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{ // ottiene i preferiti aggiornati
                res.send(favorites);
            }).catch((error)=>{
                console.log(error);
                res.status(500).send("Internal Server Error");
            });
        }).catch((error)=>{
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
    }
    )
});

// elimina una canzone preferita di un utente tramite songId e userSub
router.post("/deleteFavoriteBySongId", (req,res)=>{
    const songId = req.body.songId;
    const userSub = req.body.userSub;

    favoritedb.deleteFavoriteBySongId(songId,userSub).then(()=>{ // elimina la canzone preferita
        favoritedb.getFavoritesByUserSub(userSub).then((favorites)=>{ // ottiene i preferiti aggiornati
            res.send(favorites);
        }).catch((error)=>{
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
});


module.exports = router;

