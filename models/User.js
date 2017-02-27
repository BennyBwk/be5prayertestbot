const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const userSchema = new mongoose.Schema({
    telegramUserId: String, // this is generated by Telegram
    shortPrintedName: String,    // Short Name for attendance
    roleOrderNumber: Number, // 1=Guest, 2=NewFriend, 3=U_Inte, 4=Inte, 5=G_Inte, 6=Regular
    actsName: Number,    // Full name in ACTS
    schoolName: String,  // University or Poly Name
    pastoralTeamName: String, //i.e. Nic's Team, Ruo En's Team etc
});

const User = mongoose.model('User', userSchema);

module.exports = User ;