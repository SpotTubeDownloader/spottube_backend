const express = require("express")
const router = express.Router()
const ratingdb = require('../Database/ratingdb');


router.get("/getRatingByUserSub/:sub", (req,res)=>{
    const userSub = req.params.sub;
    ratingdb.getRatingByUserSub(userSub).then((rating)=>{
        res.json({ rating: rating });
    }).catch((error)=>{
        console.log(error);
    });
});


router.post("/updateRatingByUserSub", (req,res)=>{
    const userSub = req.body.userSub;
    const rating = req.body.rating;
    ratingdb.updateRatingByUserSub(userSub, rating).then(()=>{
        res.send("Rating set");
    }).catch((error)=>{
        console.log(error);
    });
});


module.exports = router;
