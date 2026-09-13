const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/bot_data.json');

cmd({
    pattern: 'private',
    category: 'owner',
    description: '🔒 Sᴇᴛ ʙᴏᴛ ᴛᴏ ᴘʀɪᴠᴀᴛᴇ ᴍᴏᴅᴇ',
    react: '🔒',
    type: 'owner'
}, async (sock, msg, args, context) => {
    try {
        const { isOwner, isMaster, reply } = context;
        if (!isOwner && !isMaster) return await reply('❌ Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        data.mode = 'private';
        fs.writeJsonSync(DATA_FILE, data);
        global.botMode = 'private';

        await reply(`🔒 *Bᴏᴛ ɪs ɴᴏᴡ ᴘʀɪᴠᴀᴛᴇ!*\n\nOɴʟʏ ᴏᴡɴᴇʀ/sᴜᴅᴏ ᴄᴀɴ ᴜsᴇ ᴄᴏᴍᴍᴀɴᴅs.\n\n${settings.poweredBy}`);
    } catch (err) {
        console.error('Private error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});