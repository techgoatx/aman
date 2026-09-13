const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/bot_data.json');

cmd({
    pattern: 'mute',
    category: 'group',
    description: '🔇 Mᴜᴛᴇ ɢʀᴏᴜᴘ (Aᴅᴍɪɴ ᴏɴʟʏ)',
    react: '🔇',
    type: 'admin'
}, async (sock, msg, args, context) => {
    try {
        const { from, isAdmin, isOwner, isMaster, reply } = context;
        if (!from.endsWith('@g.us')) return await reply('❌ Tʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ɪɴ ɢʀᴏᴜᴘs.');
        if (!isAdmin && !isOwner && !isMaster) return await reply('❌ Oɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        try {
            await sock.groupSettingUpdate(from, 'announcement');
            await reply(`🔇 *Gʀᴏᴜᴘ Mᴜᴛᴇᴅ!*\n\nOɴʟʏ ᴀᴅᴍɪɴs ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs.\n\n${settings.poweredBy}`);
        } catch (e) {
            await reply(`❌ Fᴀɪʟᴇᴅ ᴛᴏ ᴍᴜᴛᴇ: ${e.message}`);
        }
    } catch (err) {
        console.error('Mute error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});