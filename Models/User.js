const mongoose = require('mongoose');

// Definizione della classe User che verrà usato come schema per il database
class User {
    constructor(email, name, nickname, picture, userSub){
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.picture = picture;
        this.userSub = userSub;
    }
}

// Definizione dello schema per il database con i campi email, name, nickname, picture e userSub che verranno usati per operare sul database
const userSchema = new mongoose.Schema({
    email: String,
    name: String,
    nickname: String,
    picture: String,
    userSub: {type: String, unique: true} // univoco
});

const userModel = mongoose.model('users', userSchema); // crea il modello per il database


module.exports = { User, userModel, userSchema};