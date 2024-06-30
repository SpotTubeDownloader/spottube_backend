const mongoose = require('mongoose');
const favoriteModel = require('../Models/Favorite').favoriteModel;
const { getUserBySub } = require('./userdb');


async function getFavoritesByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        let favorites = await favoriteModel.findOne({user: user._id});
        const songs = favorites.songs;
        return songs.reverse();
    } catch (error) {
        console.log(error);
    }
}

async function addFavoriteByUserSub(song, userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }

        let favorites = await favoriteModel.findOne({user: user._id});

        if (!favorites) {
            favorites = new favoriteModel({ user: user._id, songs: [] });
            favorites.songs.push(song);
            await favorites.save();
            return;
        }

        favorites.songs = favorites.songs.filter(s => s.songId !== song.songId);
        favorites.songs.push(song);
        await favorites.save();
    } catch (error){
        console.log(error);
        return false;
    }
}

async function deleteFavoriteBySongId(songId,userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }
        let favorite = await favoriteModel.findOne({user: user._id});
        favorite.songs = favorite.songs.filter(s => s.songId !== songId);
        await favorite.save();    
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getFavoritesByUserSub, addFavoriteByUserSub, deleteFavoriteBySongId };
