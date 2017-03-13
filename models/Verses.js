const {mongoose} = require('../database/db.js');

const Verses = mongoose.model('Verses', new mongoose.Schema({
    challenge_name: String,
    topic: String,
    scripture_ref: String,
    full_verse: String,
    challenge_tuesday: String,
    answers_tuesday: Array,
    challenge_wednesday: String,
    answers_wednesday: Array,
    challenge_thursday: String,
    answers_thursday: Array,
}));

module.exports = Verses;
