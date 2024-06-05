const mongoose = require('mongoose');

require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

function connectToDatabase(callback){
    mongoose.connect(connectionString).then(()=>{
        console.log('Database connected');
        callback();
    }).catch((err) => {
        console.log(err);
    });
}




module.exports = {
    connectToDatabase
};



