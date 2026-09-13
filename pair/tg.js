const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs-extra');

const chatCooldowns = new Map();
const COOLDOWN_MS = 30 * 1000;

let tgBot = null;

function initTelegramBot(sessions, botData, saveBotData, BotSession, settings) {
    const tgToken = process.env.TELEGRAM_TOKEN || settings.telegramToken || '';
    if (!tgToken) {
        console.log('No Telegram token found. Skipping Telegram bot.');
        return null;
    }

    try {
        tgBot = new TelegramBot(tgToken, {
            polling: {
                interval: 3000,
                autoStart: true,
                params: { timeout: 10 }
            }
        });
    } catch (e) {
        console.log('Telegram bot init failed:', e.message);
        return null;
    }

    tgBot.on('polling_error', (err) => {});

    tgBot.on('callback_query', async (callbackQuery) => {
        const data = callbackQuery.data;
        const chatId = callbackQuery.message.chat.id;

        if (data.startsWith('copy_')) {
            const code = data.replace('copy_', '');
            try {
                await tgBot.answerCallbackQuery(callbackQuery.id, {
                    text: `✅ Code Copied: ${code}`,
                    show_alert: false
                });
                await tgBot.sendMessage(chatId, `📋 *Your Pairing Code:*\n\n\`${code}\`\n\n👆 Tap to copy`, {
                    parse_mode: 'Markdown'
                });
            } catch (e) {}
        }
    });

    tgBot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '/start') {
            await tgBot.sendMessage(chatId, `🤖 *${settings.botname || 'AMAN MD'}* BOT\n\n📱 Send your WhatsApp number with country code without '+', e.g., 923xxxxxxxxx`, {
                parse_mode: 'Markdown'
            });
            return;
        }

        if (/^\d+$/.test(text) && text.length >= 10) {
            const now = Date.now();
            const last = chatCooldowns.get(chatId) || 0;
            const remaining = COOLDOWN_MS - (now - last);

            if (remaining > 0) {
                const seconds = Math.ceil(remaining / 1000);
                await tgBot.sendMessage(chatId, `⏳ *Please wait ${seconds}s* before requesting a new code.`, {
                    parse_mode: 'Markdown'
                });
                return;
            }

            chatCooldowns.set(chatId, now);

            const userId = chatId.toString();
            const authPath = path.join('./auth_info', userId);

            if (fs.existsSync(authPath)) {
                fs.removeSync(authPath);
            }
            if (sessions[userId]) {
                if (sessions[userId].sock) {
                    sessions[userId].sock.ev.removeAllListeners();
                }
                delete sessions[userId];
            }

            sessions[userId] = new BotSession(userId);
            if (!botData.statusSettings[userId]) {
                botData.statusSettings[userId] = { autoStatus: false };
                saveBotData();
            }
            await tgBot.sendMessage(chatId, `⏳ Requesting Pairing Code for ${text}...`);
            sessions[userId].tgChatId = chatId;
            sessions[userId].initialize(text);
        }
    });

    console.log('Telegram bot started');
    return tgBot;
}

function getTelegramBot() {
    return tgBot;
}

async function sendPairingCode(chatId, code, settings) {
    if (!tgBot || !chatId) return;
    try {
        await tgBot.sendMessage(chatId,
            `🔐 *Pairing Code for ${settings.botname}*\n\n` +
            `📱 *Code:* \`${code}\`\n\n` +
            `👆 Tap the code above to copy it\n\n` +
            `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${settings.ownername}*`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: `📋 Copy Code: ${code}`,
                                callback_data: `copy_${code}`
                            }
                        ]
                    ]
                }
            }
        );
    } catch (e) {
        console.error('TG send error:', e.message);
    }
}

async function sendConnectedMessage(chatId) {
    if (!tgBot || !chatId) return;
    try {
        await tgBot.sendMessage(chatId, "✅ WhatsApp Connected!");
    } catch (e) {}
}

async function sendErrorMessage(chatId, error) {
    if (!tgBot || !chatId) return;
    try {
        await tgBot.sendMessage(chatId, `Pairing Error: ${error}`);
    } catch (e) {}
}

module.exports = {
    initTelegramBot,
    getTelegramBot,
    sendPairingCode,
    sendConnectedMessage,
    sendErrorMessage
};