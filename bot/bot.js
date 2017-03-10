//--------MODULE IMPORTS---------------
const Telegraf = require('telegraf');
const { memorySession } = require('telegraf');
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow ;


// New bot instance
// const bot = new Telegraf("332098194:AAEajnJlqclK_skVTB1YH4FAiq6zeBOksA0");
const bot = new Telegraf("346554693:AAFEkwIBXEF_yYRUO9olWCBoV59vOwgyPHs"); // Josh's token for testing

//---------BEGIN POLLING--------
bot.use(memorySession());
bot.startPolling();

//-------MODULE EXPORTS--------
module.exports = {
    bot: bot
}

//------RUN YOUR FEATURES BELOW---
const {admin} = require('./features/admin.js');
const {home} = require('./features/home.js');
