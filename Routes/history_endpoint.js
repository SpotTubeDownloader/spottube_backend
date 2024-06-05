const express = require("express")
const router = express.Router()

const historydb = require('../Database/historydb');

router.get("/getHistoryByUserSub/:userSub", (req,res)=>{
    const userSub = req.params.userSub;
    historydb.getHistoryByUserSub(userSub).then((history)=>{
        res.send(history);
    }).catch((error)=>{
        console.log(error);
    });
})


router.post("/deleteElementinHistoryBySongId", (req,res)=>{
    const songId = req.body.songId;
    const userSub = req.body.userSub;

    historydb.deleteElementinHistoryBySongId(songId,userSub).then((data)=>{
        historydb.getHistoryByUserSub(userSub).then((history)=>{
            res.send(history);
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });
});


module.exports = router;