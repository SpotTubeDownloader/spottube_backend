const userModel = require('../Models/User').userModel;

async function getUserBySub(userSub){
    try{
        const user = await userModel.findOne({sub: userSub});
        return user;
    } catch (error) {
        console.log(error);
    }
}

//create add user function using the userModel and user object
async function addUser(user){
    try{
        const newUser = new userModel(user);
        await newUser.save();
    } catch (error) {
        console.log(error);
    }
}


module.exports = { getUserBySub, addUser };