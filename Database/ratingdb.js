const mongoose = require('mongoose');
const userRatingSiteModel = require('../Models/RatingSite').userRatingSiteModel;
const { getUserBySub } = require('./userdb');


// ottiene il rating di un utente
async function getRatingByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        const userRating = await userRatingSiteModel.findOne({user: user._id});
        if(!userRating){
            return 0; // se l'utente non ha un rating, restituisce 0
        }
        return userRating.rating;
    } catch (error) {
        console.log(error);
    }
}

// aggiorna il rating di un utente
async function updateRatingByUserSub(userSub,rating){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        await userRatingSiteModel.updateOne(
            { user: user._id},
            { $set: { rating: rating } },
            { upsert: true }
        ); // aggiorna il rating dell'utente o lo crea se non esiste
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getRatingByUserSub, updateRatingByUserSub };