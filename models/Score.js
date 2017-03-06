const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const Score = mongoose.model('Score', new mongoose.Schema({
    telegram_id: String,

}););

module.exports = Score ;
