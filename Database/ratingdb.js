const mongoose = require('mongoose');
const userRatingSiteModel = require('../Models/RatingSite').userRatingSiteModel;
const { getUserBySub } = require('./userdb');


async function getRatingByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }

        const userRating = await userRatingSiteModel.findOne({user: user._id});
        if(!userRating){
            return 0;
        }
        return userRating.rating;
    } catch (error) {
        console.log(error);
    }
}

async function updateRatingByUserSub(userSub,rating){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }

        await userRatingSiteModel.updateOne(
            { user: user._id},
            { $set: { rating: rating } },
            { upsert: true }
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getRatingByUserSub, updateRatingByUserSub };