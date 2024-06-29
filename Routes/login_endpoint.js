const express = require("express")
const loginRouter = express.Router()
const database = require('../Database/userdb');

loginRouter.post('/login', (req, res) => {
    console.log(req.body);
    database.getUserBySub(req.body.userSub).then((exists)=>{
        // console.log(exists)userSub
        if (!exists){
            database.addUser(req.body)
        }
    });
});

module.exports = loginRouter;