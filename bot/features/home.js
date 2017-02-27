//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const {bot} = require('../bot.js');
const {simpleRouter, setPasswordMarkup} = require('../router/router.js');
const homeHelper = require('./helpers/homeHelper.js');
const flow = homeHelper.flow ;

/*
Commands:


*/


// ------------- THE "START" COMMAND------------------
bot.command('start', (ctx) => {
    console.log("\n\n", "home.js:18       ", "\n", ctx.update);
    // running /start is also able to clear the cache on Telegram's side.
    ctx.replyWithHTML("Hello, my name is <b>🦁 SevenThreeBot</b>, your \nfriendly bible verse buddy!");
});

flow.command('answer', (ctx) => ctx.flow.enter('super-wizard'))

bot.on('text', flow.middleware());

//---Import this inside bot.js at the bottom----
module.exports = {
    home:bot
}
