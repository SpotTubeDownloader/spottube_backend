const mongoose = require('mongoose');
const userRatingSiteModel = require('../Models/RatingSite').userRatingSiteModel;

async function getRatingByUserSub(userSub){
    try{
        const userRating = await userRatingSiteModel.findOne({userSub: userSub});
        if(!userRating){
            return 0;
        }
        return userRating.rating;
    } catch (error) {
        console.log(error);
    }
}

async function updateRatingByUserSub(userRating){
    try{
        await userRatingSiteModel.updateOne(
            { userSub: userRating.userSub },
            { $set: { rating: userRating.rating } },
            { upsert: true }
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getRatingByUserSub, updateRatingByUserSub };