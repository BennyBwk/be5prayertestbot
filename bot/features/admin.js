//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const {bot} = require('../bot.js');
const {simpleRouter, setPasswordMarkup} = require('../router/router.js');
const adminHelper = require('./helpers/adminHelper.js');





















//---------------------------SHOW ADMIN COMMANDS--------------------------------
// bot.command('special', (ctx) => {
//     if(adminHelper.isTheUserTheMasterAdmin(ctx)){
//         let message = "🔥<b>Admin Commands:</b>🔥";
//         message = message + "\n\n" + "<b>/admins</b> \nGets a list of all AdminUsers."
//         message = message + "\n\n" + "<b>/register</b> \nUser gets registered."
//         message = message + "\n\n" + "<b>/approve </b><i>usernameHere</i> \nApproves a registered User as an AdminUser."
//         message = message + "\n\n" + "<b>/reject </b><i>usernameHere</i> \nRemoves a registered User as an AdminUser."
//         message = message + "\n\n" + "<b>/logoutAll </b> \nLogs all AdminUsers out."
//         message = message + "\n\n" + "<b>/newField </b> \nAdds a new field/property to all AdminUsers in the database."
//         message = message + "\n\n" + "<b>/setCG </b><i>username </i><i>cgName</i>  \nSets the CG for a particular user."
//         ctx.replyWithHTML(message);
//     }else{
//         return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
//     }
// })
//
//




























//----------------------------------REGISTER--------------------------------
bot.command('register', (ctx) => {
    console.log(ctx.update.message);
    // Get the user's details (object)
    let userObject = ctx.update.message.from;
    //Add the user's details to the temp admin waiting list
    adminHelper.registerUserWithUserObject(userObject);
    // Tell the user that his/her application has been received!
    return ctx.reply("Admin User Application received!✔️💯\nWe will let you know in person, \nonce your registration is approved! 😊");
});

































//----------------------------------AUTHORISE REGISTRANTS-------------------
bot.hears(/approve (.+)/, (ctx) => { // To authorize a person to become an admin on the waiting list, type /create theUsersTelegramUsername
    // console.log(ctx.update.message.from);
    // Make sure Josh is the person to authorize applications
    if(adminHelper.isTheUserTheMasterAdmin(ctx)){
        let usernameToFind =ctx.match[1];
        adminHelper.findUserForApproval(usernameToFind,function(doc){
            if(doc.length > 0){
                adminHelper.addUserToAdminUsers(usernameToFind, function(doc){
                    console.log("Admin User approved and added!     ", doc);
                    return ctx.replyWithHTML("🎉 @" + usernameToFind + " is now an Admin User! 🎉");
                });
            }else{
                return ctx.reply("Sorry, this user has not submitted an Admin User application!😞 \nPlease ask the user to type in /register!");
            }
        });
    }else{
        return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
    }
});


























//-----------------------------DEAUTHORISE EXISTING ADMIN USER-------------------
bot.hears(/reject (.+)/, (ctx) => {
    if(adminHelper.isTheUserTheMasterAdmin(ctx)){
        adminHelper.removeAdminUser(ctx.match[1],function(message){
            return ctx.reply(message);
        });
    }else{
        return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
    }
});































//-----------------LIST ALL ADMIN USERS--------------------
bot.command('admins', (ctx) => {
    if(adminHelper.isTheUserTheMasterAdmin(ctx)){
        adminHelper.showAllAdminUsers(function(arrayOfUsers){
            let message = "🦁 <b>Admin Users:</b>\n\n";
            console.log(arrayOfUsers);
            counter = 0;
            if(arrayOfUsers.length==0){
                message = message + "<i>😐 Empty 😐</i>"
            }
            arrayOfUsers.map(function(user){
                counter = counter + 1;
                message = message + counter + ". " + "@" +  user.username + "\n" ;
                message = message + "Name: <b>" + user.first_name + " " + (user.last_name || "") + "</b>\n" ;
                message = message + "CG: <b>" + user.cg + "</b>\n\n" ;
            });
            return ctx.replyWithHTML( message );
        })
    }else{
        return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
    }
});


















//---------------------- ADD NEW FIELD TO EVERYONE ---------------
// bot.command('newField', (ctx) => {
//     if(adminHelper.isTheUserTheMasterAdmin(ctx)){
//         adminHelper.addNewField();
//         return ctx.replyWithHTML("<i>New field added for all users!</i> ");
//     }else{
//         return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
//     }
// });
//
//
//
//





















//-----------------------------DEAUTHORISE EXISTING ADMIN USER-------------------
// bot.hears(/setCG (.+)/, (ctx) => {
//     if(adminHelper.isTheUserTheMasterAdmin(ctx)){
//         var usernameOfUser = (ctx.match[1].split(" ")[0] || "");
//         var cgToSet = (ctx.match[1].split(" ")[1] || "");
//         if(cgToSet==="" || usernameOfUser===""){
//             return ctx.replyWithHTML("The correct format should be:\n\n <b>/setCG</b> <i>username</i> <i>cgName</i>");
//         }else{
//             adminHelper.assignCgToPerson(usernameOfUser, cgToSet, function(hasCgBeenSet){
//                 console.log("admin.js:172      ", hasCgBeenSet);
//                 return ctx.replyWithHTML(usernameOfUser + " has been assigned to " + cgToSet);
//             })
//         }
//     }else{
//         return ctx.replyWithHTML("<i>Sorry, you are not authorized to run this command!</i>🚷 ");
//     }
// });
























//
//
//
//
//
// bot.hears(/addCG (.+)/, (ctx) => {
//     adminHelper.addNewCG( ctx.match[1], function( cgHasBeenAdded ){
//
//     })
// });




























//---Import this inside bot.js at the bottom----
module.exports = {
    admin:bot
}
