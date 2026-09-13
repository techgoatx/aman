const antiBan = require('../antiBan.js');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');
const settings = require('../settings.js');

let hasSentWelcomeMessage = false;

async function sendWelcomeMessage(sock) {
    if (hasSentWelcomeMessage) {
        return;
    }
    try {
        const botNumber = jidNormalizedUser(sock.user.id);
        const welcomeText = `🤖 *Jᴀʀᴠɪs :* Hɪ ʙᴏss ...\n\n> Tʜᴀɴᴋs ғᴏʀ ᴜsɪɴɢ *${settings.botname}*\n\n🤖 *Jᴀʀᴠɪs :*  ᴄᴏᴍᴍᴀɴᴅ ᴍᴇ ʟɪᴋᴇ ...\n\n> Hᴇʏ ᴊᴀʀᴠɪs ᴍᴇɴᴜ ᴅᴏ ...`;

        await antiBan.queueMessage(sock, botNumber, {
            text: welcomeText
        });

        hasSentWelcomeMessage = true;
        console.log('[Logic] Welcome message sent');
    } catch (e) {
        console.error('[Logic] Welcome message error:', e.message);
    }
}

function resetWelcomeFlag() {
    hasSentWelcomeMessage = false;
}

module.exports = { sendWelcomeMessage, resetWelcomeFlag };