const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const objectSchema = new mongoose.Schema({
    telegram_id: String,
    first_name: String,
    last_name: String,
    username: String
});

const TempWaitingListUser = mongoose.model('TempWaitingListUser', objectSchema);

module.exports = TempWaitingListUser ;
