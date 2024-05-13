const mongoose = require('mongoose');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    surname:String
});
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
        console.log(users);
    }).catch((err)=>{
        console.log(err);
    });
}

function addUser(){
    const user = new userModel({
        email:"u.carolino@studenti.amoruta.com",
        name:"Umberto",
        surname:"Carolino"
    });

    user.save().then(()=>{
        console.log('User added');
    }).catch((err)=>{
        console.log(err);
    });

}




module.exports = {connectToDatabase, getUser, addUser};



