const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const {mongoose} = require('../database/db.js');

const roleSchema = new mongoose.Schema({
    roleOrderNumber: Number,
    pastoralRoleHeld: String,
    churchStatus: String
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role ;
