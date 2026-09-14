const antiBan = require('../antiBan.js');
const settings = require('../settings.js');
const { commands } = require('../command.js');
const fs = require('fs-extra');
const path = require('path');
const permissions = require('../permissions/index.js');
const fontManager = require('./fontManager.js');
const jarvis = require('../jarvis/index.js');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const prefix = global.prefix || settings.prefix || '.';
const cooldowns = new Map();
const COOLDOWN = 1500;
const processedMessages = new Set();

const DATA_FILE = path.join(__dirname, '../data/bot_data.json');

function loadBotData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return fs.readJsonSync(DATA_FILE);
        }
        return {};
    } catch (e) {
        return {};
    }
}

function isBanned(jid) {
    try {
        const botData = loadBotData();
        const bannedJids = botData.bannedJids || [];
        return bannedJids.some(b => jid.includes(b) || b.includes(jid));
    } catch (e) {
        return false;
    }
}

console.log(`Total commands registered: ${commands.length}`);

async function handler(sock, msg) {
    try {
        const msgId = msg.key.id;

        if (processedMessages.has(msgId)) {
            return;
        }

        let body = '';
        let quotedMsg = null;

        try {
            const msgContent = msg.message?.ephemeralMessage?.message ||
                               msg.message?.viewOnceMessage?.message ||
                               msg.message;
            if (!msgContent) return;
            body = msgContent.conversation ||
                   msgContent.extendedTextMessage?.text || '';
            quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        } catch (e) {
            return;
        }

        if (body) {
            console.log(`[${msg.key.remoteJid}] ${body}`);
        }

        const chatId = msg.key.remoteJid;
        const sender = msg.key.participant || chatId;

        if (body && fontManager.isJarvisMention(body)) {
            try {
                await jarvis.chat(sender, body, sock, msg);
            } catch (e) {
                console.error('[Jarvis] Error:', e.message);
            }
            return;
        }

        if (!body || !body.startsWith(prefix)) return;

        processedMessages.add(msgId);
        if (processedMessages.size > 500) processedMessages.clear();

        const rawArgs = body.slice(prefix.length).trim().split(/ +/);
        const rawCommandName = rawArgs.shift().toLowerCase();
        const commandName = fontManager.normalizeText(rawCommandName);
        const args = rawArgs.map(a => fontManager.normalizeText(a));

        if (isBanned(sender)) {
            return;
        }

        const command = commands.find(cmd => {
            if (cmd.pattern && Array.isArray(cmd.pattern) && cmd.pattern.includes(commandName)) return true;
            if (cmd.pattern && typeof cmd.pattern === 'string' && cmd.pattern === commandName) return true;
            if (cmd.alias && Array.isArray(cmd.alias) && cmd.alias.includes(commandName)) return true;
            if (cmd.alias && typeof cmd.alias === 'string' && cmd.alias === commandName) return true;
            return false;
        });

        if (!command) {
            return;
        }

        const botData = loadBotData();
        const botMode = botData.mode || 'public';

        const isMasterUser = permissions.master.isMaster(sender);
        const isOwnerUser = await permissions.owner.isOwner(sender, sock, chatId);
        const isSudoUser = permissions.sudo.isSudo(sender);
        const isAdminUser = await permissions.admin.isAdminOrOwner(sock, sender, chatId);

        const permission = await permissions.checkPermission(sender, command, botMode, isMasterUser, isOwnerUser, isSudoUser, isAdminUser);

        if (!permission.allowed) {
            if (botMode === 'self' || botMode === 'private') {
                return;
            }
            if (botMode === 'public') {
                await antiBan.queueMessage(sock, chatId, {
                    text: `❌ Access Denied!\n${permission.reason || 'Not allowed'}`
                }, { quoted: msg });
            }
            return;
        }

        const cooldownKey = `${sender}_${commandName}`;
        const now = Date.now();
        if (cooldowns.has(cooldownKey)) {
            const last = cooldowns.get(cooldownKey);
            if (now - last < COOLDOWN) {
                const remaining = Math.ceil((COOLDOWN - (now - last)) / 1000);
                await antiBan.queueMessage(sock, chatId, {
                    text: `⏳ Slow down!\nWait ${remaining}s before using \`${prefix}${commandName}\` again.`
                }, { quoted: msg });
                return;
            }
        }
        cooldowns.set(cooldownKey, now);

        if (command.react) {
            try {
                await sock.sendMessage(chatId, {
                    react: { text: command.react, key: msg.key }
                });
            } catch (e) {}
        }

        await delay(1000);

        try {
            await sock.sendPresenceUpdate('composing', chatId);
        } catch (e) {}

        const context = {
            from: chatId,
            quoted: msg,
            sender: sender,
            args: args,
            isMaster: isMasterUser,
            isOwner: isOwnerUser,
            isSudo: isSudoUser,
            isAdmin: isAdminUser,
            userRole: await permissions.getUserRole(sender, sock, chatId),
            userRoleEmoji: await permissions.getUserRoleEmoji(sender, sock, chatId),
            reply: async (text) => {
                await antiBan.queueMessage(sock, chatId, { text });
            },
            sendMessage: async (jid, content) => {
                await antiBan.queueMessage(sock, jid, content);
            }
        };

        try {
            await command.execute(sock, msg, args, context);
        } catch (err) {
            console.error(`Command ${commandName} error:`, err.message);
            await antiBan.queueMessage(sock, chatId, {
                text: `❌ Error: ${err.message || 'Command failed'}`
            }, { quoted: msg });
        }

    } catch (err) {
        console.error('Handler error:', err.message);
    }
}

module.exports = handler;