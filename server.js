const express = require('express');
const routes = require('./endpoint');
const {connectToDatabase, getUser, addUser} = require('./database');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');

require('dotenv').config();

const start = () => {
    const jwtCheck = auth({
        audience: 'spottube-certificate',
        issuerBaseURL: 'https://dev-tq8wvm3avqr1gqu6.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    });

    const app = express();
    app.use(cors());
    app.use(jwtCheck);
    app.use(express.json());
    app.use('/', routes);

    const port = process.env.PORT;
    const host = process.env.HOST;
    app.listen(port, host, () => {
        console.log(`App listening at http://${host}:${port}`);
    });
}

connectToDatabase(start);
//addUser();
//getUser();






