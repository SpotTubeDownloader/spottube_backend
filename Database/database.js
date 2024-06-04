const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    nickname: String,
    picture: String,
    sub: String
});

const songSchema = new mongoose.Schema({
    songId: String,
    title: String,
    artist: String,
    thumbnail: String,
    link: String

});

const userSongSchema = new mongoose.Schema({
    userSub: String,
    song: songSchema
});

const userRatingSiteSchema = new mongoose.Schema({
    userSub: String,
    rating: Number
});

const historyModel = mongoose.model('history', userSongSchema);
const userModel = mongoose.model('users', userSchema);
const favoriteModel = mongoose.model('favorites', userSongSchema);
const userRatingSiteModel = mongoose.model('ratings', userRatingSiteSchema);

function connectToDatabase(callback){
    mongoose.connect(connectionString).then(()=>{
        console.log('Database connected');
        callback();
    }).catch((err) => {
        console.log(err);
    });
}

async function getUserBySub(userSub){
    try{
        const user = await userModel.findOne({sub: userSub});
        return user;
    } catch (error) {
        console.log(error);
    }
}

//create add user function using the userModel and user object
async function addUser(user){
    try{
        const newUser = new userModel(user);
        await newUser.save();
    } catch (error) {
        console.log(error);
    }
}

async function addSongToHistoryUser(history){
    try{
        const newHistoryModel = new historyModel(history);
        await deleteElementinHistoryBySongId(history.song.songId, history.userSub);
        await newHistoryModel.save();
    } catch (error) {
        console.log(error);
    }
}

async function getHistory(subUser){
    try{
        history = await historyModel.find({userSub: subUser});
        const songs = history.map(element => element.song).reverse();
        return songs;
    } catch (error) {
        console.log(error);
    }
}

async function deleteElementinHistoryBySongId(songId,subUser){
    try{
        await historyModel.deleteOne({userSub: subUser, 'song.songId': songId});
    } catch (error) {
        console.log(error);
    }
}

async function getFavorites(subUser){
    try{
        favorites = await favoriteModel.find({userSub: subUser});
        const songs = favorites.map(element => element.song).reverse();
        return songs;
    } catch (error) {
        console.log(error);
    }
}


async function addFavorite(favorite){
    try{
        const newFavorite = new favoriteModel(favorite);
        favorite = await favoriteModel.findOne({userSub: favorite.userSub, 'song.songId': favorite.song.songId});
        if (!favorite){
            await newFavorite.save();
            return true;
        }
        return false;
    } catch (error){
        console.log(error);
        return false;
    }
}


async function deleteFavoriteBySongId(songId,subUser){
    try{
        await favoriteModel.deleteOne({userSub: subUser, 'song.songId': songId});
    } catch (error) {
        console.log(error);
    }
}

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


module.exports = {
    connectToDatabase, 
    addUser, 
    getUserBySub, 
    addSongToHistoryUser, 
    getHistory, 
    deleteElementinHistoryBySongId, 
    addFavorite, 
    deleteFavoriteBySongId, 
    getFavorites,
    getRatingByUserSub,
    updateRatingByUserSub
};



