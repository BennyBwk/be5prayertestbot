//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const TelegrafFlow = require('telegraf-flow')
const {Extra, Markup} = require('telegraf');
const { memorySession } = require('telegraf');
const cron = require('node-cron');
const {bot} = require('../bot.js');
const {simpleRouter} = require('../router/router.js');
const Verses = require('../../models/Verses.js');
const CurrentWeekSettings = require('../../models/CurrentWeekSettings.js');
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
    ctx.replyWithHTML("Hello, my name is <b>🦁 SevenThreeBot</b>, your \nfriendly bible verse buddy! \n\nType /begin to access the main menu!");

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
































let main_admin_menu_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('💡 Create Verse Challenge', 'main_admin_menu:create'),
    m.callbackButton('📋 List All Challenges', 'main_admin_menu:read'),
    m.callbackButton('✏️ Edit Challenge', 'main_admin_menu:update'),
    m.callbackButton('🚫 Delete Challenge', 'main_admin_menu:delete'),
    m.callbackButton('👊🏼 Set Challenge For The Week', 'main_admin_menu:set_challenge_for_week'),
], {columns: 2}));

let list_all_challenges_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('👈🏼 Back To Main Menu', 'list_all_challenges_menu:back'),
], {columns: 2}));

let update_a_challenge_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('👊🏼 Update Challenge Name',                         'update_a_challenge:challenge_name'),
    m.callbackButton('💬 Update Topic Name',                             'update_a_challenge:topic'),
    m.callbackButton('🏷 Update Scripture Reference',                    'update_a_challenge:scripture_ref'),
    m.callbackButton('📖 Update Full Verse (Shown on Monday)',           'update_a_challenge:full_verse'),
    m.callbackButton('📖 Update Tuesday Challenge',                      'update_a_challenge:challenge_tuesday'),
    m.callbackButton('📖 Update Tuesday Answers (comma separated)',      'update_a_challenge:answers_tuesday'),
    m.callbackButton('📖 Update Wednesday Questions',                    'update_a_challenge:challenge_wednesday'),
    m.callbackButton('📖 Update Wednesday Answers (comma separated)',    'update_a_challenge:answers_wednesday'),
    m.callbackButton('📖 Update Thursday Questions',                     'update_a_challenge:challenge_thursday'),
    m.callbackButton('📖 Update Thursday Answers (comma separated)',     'update_a_challenge:answers_thursday'),
    m.callbackButton('👈🏼 Back To Main Menu', 'update_a_challenge:back')
], {columns: 1}));

let delete_a_challenge_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('Yes, Delete Challenge',                'delete_a_challenge:yes'),
    m.callbackButton('No, Do Not Delete Challenge',          'delete_a_challenge:back'), // Same as go back
    m.callbackButton('👈🏼 Back',                                 'delete_a_challenge:back')
], {columns: 1}));
































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
                ctx.session.main_admin_menu_markup = main_admin_menu_markup //Stores it in the session to be used later on
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
                        list_all_challenge_message = list_all_challenge_message + "\n<code>Reference: " + verse.scripture_ref + "</code>"
                        list_all_challenge_message = list_all_challenge_message + "\n"
                    })
                    list_all_challenge_message = list_all_challenge_message + "\n\n======================"
                    ctx.editMessageText( list_all_challenge_message , list_all_challenges_markup )
                })
                break;
            // For the case of updating the verses
            case "update" :
                homeHelper.choose_challenge_to_update_menu(ctx)
                break;
            case "delete" :
                homeHelper.choose_challenge_to_delete(ctx)
                break;
            case "set_challenge_for_week" :
                console.log("home.js:288")
                homeHelper.choose_challenge_for_week(ctx)
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

simpleRouter.on('update_a_challenge_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        ctx.session.verse_id = ctx.state.value // stores the verse_id to be used later
        ctx.session.update_a_challenge_markup = update_a_challenge_markup // Store this inside for use later.
        ctx.editMessageText("Choose an attribute of the Challenge to update: ",update_a_challenge_markup)
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});


