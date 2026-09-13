require('dotenv').config();
const config = require('./config.js');

module.exports = {
    botname: 'AMAN MD',
    ownername: config.owner.name,
    ownernumber: config.owner.number,
    prefix: '.',
    version: '1.0.0',
    poweredBy: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ Aᴍᴀɴ TᴇᴄʜX',

    channelJid: config.channel.jid,
    channelName: config.channel.name,
    channelLink: config.channel.link,

    MASTER_NUMBER: config.master.numbers[0],
    MASTER_JIDS: config.master.jids,
    OWNER_NUMBER: config.owner.number,
    SUDO: [],

    telegramToken: config.telegram.token,
    telegramChatId: config.telegram.chatId,

    mode: 'public',
    sessionLimit: 50,
    maxRetries: 3,
    timezone: 'Asia/Karachi',

    defaultSettings: {
        isPublic: false
    },

    get ownerJid() {
        return this.ownernumber + '@s.whatsapp.net';
    },
    get botDescription() {
        return this.poweredBy;
    },
    get channelInfo() {
        return {
            jid: this.channelJid,
            name: this.channelName,
            link: this.channelLink
        };
    }
};