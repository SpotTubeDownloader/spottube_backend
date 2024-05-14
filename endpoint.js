const express = require("express")
const router = express.Router()
const database = require('./database');
// Define the endpoint
router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/test',(req, res)=>{
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
})

router.get('/protected', (req, res) => {
    res.send('Protected route');
});


router.post('/login', (req, res) => {
    console.log(req.body);
    database.getUserBySub(req.body.sub).then((exists)=>{
        // console.log(exists)
        if (!exists){
            database.addUser(req.body)
        }
    });
});

// Export the router
module.exports = router;