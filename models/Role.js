const {mongoose} = require('../database/db.js');

const Role = mongoose.model('Role', new mongoose.Schema({
    roleOrderNumber: Number,
    pastoralRoleHeld: String,
    churchStatus: String
}));

module.exports = Role ;
