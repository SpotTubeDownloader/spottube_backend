const express = require('express');
const {connectToDatabase, getUser, addUser} = require('./Database/database');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const loginRouter = require('./Routes/login_endpoint');
const userRouter = require('./Routes/user_endpoint');

require('dotenv').config();

const corsOptions = {
    exposedHeaders: 'Authorization',
  };

const start = () => {
    const jwtCheck = auth({
        audience: 'spottube-certificate',
        issuerBaseURL: 'https://dev-tq8wvm3avqr1gqu6.us.auth0.com/',
        tokenSigningAlg: 'RS256'
    });

    const app = express();
    app.use(cors(corsOptions));
    app.use(jwtCheck);
    app.use(express.json());
    app.use('/user', userRouter);
    app.use('/', loginRouter);

    const port = process.env.PORT;
    const host = process.env.HOST;
    app.listen(port, host, () => {
        console.log(`App listening at http://${host}:${port}`);
    });
}

connectToDatabase(start);
//addUser();
//getUser();






