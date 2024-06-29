const mongoose = require('mongoose');

const userRatingSiteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    rating: Number
});

const userRatingSiteModel = mongoose.model('ratings', userRatingSiteSchema);

module.exports = {userRatingSiteModel, userRatingSiteSchema};
