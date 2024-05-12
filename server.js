const express = require('express');
const routes = require('./endpoint');


const app = express();
const port = 3000;
const host = "0.0.0.0"
// Endpoint for the swagger documentation

app.listen(port, host,() => {
    console.log(`Example app listening at http://${host}:${port}`);
    }
); 
app.use(express.json());


app.use('/', routes);

