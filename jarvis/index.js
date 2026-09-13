const { commands } = require('../command.js');
const antiBan = require('../antiBan.js');
const fontManager = require('../lib/fontManager.js');

class Jarvis {
    async chat(userId, message, sock, msg) {
        try {
            const sender = msg.key.participant || msg.key.remoteJid;
            const from = msg.key.remoteJid;

            if (!fontManager.isJarvisMention(message)) {
                return null;
            }

            let cleanMsg = fontManager.extractJarvisCommand(message);
            if (!cleanMsg) {
                return null;
            }

            let foundCommand = null;
            let foundArgs = [];

            const words = cleanMsg.toLowerCase().split(/\s+/);

            for (const word of words) {
                for (const cmd of commands) {
                    const patterns = Array.isArray(cmd.pattern) ? cmd.pattern : [cmd.pattern];
                    const aliases = Array.isArray(cmd.alias) ? cmd.alias : (cmd.alias ? [cmd.alias] : []);
                    const allNames = [...patterns, ...aliases].filter(Boolean);

                    for (const name of allNames) {
                        if (word === name) {
                            foundCommand = name;
                            const argsMatch = cleanMsg.match(/\d+/g);
                            if (argsMatch) {
                                foundArgs = argsMatch;
                            }
                            break;
                        }
                    }
                    if (foundCommand) break;
                }
                if (foundCommand) break;
            }

            if (!foundCommand) {
                return null;
            }

            const command = commands.find(cmd => {
                const patterns = Array.isArray(cmd.pattern) ? cmd.pattern : [cmd.pattern];
                const aliases = Array.isArray(cmd.alias) ? cmd.alias : (cmd.alias ? [cmd.alias] : []);
                const allNames = [...patterns, ...aliases].filter(Boolean);
                return allNames.includes(foundCommand);
            });

            if (!command) {
                return null;
            }

            const processingMsg = await antiBan.queueMessage(sock, from, {
                text: `🤖 *Jᴀʀᴠɪs :* Oᴋ ʙᴏss , ᴘʀᴏᴄᴇssɪɴɢ *${foundCommand}* ...`
            });

            const prefix = global.prefix || '.';
            const fakeMsg = {
                ...msg,
                message: {
                    ...msg.message,
                    conversation: `${prefix}${foundCommand} ${foundArgs.join(' ')}`.trim(),
                    extendedTextMessage: {
                        ...msg.message?.extendedTextMessage,
                        text: `${prefix}${foundCommand} ${foundArgs.join(' ')}`.trim()
                    }
                }
            };

            const handler = require('../lib/handler.js');
            await handler(sock, fakeMsg);

            return null;

        } catch (err) {
            console.error('[Jarvis] Error:', err.message);
            return null;
        }
    }
}

module.exports = new Jarvis();