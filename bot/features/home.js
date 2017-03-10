//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const TelegrafFlow = require('telegraf-flow')
const {Extra, Markup} = require('telegraf');
const { memorySession } = require('telegraf');
const cron = require('node-cron');
const {bot} = require('../bot.js');
const {simpleRouter} = require('../router/router.js');
const homeHelper = require('./helpers/homeHelper.js');
const flow = homeHelper.flow ;
bot.use(flow)
bot.use(simpleRouter)

//---------USE ROUTER-----------
bot.on('callback_query', simpleRouter.middleware())

























// ------------- THE "START" COMMAND------------------
bot.command('start', (ctx) => {
    homeHelper.checkUserAlreadyExists( ctx, function(user){
        console.log(user)
    });
    console.log("\n\n", "home.js:46      ", "\n", ctx.update);
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






















let main_admin_menu_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('💡 Create Verse Challenge', 'main_admin_menu:create'),
    m.callbackButton('📋 List All Challenges', 'main_admin_menu:read'),
    m.callbackButton('✏️ Edit Challenge', 'main_admin_menu:update'),
    m.callbackButton('🚫 Delete Challenge', 'main_admin_menu:delete'),
    m.callbackButton('👊🏼 Set Challenge For The Week', 'main_admin_menu:set_challenge_for_week'),
], {columns: 2}));
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
let list_all_challenges_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('👈🏼 Back To Main Menu', 'list_all_challenges_menu:back'),
], {columns: 2}));


















// ------------- THE "MANAGE" COMMAND------------------
bot.command('manage', (ctx) => {
    if(homeHelper.isAdmin_normal(ctx)){
        ctx.replyWithHTML("Select an option below to continue...",main_admin_menu_markup);
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});


simpleRouter.on('main_admin_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        switch(ctx.state.value){
            // For the case of creating the verses
            case "create" :
                ctx.editMessageText('Create New Verse Challenge Selected! 😛')
                ctx.flow.enter('add_verses_for_weekend')
                break;
            //For the case of listing out all of the verses
            case "read" :
                homeHelper.find_all_verses((verses)=>{
                    let list_all_challenge_message = "📋 List All Challenges:\n"
                    verses.forEach((verse)=>{
                        list_all_challenge_message = list_all_challenge_message + "\n<b>Challenge Name</b>: " + verse.challenge_name
                        list_all_challenge_message = list_all_challenge_message + "\n<code>Topic: " + verse.topic + "</code>"
                        list_all_challenge_message = list_all_challenge_message + "\n<code>Scripture Reference: " + verse.scripture_ref + "</code>"
                        list_all_challenge_message = list_all_challenge_message + "\n\n\n======================"
                    })
                    ctx.editMessageText( list_all_challenge_message , list_all_challenges_markup )
                })
                break;
            // For the case of updating the verses
            case "update" :
                let update_challenge_buttons = []
                // Turn all of the challenges into buttons
                homeHelper.find_all_verses((verses)=>{
                    // Create the button menu
                    let update_challenge_menu_markup = Extra
                    .HTML()
                    .markup((m) => {
                        let update_challenge_menu_buttons = verses.map((verse) => {
                            return m.callbackButton(verse.challenge_name, 'list_all_challenges_menu:back')
                        })
                        update_challenge_menu_buttons.push(m.callbackButton('👈🏼 Back To Main Menu', 'list_all_challenges_menu:back'))

                        return m.inlineKeyboard( update_challenge_menu_buttons , {columns: 2})
                    })
                    ctx.editMessageText('Choose a Challenge To <b>UPDATE</b>:', update_challenge_menu_markup)
                })

                break;
            case "delete" :


                break;
            case "set_challenge_for_week" :


                break;
            default:
                //Intentionally Blank
        }
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});

simpleRouter.on('list_all_challenges_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        switch(ctx.state.value){
            case "back" :
                ctx.editMessageText("Select an option below to continue...",main_admin_menu_markup)
                break;
            default:
                //Intentionally Blank
        }
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});






























// -------------- ADD VERSES ----------
flow.command('challenge', (ctx) => {
    ctx.flow.enter('answer_challenge')
});




























































flow.command('answer', (ctx) => {
    ctx.flow.enter('super-wizard')
})
















bot.on('text', flow.middleware());



//---Import this inside bot.js at the bottom----
module.exports = {
    home:bot
}
