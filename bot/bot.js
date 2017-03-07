//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const { memorySession } = require('telegraf');
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow ;


//-----ROUTER IMPORTS-----
const {simpleRouter, LoginHTMLMarkup} = require('./router/router.js');

// New bot instance
const bot = new Telegraf("332098194:AAEajnJlqclK_skVTB1YH4FAiq6zeBOksA0");
// This allows chats to have a session object to store stuff
bot.use(memorySession());

//---------USE ROUTER-----------
bot.on('callback_query', simpleRouter.middleware())

//---------BEGIN POLLING--------
bot.startPolling();

//-------MODULE EXPORTS--------
module.exports = {
    bot: bot
}

//------RUN YOUR FEATURES BELOW---
const {admin} = require('./features/admin.js');
const {home} = require('./features/home.js');
