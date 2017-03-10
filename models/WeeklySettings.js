const {mongoose} = require('../database/db.js');

const WeeklySettings = mongoose.model('WeeklySettings', new mongoose.Schema({
    settings_name: String,
    topic_of_the_week: String,
}));

module.exports = WeeklySettings;
