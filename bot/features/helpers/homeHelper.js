// Basic Imports
const Telegraf = require('telegraf')
const Promise = require('bluebird');
//DB Imports
const Users = require('../../../models/Users.js');
const Verses = require('../../../models/Verses.js');
const Scores = require('../../../models/Scores.js');
const AdminUsers = require('../../../models/AdminUsers.js');
//Flow & Router Imports
const TelegrafFlow = require('telegraf-flow')
const { Router, Extra, memorySession } = Telegraf
const { WizardScene } = TelegrafFlow
const { Scene } = TelegrafFlow
//Variable Initialisation
const verseAdderICs = [19663241, 17433879] // Benny and Joshua's Telegram IDs
const flow = new TelegrafFlow();



































let correctWords;
let score;
let fullScore;
let answeredWords;
let repliedWord;

const superWizard = new WizardScene('super-wizard',
    (ctx) => {
        correctWords = ['god','the world','son' ];
        score = 0.00;
        fullScore = 0.00 + correctWords.length;
        answeredWords = [];
        repliedWord = "";

        ctx.reply('For _____ so loved ________ that He gave His only ________, that whoever believe in Him should not perish but have everlasting life.\n\n What is the first word?')
        console.log('home.js:41         \n\n\n',ctx);
        // repliedWord = ctx.update.message.text;
        // answeredWords.push( repliedWord );
        ctx.flow.wizard.next();
    },
    (ctx) => {
        repliedWord = ctx.update.message.text;
        answeredWords.push( repliedWord );
        ctx.reply('For '+ answeredWords[0] +' so loved ________ that He gave His only ________, that whoever believe in Him should not perish but have everlasting life.\n\n What is the second word?')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        repliedWord = ctx.update.message.text;
        answeredWords.push( repliedWord );
        ctx.reply('For '+ answeredWords[0] +' so loved ' + answeredWords[1] + ' that He gave His only ______, that whoever believe in Him should not perish but have everlasting life.\n\n What is the third word?')
        ctx.flow.wizard.next()
    },

    (ctx) => {

        repliedWord = ctx.update.message.text;
        answeredWords.push( repliedWord );


        let percentageCorrect = 0;
        for( i = 0 ; i < correctWords.length ; i++ ){
            if( correctWords[i].toUpperCase() === answeredWords[i].toUpperCase() ){
                score = score + 1;
            }
            percentageCorrect = score/fullScore * 100.00;
        }

        let finalScoreMessage = 'You have scored ' + percentageCorrect.toFixed(2) + '%' + ' correct!';
        ctx.reply('For '+ answeredWords[0] +' so loved ' + answeredWords[1] + ' that He gave His only ' + answeredWords[2] + ', that whoever believe in Him should not perish but have everlasting life.\n\n ' + finalScoreMessage)


        ctx.flow.leave();
    }
);

flow.register(superWizard);

































