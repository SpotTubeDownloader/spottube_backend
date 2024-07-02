const mongoose = require('mongoose');
const favoriteModel = require('../Models/Favorite').favoriteModel;
const { getUserBySub } = require('./userdb');


// ottiene le canzoni preferite di un utente
async function getFavoritesByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        let favorites = await favoriteModel.findOne({user: user._id}); // cerca le canzoni preferite dell'utente
        
        if (!favorites) {
            return []; // se l'utente non ha canzoni preferite, restituisce un array vuoto
        }

        const songs = favorites.songs;
        return songs.reverse(); // restituisce le canzoni in ordine inverso, in modo che le ultime aggiunte siano visualizzate per prime
    } catch (error) {
        console.log(error);
    }
}

// aggiunge una canzone ai preferiti di un utente
async function addFavoriteByUserSub(song, userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        let favorites = await favoriteModel.findOne({user: user._id});

        if (!favorites) {
            favorites = new favoriteModel({ user: user._id, songs: [] }); // se l'utente non ha canzoni preferite, crea una nuova lista
            favorites.songs.push(song); // se l'utente non ha canzoni preferite, aggiunge la canzone
            await favorites.save();
            return;
        }

        favorites.songs = favorites.songs.filter(s => s.songId !== song.songId); // eliminiamo la canzone con lo stesso songID
        favorites.songs.push(song); // aggiungiamo la canzone, che comparirà ora in cima all'elenco
        await favorites.save();
    } catch (error){
        console.log(error);
        return false;
    }
}

// elimina una canzone dai preferiti di un utente
async function deleteFavoriteBySongId(songId,userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }
        let favorite = await favoriteModel.findOne({user: user._id});
        favorite.songs = favorite.songs.filter(s => s.songId !== songId); // eliminiamo la canzone con lo stesso songID
        await favorite.save();    
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getFavoritesByUserSub, addFavoriteByUserSub, deleteFavoriteBySongId };
