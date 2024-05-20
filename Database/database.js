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

const historySchema = new mongoose.Schema({
    userSub: String,
    song: songSchema
});
const historyModel = mongoose.model('history', historySchema);
const userModel = mongoose.model('users', userSchema);

function connectToDatabase(callback){
    mongoose.connect(connectionString).then(()=>{
        console.log('Database connected');
        callback();
    }).catch((err) => {
        console.log(err);
    });
}

function getUser(){
    userModel.find().then((users)=>{
        // console.log(users);
        return users
    }).catch((err)=>{
        console.log(err);
    });
}
function getUserBySub(userSub){
    return userModel.findOne({sub: userSub}).then((user)=>{
        // console.log(user);
        return user ? true : false;
    }).catch((err)=>{
        console.log(err);
    });
}

//create add user function using the userModel and user object
function addUser(user){
    const newUser = new userModel(user);
    newUser.save().then(()=>{
        console.log('User added');
    }).catch((err)=>{
        console.log(err);
    });
}

function addSongToHistoryUser(history){
    console.log(history);
    const newHistoryModel = new historyModel(history);
    newHistoryModel.save().then(()=>{
        console.log('Song added to history');
    }).catch((err)=>{
        console.log(err);
    });
}

function getHistory(subUser){
    return historyModel.find({userSub: subUser}).then((history)=>{
        return history;
    }).catch((err)=>{
        console.log(err);
    });
}





module.exports = {connectToDatabase, getUser, addUser, getUserBySub, addSongToHistoryUser, getHistory};



