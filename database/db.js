//----DB MODULE IMPORTS------
const mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect("mongodb://localhost:27017/seventhreebot");

module.exports = {
    mongoose:mongoose
}
