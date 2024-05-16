const express = require("express")
const loginRouter = express.Router()
const database = require('../Database/database');

loginRouter.post('/login', (req, res) => {
    console.log(req.body);
    database.getUserBySub(req.body.sub).then((exists)=>{
        // console.log(exists)
        if (!exists){
            database.addUser(req.body)
        }
    });
});

module.exports = loginRouter;