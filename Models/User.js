const mongoose = require('mongoose');

class User {
    constructor(email, name, nickname, picture, userSub){
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.picture = picture;
        this.userSub = userSub;
    }
}

const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    nickname: String,
    picture: String,
    userSub: String
});

const userModel = mongoose.model('users', userSchema);


module.exports = { User, userModel, userSchema};