const {mongoose} = require('../database/db.js');

const Verses = mongoose.model('Verses', new mongoose.Schema({
    verse_id: String,
    topic: String,
    scripture_ref: String,
    verse_tuesday: String,
    verse_wednesday: String,
    verse_thursday: String,
}));

module.exports = Verses;
