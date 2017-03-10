//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const { Extra, Markup} = require('telegraf');
const {bot} = require('../bot.js');
const {simpleRouter, setPasswordMarkup} = require('../router/router.js');
const homeHelper = require('./helpers/homeHelper.js');
const cron = require('node-cron');
const flow = homeHelper.flow ;



























// ------------- THE "START" COMMAND------------------
bot.command('start', (ctx) => {
    homeHelper.checkUserAlreadyExists( ctx, function(user){
        console.log(user)
    });
    console.log("\n\n", "home.js:18       ", "\n", ctx.update);
    // running /start is also able to clear the cache on Telegram's side.
    ctx.replyWithHTML("Hello, my name is <b>🦁 SevenThreeBot</b>, your \nfriendly bible verse buddy!");

    var task = cron.schedule('0 25 17 * * 1-5', function() {
        let dateTimeStuff = homeHelper.getCalendarDate()

        if (dateTimeStuff.whichday == 1) { // 0 is Sunday, 1 is Monday
            //Get verse from database according to date
            ctx.replyWithHTML("Today's Verse - " + dateTimeStuff.day + dateTimeStuff.daymark + " " + dateTimeStuff.month + " " + dateTimeStuff.year + "\n\nPsalm 119:105\nYour word is a lamp to my feet and a light to my path");
        } else if (dateTimeStuff.whichday == 2) {
            //Tuesday's Challenge
        } else if (dateTimeStuff.whichday == 3){
            //Wednesday's Challenge
        } else if (dateTimeStuff.whichday == 4){
            //Thursday's Challenge
        } else if (dateTimeStuff.whichday == 5){
            //Friday's Challenge
        }

    }, false);
    task.start();
});






















// ------------- THE "SCORE" COMMAND------------------
bot.command('score', (ctx) => {
    // Get user's score
    let overallscore = 0;
    let fullmarkscore = 0;
    let scorepercentage;
    let scoremessage = "";
    let verseid = "";
    let topic = "";
    let verse = "";
    
    homeHelper.getUserScores( ctx, function(scores){
        

        scores.forEach(function(scoreEntry){
            overallscore = overallscore + scoreEntry.score
            fullmarkscore = fullmarkscore + scoreEntry.fullmarks
        });
        
        scorepercentage = (overallscore/fullmarkscore) * 100;
        scoremessage = scoremessage + "Overall Score: " + overallscore + " / " + fullmarkscore + "\n Percentage: " + scorepercentage + "% \n\n-------------------------\n";

        scores.forEach(function(scoreEntry){
            //find verse using id
            verseid = scoreEntry.verse_id;
            homeHelper.getVerseInfo( verseid, function(verses){
                topic = verses.topic;
                verse = verses.scripture_ref;
            });
            scoremessage = scoremessage + "\nTopic: " + topic + "\nVerse: " + verse + "\nScore: " + scoreEntry.score + "\n"
        });
        
        ctx.replyWithHTML(scoremessage);
    });
});


















// ------------- THE "MANAGE" COMMAND------------------
bot.command('manage', (ctx) => {
    if(homeHelper.isAdmin(ctx)){
        let mainAdminMenuMarkup = Extra
            .HTML()
            .markup((m) => m.inlineKeyboard([
                m.callbackButton('💡 Create Verse Challenge', 'main_admin_menu:create'),
                m.callbackButton('📋 List All Challenges', 'main_admin_menu:read'),
                m.callbackButton('✏️ Edit Challenge', 'main_admin_menu:update'),
                m.callbackButton('🚫 Delete Challenge', 'main_admin_menu:delete'),
            ], {columns: 2}));
        ctx.replyWithHTML("Select an option below to continue...",mainAdminMenuMarkup);
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});



simpleRouter.on('main_admin_menu', (ctx) => {
    ctx.editMessageText(`Set Password: <b>${ctx.session.passwordStarField}</b>`, setPasswordMarkup1).catch(() => undefined)
});















// -------------- ADD VERSES ----------
flow.command('add', (ctx) => {
    if(homeHelper.isAdmin(ctx)){
        ctx.flow.enter('addVersesForTheWeekWizard')
    }else{

    }
})























flow.command('answer', (ctx) => {
    ctx.flow.enter('super-wizard')
})
















bot.on('text', flow.middleware());



//---Import this inside bot.js at the bottom----
module.exports = {
    home:bot
}
