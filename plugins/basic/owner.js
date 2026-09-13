const { cmd } = require('../../command.js');
const settings = require('../../settings.js');

cmd({
    pattern: 'owner',
    alias: ['creator'],
    category: 'basic',
    description: '💀 Sʜᴏᴡ ᴏᴡɴᴇʀ ᴄᴏɴᴛᴀᴄᴛ',
    react: '💀',
    type: 'public'
}, async (sock, msg, args, context) => {
    try {
        const { from } = context;
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.ownername}\nTEL;type=CELL;type=VOICE;waid=${settings.ownernumber}:${settings.ownernumber}\nEND:VCARD`;

        await context.sendMessage(from, {
            contacts: {
                displayName: settings.ownername,
                contacts: [{ vcard }]
            }
        });
    } catch (err) {
        console.error('Owner error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});