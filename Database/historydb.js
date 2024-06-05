const historyModel = require('../Models/History').historyModel;



async function addSongToHistoryByUserSub(history){
    try{
        const newHistoryModel = new historyModel(history);
        await deleteElementinHistoryBySongId(history.song.songId, history.userSub);
        await newHistoryModel.save();
    } catch (error) {
        console.log(error);
    }
}

async function getHistoryByUserSub(userSub){
    try{
        history = await historyModel.find({userSub: userSub});
        const songs = history.map(element => element.song).reverse();
        return songs;
    } catch (error) {
        console.log(error);
    }
}

async function deleteElementinHistoryBySongId(songId,userSub){
    try{
        await historyModel.deleteOne({userSub: userSub, 'song.songId': songId});
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addSongToHistoryByUserSub, getHistoryByUserSub, deleteElementinHistoryBySongId };