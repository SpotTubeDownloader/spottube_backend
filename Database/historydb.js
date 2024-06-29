const historyModel = require('../Models/History').historyModel;
const { getUserBySub } = require('./userdb');



async function addSongToHistoryByUserSub(song, userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }

        let history = await historyModel.findOne({user: user._id});

        if (!history) {
            history = new historyModel({ user: user._id, songs: [] });
            history.songs.push(song);
            await history.save();
            return;
        }

        history.songs = history.songs.filter(s => s.songId !== song.songId);
        history.songs.push(song);
        await history.save();
    } catch (error) {
        console.log(error);
    }
}

async function getHistoryByUserSub(userSub){
    try{
        const user = await getUserBySub(userSub);
        let history = await historyModel.findOne({user: user._id});
        const songs = history.songs;
        return songs.reverse();
    } catch (error) {
        console.log(error);
    }
}

async function deleteElementinHistoryBySongId(songId,userSub){
    try{
        const user = await getUserBySub(userSub);
        if (!user) {
            throw new Error('User not found');
        }

        let history = await historyModel.findOne({user: user._id});
        history.songs = history.songs.filter(s => s.songId !== songId);
        await history.save();

    } catch (error) {
        console.log(error);
    }
}

module.exports = { addSongToHistoryByUserSub, getHistoryByUserSub, deleteElementinHistoryBySongId };