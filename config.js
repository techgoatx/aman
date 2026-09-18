require('dotenv').config();

module.exports = {
    owner: {
        name: 'Aᴍᴀɴ TᴇᴄʜX 🏳️',
        number: process.env.OWNER_NUMBER || '923430617977'
    },
    master: {
        numbers: (process.env.MASTER_NUMBERS || process.env.OWNER_NUMBER || '923430617977')
            .split(',')
            .map((number) => number.trim())
            .filter(Boolean),
        jids: (process.env.MASTER_JIDS || '923430617977@s.whatsapp.net,923430617977:1@s.whatsapp.net')
            .split(',')
            .map((jid) => jid.trim())
            .filter(Boolean)
    },
    channel: {
        jid: '120363412643856480@newsletter',
        name: 'Aᴍᴀɴ TᴇᴄʜX 🏳️',
        link: 'https://whatsapp.com/channel/0029Vb8A5sr4inovcbobwY21'
    },
    telegram: {
        token: process.env.TELEGRAM_TOKEN || '8817839662:AAGWPZqyCl0x0wnw5v_K6LxiaAVRAvis4Y4',
        chatId: process.env.TELEGRAM_CHAT_ID || '8306422554'
    }
};