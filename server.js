const express = require('express');
const {connectToDatabase, getUser, addUser} = require('./Database/database');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const loginRouter = require('./Routes/login_endpoint');
const userRouter = require('./Routes/user_endpoint');
const historyRouter = require('./Routes/history_endpoint')
const favoriteRouter = require('./Routes/favorite_endpoint')
const ratingRouter = require('./Routes/rating_endpoint')
const songRouter = require('./Routes/song_endpoint')


const clearCache = require('./utils/cache');

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
    app.use('/user/history',historyRouter)
    app.use('/user/favorite',favoriteRouter)
    app.use('/user/rating',ratingRouter)
    app.use('/user/song', songRouter);
    app.use('/', loginRouter);

    const port = process.env.PORT;
    const host = process.env.HOST;
    app.listen(port, host, () => {
        console.log(`App listening at http://${host}:${port}`);
    });
}

setInterval(clearCache, 1000*60*60);
connectToDatabase(start);