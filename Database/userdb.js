const userModel = require('../Models/User').userModel;

// Chiamata a mongoose per cercare l'utente con userSub
async function getUserBySub(userSub){
    try{
        const user = await userModel.findOne({userSub: userSub}); // cerca l'utente con userSub
        return user;
    } catch (error) {
        console.log(error);
    }
}

// Crea un nuovo user model con i dati e lo salva nel database
async function addUser(user){
    try{
        const newUser = new userModel(user); // crea un nuovo user
        await newUser.save();
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getUserBySub, addUser };