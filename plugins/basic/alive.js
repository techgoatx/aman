const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'alive',
    alias: ['live'],
    category: 'basic',
    description: '🤖 Cʜᴇᴄᴋ ʙᴏᴛ sᴛᴀᴛᴜs',
    react: '🤖',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from } = context;
        const aliveText = `_*🤖 sᴛᴀᴛᴜs :* ᴏɴʟɪɴᴇ & ᴀᴄᴛɪᴠᴇ_\n\n${settings.poweredBy}`;

        await context.sendMessage(from, {
            text: aliveText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: settings.channelJid,
                    newsletterName: settings.channelName,
                    serverMessageId: 143
                }
            }
        });
    } catch (err) {
        console.error('Alive error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});