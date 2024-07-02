const express = require("express")
const router = express.Router()
const ratingdb = require('../Database/ratingdb');

// ottiene il rating di un utente tramite userSub
router.get("/getRatingByUserSub/:sub", (req,res)=>{
    const userSub = req.params.sub;
    ratingdb.getRatingByUserSub(userSub).then((rating)=>{
        res.json({ rating: rating });
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
});

// aggiorna il rating di un utente tramite userSub
router.post("/updateRatingByUserSub", (req,res)=>{
    const userSub = req.body.userSub;
    const rating = req.body.rating;
    ratingdb.updateRatingByUserSub(userSub, rating).then(()=>{ 
        res.status(200).send("OK");
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
});


module.exports = router;
