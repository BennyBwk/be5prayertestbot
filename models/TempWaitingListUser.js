const {mongoose} = require('../database/db.js');

const TempWaitingListUser = mongoose.model('TempWaitingListUser', new mongoose.Schema({
    telegram_id: String,
    first_name: String,
    last_name: String,
    username: String
}));

module.exports = TempWaitingListUser ;