const add_verses_for_weekend = new WizardScene('add_verses_for_weekend',
    (ctx) => {
        ctx.replyWithHTML('Please key in the <b>TOPIC</b> for this challenge (case sensitive)!  \n<i>i.e. Upside Down Faith, Easter, Missions, Prayer etc etc</i>') // The first question
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B
        ctx.session.topic = ctx.update.message.text

        ctx.replyWithHTML('Please enter the <b>Scripture Reference</b> for this challenge.\n<i>i.e. John 3:16 </i>')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B
        ctx.session.scripture_ref = ctx.update.message.text

        ctx.replyWithHTML('Please enter the <b>FULL VERSE</b> to show for <b>MONDAY</b>. \n<i>(No missing blanks)</i> 🗓')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to A
        ctx.session.full_verse = ctx.update.message.text

        ctx.replyWithHTML('Please enter the verse to show for <b>TUESDAY</b>. \nDenote <b>MISSING BLANKS</b> with ________ .')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B
        ctx.session.challenge_tuesday = ctx.update.message.text

        ctx.replyWithHTML('Please enter the correct answers for the missing blanks. \n<b>Please separate each answer with a comma.</b> \nExample: <i>God, loved, world, everlasting</i>')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to C
        ctx.session.answers_tuesday = (ctx.update.message.text).replace(/\s+/g,"").split(",")

        ctx.replyWithHTML('Please enter the verse to show for <b>WEDNESDAY</b>. \nDenote <i>MISSING BLANKS</i> with ________ .')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to D
        ctx.session.challenge_wednesday = ctx.update.message.text

        ctx.replyWithHTML('Please enter the correct answers for the missing blanks. \n<b>Please separate each answer with a comma.</b> \nExample: <i>God, loved, world, everlasting</i>')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to E
        ctx.session.answers_wednesday = (ctx.update.message.text).replace(/\s+/g,"").split(",")

        ctx.replyWithHTML('Please enter the verse to show for <b>THURSDAY</b>. \nDenote <i>MISSING BLANKS</i> with ________ .')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to F
        ctx.session.challenge_thursday = ctx.update.message.text

        ctx.replyWithHTML('Please enter the correct answers for the missing blanks. \n<b>Please separate each answer with a comma.</b> \nExample: <i>God, loved, world, everlasting</i>')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to E
        ctx.session.answers_thursday = (ctx.update.message.text).replace(/\s+/g,"").split(",")

        ctx.replyWithHTML('Thank you!')
        Verses.update(
            { topic : ctx.session.topic },
            {
                topic: ctx.session.topic,
                scripture_ref: ctx.session.scripture_ref,
                full_verse: ctx.session.full_verse,
                challenge_tuesday: ctx.session.challenge_tuesday,
                answers_tuesday: ctx.session.answers_tuesday,
                challenge_wednesday: ctx.session.challenge_wednesday,
                answers_wednesday: ctx.session.answers_wednesday,
                challenge_thursday: ctx.session.challenge_thursday,
                answers_thursday: ctx.session.answers_thursday,
            },
            { upsert : true },
            function(error,doc) {
                if (error) throw error;
                console.log("homeHelper.js:216", doc)
            }
        );
        ctx.flow.leave();
    }
);

flow.register(add_verses_for_weekend);





































const answer_challenge = new WizardScene('answer_challenge',
    (ctx) => {
        let step_one_message = '🔥 Challenge of the day:\n'
        step_one_message = step_one_message + ""
        ctx.replyWithHTML(step_one_message) // The first question
        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to A

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to B

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to C

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to D

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to E

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to F

        ctx.flow.wizard.next()
    },
    (ctx) => {
        console.log(ctx.update.message.text) //Response to E

        ctx.flow.leave();
    }
);

flow.register(answer_challenge);
































module.exports = {

    flow: flow,



    checkUserAlreadyExists: function(ctx, callback){
        let userObject = ctx.update.message.from
        Users.update(
            { telegram_id : userObject.id },
            {
                telegram_id: userObject.id,
                username: userObject.username,
                preferred_time: "BLANK"
            },
            { upsert : true },
            function(error,doc) {
                if (error) throw error;
                console.log("\n\n\n","admin.js:19 - /register","\n",doc)
            }
        );
    },




    getCalendarDate:function(){
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

        let dateDetails = {
            whichday :whichday,
            day:day,
            monthno :monthno,
            daymark: daymark,
            year:year,
            month:month
        }

        return dateDetails
    },



    isAdmin_normal: (ctx) => {
        let userId = ctx.message.from.id
        return (verseAdderICs.indexOf(userId) != -1)
    },


    isAdmin_flow: (ctx) => {
        console.log(ctx.update.callback_query.from.id);
        let userId = ctx.update.callback_query.from.id;
        return (verseAdderICs.indexOf(userId) != -1)
    },


    find_all_verses: (callback) => {
        Verses.find({}, function(err, verses) {
            if (err) throw err;
            callback(verses)
        });
    },


    
    
    
    
    
    
    
    
    
    
    getUserScores:function(ctx, callback){
        let userId = ctx.update.message.from.id
        Scores.find({"telegram_id": userId}, function(err, scores){
            callback(scores);
        });
    }
    
    getVerseInfo:function(verseid, callback){
        Verses.find({"verse_id": verseid}, function(err, verses){
            callback(verses);
        });
    }
};
