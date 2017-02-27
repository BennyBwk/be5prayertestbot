const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const adminUserSchema = new mongoose.Schema({
    telegram_id: String,
    first_name: String,
    last_name: String,
    username: String,
    numberPassword: String,
    isLoggedIn: Boolean,
    cg: String
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser ;
