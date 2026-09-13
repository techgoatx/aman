const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const permissions = require('../../permissions/index.js');
const fs = require('fs-extra');
const path = require('path');

function getUptime() {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function getTotalCommands() {
    const { commands } = require('../../command.js');
    return commands.length;
}

cmd({
    pattern: 'menu',
    alias: ['m'],
    category: 'basic',
    description: '📋 Sʜᴏᴡ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅs ᴍᴇɴᴜ',
    react: '📋',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from, sender } = context;

        const uptime = getUptime();
        const totalCommands = getTotalCommands();
        const prefix = settings.prefix;
        const mode = global.botMode || settings.mode;
        const version = settings.version;
        const role = permissions.getUserRoleEmoji(sender);

        let menuText = `╭┈───〔 *${settings.botname}* 〕──┈─⊷\n`;
        menuText += `│ *• 👑 ᴏᴡɴᴇʀ:* ${settings.ownername}\n`;
        menuText += `│ *• 📄 ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs:* ${totalCommands}\n`;
        menuText += `│ *• 🚀 ʀᴜɴᴛɪᴍᴇ:* ${uptime}\n`;
        menuText += `│ *• 📝 ᴘʀᴇғɪx:* ${prefix}\n`;
        menuText += `│ *• 📢 ᴍᴏᴅᴇ:* ${mode}\n`;
        menuText += `│ *• 🤖 ᴠᴇʀsɪᴏɴ:* ${version}\n`;
        menuText += `│ *• 🎭 ʀᴏʟᴇ:* ${role}\n`;
        menuText += `╰────────────────┈─⊷\n\n`;

        menuText += `╭──〔 ʙᴀsɪᴄ ᴄᴏᴍᴍᴀɴᴅs 〕───⊷\n`;
        menuText += `*_┋  ● ᴀʟɪᴠᴇ_*\n`;
        menuText += `*_┋  ● ᴘɪɴɢ_*\n`;
        menuText += `*_┋  ● ᴍᴇɴᴜ_*\n`;
        menuText += `*_┋  ● ᴏᴡɴᴇʀ_*\n`;
        menuText += `*_┋  ● ʀᴜɴᴛɪᴍᴇ_*\n`;
        menuText += `*_┋  ● ʜᴇʟᴘ_*\n`;
        menuText += `╰───────────────────⊷\n\n`;

        menuText += `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ “ ${settings.ownername} ”*`;

        const imgPath = path.join(__dirname, '../../assets/aman.jpg');
        if (fs.existsSync(imgPath)) {
            await context.sendMessage(from, {
                image: fs.readFileSync(imgPath),
                caption: menuText,
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
        } else {
            await context.reply(menuText);
        }

    } catch (err) {
        console.error('Menu error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});