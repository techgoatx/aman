const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'test',
    category: 'master',
    description: '🧪 Tᴇsᴛ ᴄᴏᴍᴍᴀɴᴅ (Mᴀsᴛᴇʀ Oɴʟʏ)',
    react: '🧪',
    type: 'master',
    secret: true
}, async (sock, msg, args, context) => {
    try {
        const { isMaster, reply } = context;
        if (!isMaster) return;

        await reply(`🧪 *Tᴇsᴛ Pᴀss!*\n\n✅ Bᴏᴛ ɪs ᴡᴏʀᴋɪɴɢ ᴘᴇʀғᴇᴄᴛʟʏ.\n\n${settings.poweredBy}`);
    } catch (err) {
        console.error('Test error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});