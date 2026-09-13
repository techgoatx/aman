const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const sudo = require('../../permissions/sudo.js');

cmd({
    pattern: 'sudolist',
    alias: ['sudolist'],
    category: 'owner',
    description: '📋 Lɪsᴛ ᴀʟʟ sᴜᴅᴏ ᴜsᴇʀs',
    react: '📋',
    type: 'owner'
}, async (sock, msg, args, context) => {
    try {
        const { reply } = context;
        const list = sudo.getSudoList();

        if (!list || list.length === 0) {
            return await reply('📋 Nᴏ sᴜᴅᴏ ᴜsᴇʀs ғᴏᴜɴᴅ.');
        }

        let text = `╭┈───〔 *${settings.botname}* 〕──┈─⊷\n`;
        text += `│ *👑 Sᴜᴅᴏ Usᴇʀs*\n`;
        text += `│\n`;
        for (let i = 0; i < list.length; i++) {
            text += `│ *${i + 1}.* ${list[i]}\n`;
        }
        text += `╰────────────────┈─⊷\n\n`;
        text += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ “ ${settings.ownername} ”*`;
        await reply(text);
    } catch (err) {
        console.error('SudoList error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});