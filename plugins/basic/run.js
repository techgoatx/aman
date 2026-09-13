const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'run',
    alias: ['runtime', 'uptime'],
    category: 'basic',
    description: '🚀 Cʜᴇᴄᴋ ʙᴏᴛ ʀᴜɴᴛɪᴍᴇ',
    react: '🚀',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from } = context;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let str;
        if (days > 0) str = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        else if (hours > 0) str = `${hours}h ${minutes}m ${seconds}s`;
        else if (minutes > 0) str = `${minutes}m ${seconds}s`;
        else str = `${seconds}s`;

        const text = `*🚀 Rᴜɴᴛɪᴍᴇ!*\n⏱️ ${str}\n\n${settings.poweredBy}`;

        await context.sendMessage(from, {
            text: text,
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
        console.error('Run error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});