const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const User = mongoose.model('User', new mongoose.Schema({
    telegram_id: String,
    username: String,
    preferred_time: String,
    roleOrderNumber: Number,
    actsName: Number,
    schoolName: String,
    pastoralTeamName: String,
}););

module.exports = User ;
