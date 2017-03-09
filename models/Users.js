const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const Users = mongoose.model('Users', new mongoose.Schema({
    telegram_id: String,
    username: String,
    preferred_time: String
}));

module.exports = Users;
