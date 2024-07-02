const express = require("express")
const loginRouter = express.Router()
const database = require('../Database/userdb');

// Richiesta di login da parte del client
loginRouter.post('/login', (req, res) => {
    console.log(req.body);
    database.getUserBySub(req.body.userSub).then((exists)=>{
        // aggiunge un user al db se non è presente il suo userSub
        if (!exists){
            database.addUser(req.body)
        }
        res.status(200).send("OK");
    }).catch((error)=>{
        console.log(error);
        res.status(500).send("Internal Server Error");
    });
});

module.exports = loginRouter;