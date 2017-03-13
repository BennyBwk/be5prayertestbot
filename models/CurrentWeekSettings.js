const {mongoose} = require('../database/db.js');

const CurrentWeekSettings = mongoose.model('CurrentWeekSettings', new mongoose.Schema({
    settings: String,
    challenge_of_the_week_id: String,  //This is the _id of a Verse object in Verses.js
}));

module.exports = CurrentWeekSettings;
