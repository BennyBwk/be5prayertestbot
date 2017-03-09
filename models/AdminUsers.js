const {mongoose} = require('../database/db.js');

const adminUsersSchema = new mongoose.Schema({
    telegram_id: String,
    first_name: String,
    last_name: String,
    username: String,
    numberPassword: String,
    isLoggedIn: Boolean,
    cg: String
});

const AdminUsers = mongoose.model('AdminUser', adminUsersSchema);

module.exports = AdminUsers ;
