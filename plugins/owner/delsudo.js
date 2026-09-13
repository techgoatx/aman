const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const sudo = require('../../permissions/sudo.js');

cmd({
    pattern: 'delsudo',
    alias: ['removesudo'],
    category: 'owner',
    description: '🗑️ Rᴇᴍᴏᴠᴇ ᴀ sᴜᴅᴏ ᴜsᴇʀ',
    react: '🗑️',
    type: 'owner'
}, async (sock, msg, args, context) => {
    try {
        const { isOwner, isMaster, reply } = context;
        if (!isOwner && !isMaster) return await reply('❌ Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        if (!args || args.length === 0) {
            return await reply('❌ Pʀᴏᴠɪᴅᴇ ᴀ ɴᴜᴍʙᴇʀ: .delsudo 923xxxxxxxxx');
        }

        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) {
            return await reply('❌ Iɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ.');
        }

        const removed = sudo.removeSudo(number);
        if (removed) {
            await reply(`✅ *Sᴜᴅᴏ Rᴇᴍᴏᴠᴇᴅ!*\n\n👑 ${number}\n\n${settings.poweredBy}`);
        } else {
            await reply(`❌ Nᴏᴛ ᴀ sᴜᴅᴏ ᴜsᴇʀ.`);
        }
    } catch (err) {
        console.error('DelSudo error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});