const TempWaitingListUser = require('../../../models/TempWaitingListUser.js');
const AdminUsers = require('../../../models/AdminUsers.js');
const masterAdminID = "17433879"; //This is my (Joshua's) telegram ID

module.exports = {

    registerUserWithUserObject: function(userObject){
        TempWaitingListUser.update(
            { telegram_id : userObject.id },
            {
                telegram_id: userObject.id,
                first_name: userObject.first_name,
                last_name: userObject.last_name,
                username: userObject.username
            },
            { upsert : true },
            function(error,doc) {
                if (error) throw error;
                console.log("\n\n\n","admin.js:19 - /register","\n",doc)
            }
        );
    },

    findUserForApproval: function (telegramUsername,callback){
        TempWaitingListUser
        .find({username: telegramUsername})
        .limit(1)
        .exec(function(error, doc) {
            if (error) throw error;
            callback(doc);
        });
    },

    findAdminUser: function (telegramUsername,callback){
        AdminUsers
        .find({username: telegramUsername})
        .limit(1)
        .exec(function(error, doc) {
            if (error) throw error;
            callback(doc);
        });
    },

    addUserToAdminUsers: function (telegramUsername, callback){
        // Search for the user's temp waiting list application data
        this.findUserForApproval(telegramUsername,function(doc){
            if(doc.length>0){
                AdminUsers.update(
                    { telegram_id : doc[0].telegram_id },
                    {
                        telegram_id: doc[0].telegram_id,
                        first_name: doc[0].first_name,
                        last_name: doc[0].last_name,
                        username: doc[0].username
                    }
                    , { upsert : true },
                    function(error,doc) {
                        if (error) throw error;
                        callback(doc);
                    }
                );
            }else{
                console.log("adminHelper.js:69    ","ERROR USEROBJECT NOT FOUND!!");
                callback([{}]);
            }
        });
    },

    removeAdminUser: function(theUsername, callback){
        let message = "";
        this.findAdminUser(theUsername, function(doc){
            if(doc.length==0){
                message = "Admin User does not exist! 🤔";
                callback(message);
            }else{
                AdminUsers.findOneAndRemove({ username: theUsername}, function(err) {
                    if (err) throw err;
                    message = "Admin User @" + theUsername + " has been removed! 🚷";
                    callback(message);
                });
            }
        });
    },


    showAllAdminUsers: function(callback){
        AdminUsers.find({}, function(err, users) {
        if (err) throw err;
            callback(users);
        });
    },


    isTheUserTheMasterAdmin: function(ctx){
        let ctxTelegramID = (""+ctx.update.message.from.id || ""); // Add ""+ to cast ctx.update.message.from.id to a String
        return ctxTelegramID === masterAdminID;
    },


    addNewFieldToAllUsers: () => {
        AdminUsers.find({}, function(err, users) {
            if (err) throw err;
            users.forEach((user) => {
                AdminUsers.update(
                    {_id: user._id},
                    {$set: { cg: "unset" }},
                    { upsert : true },
                    function(error,doc) {
                        if (error) throw error;
                        console.log("adminHelper.js:138      ", "NEW FIELD ADDED!");
                    }
                );
            });
        });
    },

    assignCgToPerson: function(theUsername, cgToSet, callback){
        AdminUsers.update(
            { username : theUsername },
            { cg: cgToSet },
            { upsert : true },
            function(error,doc) {
                if (error) throw error;
                console.log(theUsername + " assigned to " + cgToSet);
                callback(true);
            }
        );
    },

    addNewCG: function(newCGName, callback){
        CG.update(
            { cg : newCGName.toUpperCase() },
            { cg: newCGName.toUpperCase() },
            { upsert : true },
            function(error,doc) {
                if (error) throw error;
                console.log("adminHelper:165     New CG Added - ",  cgToSet);
                callback(true);
            }
        );
    },

};
