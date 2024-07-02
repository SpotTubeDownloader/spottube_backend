const historyModel = require('../Models/History').historyModel;
const { getUserBySub } = require('./userdb');



// aggiunge una canzone alla cronologia di un utente
async function addSongToHistoryByUserSub(song, userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        let history = await historyModel.findOne({user: user._id}); // cerca la cronologia dell'utente

        if (!history) {
            history = new historyModel({ user: user._id, songs: [] }); // se l'utente non ha una cronologia, crea una nuova lista
            history.songs.push(song); // se l'utente non ha una cronologia, aggiunge la canzone
            await history.save();
            return;
        }

        history.songs = history.songs.filter(s => s.songId !== song.songId); // eliminiamo la canzone con lo stesso songID
        history.songs.push(song); // aggiungiamo la canzone, che comparirà ora in cima all'elenco
        await history.save();
    } catch (error) {
        console.log(error);
    }
}

// ottiene la cronologia di un utente
async function getHistoryByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        let history = await historyModel.findOne({user: user._id}); // cerca la cronologia dell'utente
        
        if (!history) {
            return []; // se l'utente non ha una cronologia, restituisce un array vuoto
        }

        const songs = history.songs; // restituisce le canzoni
        return songs.reverse(); // restituisce le canzoni in ordine inverso, in modo che le ultime aggiunte siano visualizzate per prime
    } catch (error) {
        console.log(error);
    }
}

async function deleteElementinHistoryBySongId(songId,userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found'); // se l'utente non esiste, restituisce un errore
        }

        let history = await historyModel.findOne({user: user._id}); // cerca la cronologia dell'utente
        history.songs = history.songs.filter(s => s.songId !== songId); // elimina la canzone con lo stesso songID
        await history.save();

    } catch (error) {
        console.log(error);
    }
}

module.exports = { addSongToHistoryByUserSub, getHistoryByUserSub, deleteElementinHistoryBySongId };