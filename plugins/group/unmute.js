const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'unmute',
    category: 'group',
    description: '🔊 Uɴᴍᴜᴛᴇ ɢʀᴏᴜᴘ (Aᴅᴍɪɴ ᴏɴʟʏ)',
    react: '🔊',
    type: 'admin'
}, async (sock, msg, args, context) => {
    try {
        const { from, isAdmin, isOwner, isMaster, reply } = context;
        if (!from.endsWith('@g.us')) return await reply('❌ Tʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ɪɴ ɢʀᴏᴜᴘs.');
        if (!isAdmin && !isOwner && !isMaster) return await reply('❌ Oɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        try {
            await sock.groupSettingUpdate(from, 'not_announcement');
            await reply(`🔊 *Gʀᴏᴜᴘ Uɴᴍᴜᴛᴇᴅ!*\n\nEᴠᴇʀʏᴏɴᴇ ᴄᴀɴ sᴇɴᴅ ᴍᴇssᴀɢᴇs.\n\n${settings.poweredBy}`);
        } catch (e) {
            await reply(`❌ Fᴀɪʟᴇᴅ ᴛᴏ ᴜɴᴍᴜᴛᴇ: ${e.message}`);
        }
    } catch (err) {
        console.error('Unmute error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});