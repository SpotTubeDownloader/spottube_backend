const express = require("express")
const router = express.Router()
const youtube = require('../utils/youtube');

const historydb = require('../Database/historydb');

// ottiene la cronologia di un utente tramite userSub
router.get("/getHistoryByUserSub/:userSub", (req,res)=>{
    const userSub = req.params.userSub;
    historydb.getHistoryByUserSub(userSub).then((history)=>{ 
        res.send(history);
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
})

// aggiunge una canzone alla cronologia di un utente tramite userSub
router.post("/addHistoryByUserSub", (req,res)=>{
    const link = req.body.link;
    const userSub = req.body.userSub;

    youtube.getInfo(link).then((song)=>{ // ottiene le informazioni sulla canzone
        historydb.addSongToHistoryByUserSub(song,userSub).then(()=>{ // aggiunge la canzone alla cronologia
            res.status(200).send("OK");
        }).catch((error)=>{
            console.log(error);
            res.status(500).send("Internal Server Error");
        });
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
});

// elimina una canzone dalla cronologia di un utente tramite songId e userSub
router.post("/deleteElementinHistoryBySongId", (req,res)=>{
    const songId = req.body.songId;
    const userSub = req.body.userSub;

    historydb.deleteElementinHistoryBySongId(songId,userSub).then((data)=>{ // elimina la canzone dalla cronologia
        historydb.getHistoryByUserSub(userSub).then((history)=>{ // ottiene la cronologia aggiornata
            res.send(history);
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