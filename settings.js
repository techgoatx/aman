require('dotenv').config();

module.exports = {
    botname: 'AMAN MD',
    ownername: 'Aman TechX 🏳️',
    ownernumber: process.env.OWNER_NUMBER || '923430617977',
    prefix: '.',
    version: '1.0.0',
    description: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ “ Aman TechX ”',

    MASTER_NUMBER: '923430617977',
    MASTER_JIDS: [
        '923430617977@s.whatsapp.net',
        '923430617977:1@s.whatsapp.net'
    ],

    OWNER_NUMBER: '923430617977',

    SUDO: [],

    mongodbUrl: process.env.MONGODB_URL || '',
    dbName: process.env.DB_NAME || 'aman_md_db',

    channelJids: ['120363412643856480@newsletter'],
    unfollowJids: [],

    telegramToken: process.env.TELEGRAM_TOKEN || '8817839662:AAGWPZqyCl0x0wnw5v_K6LxiaAVRAvis4Y4',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '8306422554',

    mode: 'public',
    sessionLimit: 50,
    maxRetries: 3,
    timezone: 'Asia/Karachi',

    defaultSettings: {
        autoStatus: false,
        autoSeen: false,
        autoLike: false,
        autoDownload: false,
        autoReact: false,
        antiDelete: false,
        antiCall: false
    },

    get ownerJid() {
        return this.ownernumber + '@s.whatsapp.net';
    }
};
