const { cmd } = require('../../command.js');
const settings = require('../../settings.js');
const sudo = require('../../permissions/sudo.js');

cmd({
    pattern: 'sudo',
    alias: ['addsudo'],
    category: 'owner',
    description: '👑 Aᴅᴅ ᴀ sᴜᴅᴏ ᴜsᴇʀ',
    react: '👑',
    type: 'owner'
}, async (sock, msg, args, context) => {
    try {
        const { isOwner, isMaster, reply } = context;
        if (!isOwner && !isMaster) return await reply('❌ Oɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.');

        if (!args || args.length === 0) {
            return await reply('❌ Pʀᴏᴠɪᴅᴇ ᴀ ɴᴜᴍʙᴇʀ: .sudo 923xxxxxxxxx');
        }

        const number = args[0].replace(/[^0-9]/g, '');
        if (!number || number.length < 10) {
            return await reply('❌ Iɴᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ.');
        }

        const added = sudo.addSudo(number);
        if (added) {
            await reply(`✅ *Sᴜᴅᴏ Aᴅᴅᴇᴅ!*\n\n👑 ${number}\n\n${settings.poweredBy}`);
        } else {
            await reply(`❌ Aʟʀᴇᴀᴅʏ ᴀ sᴜᴅᴏ ᴜsᴇʀ.`);
        }
    } catch (err) {
        console.error('Sudo error:', err.message);
        await context.reply(`❌ ${err.message}`);
    }
});