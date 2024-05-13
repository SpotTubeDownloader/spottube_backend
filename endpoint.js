const express = require("express")
const router = express.Router()

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


// Export the router
module.exports = router;