const TelegrafFlow = require('telegraf-flow')
const { WizardScene } = TelegrafFlow
const Promise = require('bluebird');

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



module.exports = {

    flow: flow,

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
    }

};
