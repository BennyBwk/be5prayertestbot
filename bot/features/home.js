//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const {bot} = require('../bot.js');
const {simpleRouter, setPasswordMarkup} = require('../router/router.js');
const homeHelper = require('./helpers/homeHelper.js');
const cron = require('node-cron');
const flow = homeHelper.flow ; 



// ------------- THE "START" COMMAND------------------
bot.command('start', (ctx) => {
    console.log("\n\n", "home.js:18       ", "\n", ctx.update);
    // running /start is also able to clear the cache on Telegram's side.
    ctx.replyWithHTML("Hello, my name is <b>🦁 SevenThreeBot</b>, your \nfriendly bible verse buddy!");
    
    var d = new Date();
    var whichday = d.getDay();
    var day = d.getDate();
    var monthno = d.getMonth();
    var daymark;
    var year = d.getFullYear();
    if (day == 1){
        daymark = "st";
    } else if (day == 2) {
        daymark = "nd";
    } else if (day == 3) {
        daymark = "rd";
    } else { 
        daymark = "th";
    }
    var month;
    if (monthno == 0){
        month = "January"
    } else if (monthno == 1){
        month = "February"
    } else if (monthno == 2){
        month = "March"
    } else if (monthno == 3){
        month = "April"
    } else if (monthno == 4){
        month = "May"
    } else if (monthno == 5){
        month = "June"
    } else if (monthno == 6){
        month = "July"
    } else if (monthno == 7){
        month = "August"
    } else if (monthno == 8){
        month = "September"
    } else if (monthno == 9){
        month = "October"
    } else if (monthno == 10){
        month = "November"
    } else if (monthno == 11){
        month = "December"
    }
    
    var task = cron.schedule('0 25 17 * * 1-5', function() {
        
        if (whichday == 1) {
            //Get verse from database according to date
            ctx.replyWithHTML("Today's Verse - " + day + daymark + " " + month + " " + year + "\n\nPsalm 119:105\nYour word is a lamp to my feet and a light to my path");
        } else if (whichday == 2) {
            //Tuesday's Challenge
        } else if (whichday == 3){
            //Wednesday's Challenge
        } else if (whichday == 4){
            //Thursday's Challenge
        } else if (whichday == 5){
            //Friday's Challenge
        }
            
    }, false);

    task.start();

});



flow.command('answer', (ctx) => ctx.flow.enter('super-wizard'))

bot.on('text', flow.middleware());

//---Import this inside bot.js at the bottom----
module.exports = {
    home:bot
}