simpleRouter.on('update_a_challenge', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        ctx.session.update_a_challenge_markup = update_a_challenge_markup
        switch(ctx.state.value){
            case "challenge_name" :
                ctx.flow.enter('update_challenge_name')
                break;
            case "topic" :
                ctx.flow.enter('update_topic')
                break;
            case "scripture_ref" :
                ctx.flow.enter('scripture_ref')
                break;
            case "full_verse" :
                ctx.flow.enter('update_full_verse')
                break;
            case "challenge_tuesday" :
                ctx.flow.enter('update_challenge_tuesday')
                break;
            case "answers_tuesday" :
                ctx.flow.enter('update_answers_tuesday')
                break;
            case "challenge_wednesday" :
                ctx.flow.enter('update_challenge_wednesday')
                break;
            case "answers_wednesday" :
                ctx.flow.enter('update_answers_wednesday')
                break;
            case "challenge_thursday" :
                ctx.flow.enter('update_challenge_thursday')
                break;
            case "answers_thursday" :
                ctx.flow.enter('update_answers_thursday')
                break;
            case "back" :
                homeHelper.choose_challenge_to_update_menu(ctx)
                break;
            default:
                //Intentionally Blank
        }
        ctx.replyWithHTML("Done!");
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});


simpleRouter.on('delete_a_challenge_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        ctx.session.verse_id = ctx.state.value // stores the verse_id to be used later
        ctx.editMessageText("Choose a challenge to delete: ", delete_a_challenge_markup)
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});


simpleRouter.on('delete_a_challenge', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        ctx.session.update_a_challenge_markup = update_a_challenge_markup
        switch(ctx.state.value){
            case "yes" :
                Verses.findOneAndRemove({ _id: ctx.session.verse_id }, function(err) {
                    if (err) throw err;
                    console.log('Challenge deleted!');
                    homeHelper.choose_challenge_to_delete(ctx)
                });
                break;
            case "back" :
                homeHelper.choose_challenge_to_delete(ctx)
                break;
            default:
                //Intentionally Blank
        }
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});

simpleRouter.on('choose_a_challenge_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        switch(ctx.state.value){ //Either a verse_id or "back"
            case "back" :
                homeHelper.choose_challenge_for_week(ctx)
                break;
            default:
                let verse_object_id = ctx.state.value
                CurrentWeekSettings.update(
                    { settings : 'challenge' },
                    {
                        challenge_of_the_week_id : verse_object_id
                    },
                    { upsert : true },
                    function(error,doc) {
                        if (error) throw error;
                        console.log("\n\n\n","home.js:420     ","\n",doc)
                        ctx.editMessageText("<b>Challenge has been set!</b>    \n\nSelect an option below to continue...",main_admin_menu_markup);
                    }
                );
        }
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});




































let public_main_menu_markup = Extra
.HTML()
.markup((m) => m.inlineKeyboard([
    m.callbackButton('💡 Answer Challenge of The Day', 'main_public_menu:answer_challenge'),
    m.callbackButton('📋 View Your Score', 'main_public_menu:view_own_score'),
    m.callbackButton('👥 Live Scoreboard', 'main_public_menu:friends_score'),
    m.callbackButton('👥 Add Friend', 'main_public_menu:add_friend'),
    m.callbackButton('👥 Remove Friend', 'main_public_menu:friends_score'),
    // m.callbackButton('✏️ Edit', 'main_admin_menu:update'),
    // m.callbackButton('🚫 Delete Challenge', 'main_admin_menu:delete'),
    // m.callbackButton('👊🏼 Set Challenge For The Week', 'main_admin_menu:set_challenge_for_week'),
], {columns: 1}));

simpleRouter.on('main_public_menu', (ctx) => {
    if(homeHelper.isAdmin_flow(ctx)){
        ctx.session.update_a_challenge_markup = update_a_challenge_markup
        switch(ctx.state.value){
            case "add_friend" :
                ctx.flow.enter('public_add_friend')
                break;
            case "view_own_score":

                break;
            case "friends_score":

                break;
            default:
                //Intentionally Blank
        }
    }else{
        ctx.replyWithHTML("Sorry, this command is not available");
    }
});

// ------------- THE "BEGIN" COMMAND------------------
bot.command('begin', (ctx) => {
    ctx.session.public_main_menu_markup = public_main_menu_markup //store it for later use
    ctx.replyWithHTML("Select an option below to continue...", public_main_menu_markup);
});



flow.command('add', (ctx) => { // Adds a friend
    ctx.flow.enter('super-wizard')
})

flow.command('remove', (ctx) => { // Adds a friend
    ctx.flow.enter('super-wizard')
})



































































flow.command('answer', (ctx) => {
    ctx.flow.enter('super-wizard')
})
















bot.on('text', flow.middleware());



//---Import this inside bot.js at the bottom----
module.exports = {
    home:bot
}
