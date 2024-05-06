const express = require('express');

// Import Swagger documentation
const swaggerUI = require('swagger-ui-express');
// Define the swagger spec in a separate file (swagger.js)
const swaggerSpec = require('./swagger');

const app = express();
const port = 3000;
const host = "0.0.0.0"

// Endpoint for the swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(port, host,() => {
    console.log(`Example app listening at http://${host}:${port}`);
    }
); 

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);


