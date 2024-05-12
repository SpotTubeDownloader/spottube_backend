const express = require("express")
const router = express.Router()
// Define the endpoint
router.get('/', (req, res) => {
    res.send('Hello World!');
});



// Export the router
module.exports = router;