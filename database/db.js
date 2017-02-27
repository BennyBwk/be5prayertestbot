//----DB MODULE IMPORTS------
const mongoose = require('mongoose');

//Lets connect to our database using the DB server URL.
mongoose.connect(process.env.DB_PATH);

module.exports = {
    mongoose:mongoose
}
