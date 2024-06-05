const mongoose = require('mongoose');

class RatingSite{
    constructor(userSub, rating){
        this.userSub = userSub;
        this.rating = rating;
    }
}

const userRatingSiteSchema = new mongoose.Schema({
    userSub: String,
    rating: Number
});

const userRatingSiteModel = mongoose.model('ratings', userRatingSiteSchema);


module.exports = { RatingSite, userRatingSiteModel, userRatingSiteSchema};
