const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/bot_data.json');

cmd({
    pattern: 'public',
    category: 'owner',
    description: '🌐 Sᴇᴛ ʙᴏᴛ ᴛᴏ ᴘᴜʙʟɪᴄ ᴍᴏᴅᴇ',
    react: '🌐',
    type: 'owner'
}, async (sock, msg, args, context) => {
    try {
        const { isOwner, isMaster, reply } = context;
        if (!isOwner && !isMaster) return await reply('❌ Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        data.mode = 'public';
        fs.writeJsonSync(DATA_FILE, data);
        global.botMode = 'public';

        await reply(`🌐 *Bᴏᴛ ɪs ɴᴏᴡ ᴘᴜʙʟɪᴄ!*\n\nEᴠᴇʀʏᴏɴᴇ ᴄᴀɴ ᴜsᴇ ᴄᴏᴍᴍᴀɴᴅs.\n\n${settings.poweredBy}`);
    } catch (err) {
        console.error('Public error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});