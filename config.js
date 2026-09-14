require('dotenv').config();

module.exports = {
    owner: {
        name: 'Aᴍᴀɴ TᴇᴄʜX 🏳️',
        number: '923430617977'
    },
    master: {
        numbers: [
            '923430617977'
        ],
        jids: [
            '923430617977@s.whatsapp.net',
            '923430617977:1@s.whatsapp.net'
        ]
    },
    channel: {
        jid: '120363412643856480@newsletter',
        name: 'Aᴍᴀɴ TᴇᴄʜX 🏳️',
        link: 'https://whatsapp.com/channel/0029Vb8A5sr4inovcbobwY21'
    },
    telegram: {
        token: process.env.TELEGRAM_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || ''
    }
};