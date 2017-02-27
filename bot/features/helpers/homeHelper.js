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
    // (ctx) => {
    //
    // },
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

    flow: flow

};
