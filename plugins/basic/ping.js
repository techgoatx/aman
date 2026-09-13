const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'ping',
    alias: ['pong', 'speed'],
    category: 'basic',
    description: '⚡ Cʜᴇᴄᴋ ʙᴏᴛ ʟᴀᴛᴇɴᴄʏ',
    react: '⚡',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from } = context;
        const start = Date.now();
        const ping = (Date.now() - start).toFixed(2);
        const pingText = `📡 ᴘᴏɴɢ! *_${ping}ms_*\n\n${settings.poweredBy}`;

        await context.sendMessage(from, {
            text: pingText,
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
        console.error('Ping error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});