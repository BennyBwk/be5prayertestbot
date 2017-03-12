const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const Scores = mongoose.model('Scores', new mongoose.Schema({
    telegram_id: String,
    verse_id: String,
    score: Number,
    fullmarks: Number
}));

module.exports = Scores ;
