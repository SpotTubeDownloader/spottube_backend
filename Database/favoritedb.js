const mongoose = require('mongoose');
const favoriteModel = require('../Models/Favorite').favoriteModel;

async function getFavoritesByUserSub(userSub){
    try{
        favorites = await favoriteModel.find({userSub: userSub});
        const songs = favorites.map(element => element.song).reverse();
        return songs;
    } catch (error) {
        console.log(error);
    }
}

async function addFavoriteByUserSub(favorite){
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

async function deleteFavoriteBySongId(songId,userSub){
    try{
        await favoriteModel.deleteOne({userSub: userSub, 'song.songId': songId});
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getFavoritesByUserSub, addFavoriteByUserSub, deleteFavoriteBySongId };
