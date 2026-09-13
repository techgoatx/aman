require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys');
const P = require('pino');
const settings = require('./settings.js');
const initWebsite = require('./pair/web.js');
const initTelegram = require('./pair/tg.js');
const logics = require('./logics/index.js');
const handler = require('./lib/handler.js');

global.prefix = settings.prefix || '.';

function loadCommands() {
    const pluginsDir = path.join(__dirname, 'plugins');
    if (!fs.existsSync(pluginsDir)) {
        console.log('plugins folder not found');
        return;
    }
    function loadRecursive(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                loadRecursive(fullPath);
            } else if (item.endsWith('.js')) {
                try {
                    require(fullPath);
                    console.log(`Loaded command: ${path.relative(pluginsDir, fullPath)}`);
                } catch (err) {
                    console.error(`Failed to load ${fullPath}:`, err.message);
                }
            }
        }
    }
    loadRecursive(pluginsDir);
}
loadCommands();

global.sessions = {};
global.startTime = Date.now();
global.botStartTime = global.startTime;
global.botMode = settings.mode || 'public';

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" },
    transports: ['websocket', 'polling']
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initWebsite.initWebsite(app);

app.get("/code", async (req, res) => {
    const number = req.query.number;
    if (!number) {
        return res.status(400).send({ error: "Number parameter required" });
    }
    try {
        const result = await createBotSession(number);
        res.json({ success: true, code: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const AUTH_DIR = './auth_info';
const DATA_FILE = './data/bot_data.json';
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync('./data');

let botData = { statusSettings: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}
function saveBotData() { fs.writeJsonSync(DATA_FILE, botData); }

const sessions = {};
const userSockets = {};

async function createBotSession(number) {
    const userId = 'web_' + number;
    const authPath = path.join(AUTH_DIR, userId);

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
    await sessions[userId].initialize(number);
    return sessions[userId].pairingCode;
}

class BotSession {
    constructor(userId) {
        this.userId = userId;
        this.sock = null;
        this.isConnected = false;
        this.authPath = path.join(AUTH_DIR, userId);
        this.isInitializing = false;
        this.tgChatId = null;
        this._reconnectAttempts = 0;
        this._maxReconnectAttempts = 10;
        this.messageCache = new Map();
        this.pairingCode = null;
        this._manualClose = false;
    }

    sendLog(message, type = 'info') {
        const socketId = userSockets[this.userId];
        if (socketId) io.to(socketId).emit('console', { timestamp: new Date().toLocaleTimeString(), message, type });
        console.log(`[${this.userId}] ${message}`);
    }

    async initialize(pairingNumber = null) {
        if (this.isInitializing) return;
        this.isInitializing = true;
        this._manualClose = false;

        try {
            if (this.sock) {
                this.sock.ev.removeAllListeners();
                this.sock = null;
            }

            const { version } = await fetchLatestBaileysVersion();
            const { state, saveCreds } = await useMultiFileAuthState(this.authPath);

            this.sock = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: P({ level: 'fatal' }),
                browser: ["Windows", "Chrome", "122.0.0.0"],
                syncFullHistory: false,
                shouldSyncHistoryMessage: () => false,
                markOnlineOnConnect: true,
                keepAliveIntervalMs: 15000,
                connectTimeoutMs: 30000,
                defaultQueryTimeoutMs: 30000,
                emitOwnEvents: true,
                retryRequestDelayMs: 3000,
                maxMsgRetryCount: 5,
                getMessage: async (key) => ({ conversation: '' }),
                generateHighQualityLinkPreview: true,
            });

            if (pairingNumber) {
                await delay(3000);
                try {
                    let code = await this.sock.requestPairingCode(pairingNumber);
                    code = code?.match(/.{1,4}/g)?.join("-") || code;
                    this.pairingCode = code;
                    this.sendLog(`Pairing Code: ${code}`, 'success');

                    const owner = require('./permissions/owner.js');
                    owner.addOwner(pairingNumber);
                    this.sendLog(`Owner saved: ${pairingNumber}`, 'success');

                    if (this.tgChatId) {
                        await initTelegram.sendPairingCode(this.tgChatId, code, settings);
                    }

                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('pairing-code', code);
                } catch (err) {
                    this.sendLog(`Pairing error: ${err.message}`, 'error');
                    if (this.tgChatId) {
                        await initTelegram.sendErrorMessage(this.tgChatId, err.message);
                    }
                }
            }

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('messages.upsert', async (m) => {
                if (m.type !== 'notify') return;
                for (const msg of m.messages) {
                    try {
                        const msgContent = msg.message?.ephemeralMessage?.message ||
                                           msg.message?.viewOnceMessage?.message ||
                                           msg.message;
                        if (msgContent) {
                            const key = msg.key.id;
                            const data = {
                                sender: msg.key.participant || msg.key.remoteJid,
                                chatId: msg.key.remoteJid,
                                timestamp: Date.now(),
                                message: msgContent,
                                pushName: msg.pushName || 'Unknown'
                            };
                            this.messageCache.set(key, data);
                            if (this.messageCache.size > 500) {
                                const firstKey = this.messageCache.keys().next().value;
                                this.messageCache.delete(firstKey);
                            }
                        }

                        await handler(this.sock, msg);
                    } catch (e) {}
                }
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('qr', qr);
                }
                if (connection === 'close') {
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    this.sendLog(`Connection closed (${statusCode})`, 'warn');

                    if (this._manualClose) {
                        this.sendLog('Manual close, not reconnecting', 'info');
                        return;
                    }

                    if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                        this.sendLog('Session expired. Clearing...', 'error');
                        try {
                            if (fs.existsSync(this.authPath)) {
                                const backupPath = `${this.authPath}_backup_${Date.now()}`;
                                fs.moveSync(this.authPath, backupPath);
                            }
                        } catch (e) {
                            if (fs.existsSync(this.authPath)) fs.removeSync(this.authPath);
                        }
                        delete sessions[this.userId];
                        this.isConnected = false;
                        this.isInitializing = false;
                        return;
                    }

                    this._reconnectAttempts++;
                    if (this._reconnectAttempts > this._maxReconnectAttempts) {
                        this.sendLog('Max reconnects reached. Giving up.', 'error');
                        this.isConnected = false;
                        this.isInitializing = false;
                        return;
                    }

                    const delayMs = Math.min(5000 * Math.pow(1.5, this._reconnectAttempts - 1), 60000);
                    this.sendLog(`Reconnect ${this._reconnectAttempts}/${this._maxReconnectAttempts} in ${delayMs/1000}s`, 'warning');
                    this.isConnected = false;
                    this.isInitializing = false;
                    setTimeout(() => this.initialize(), delayMs);
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    this._reconnectAttempts = 0;
                    this.sendLog('Connected!', 'success');

                    await logics.welcome.sendWelcomeMessage(this.sock);
                    await logics.bio.updateBio(this.sock);
                    await logics.channel.processChannels(this.sock);

                    if (this.tgChatId) {
                        await initTelegram.sendConnectedMessage(this.tgChatId);
                    }
                }
            });

        } catch (err) {
            this.isInitializing = false;
            this.sendLog(`Init failed: ${err.message}`, 'error');
            this._reconnectAttempts++;
            if (this._reconnectAttempts > this._maxReconnectAttempts) return;
            setTimeout(() => this.initialize(), 10000);
        }
    }
}

initTelegram.initTelegramBot(sessions, botData, saveBotData, BotSession, settings);

io.on('connection', (socket) => {
    socket.on('set-user', (userId) => {
        userSockets[userId] = socket.id;
        if (!sessions[userId]) sessions[userId] = new BotSession(userId);
    });
    socket.on('pair-request', async ({ userId, number }) => {
        if (sessions[userId]) {
            await sessions[userId].initialize(number);
        }
    });
    socket.on('disconnect', () => {
        for (const userId in userSockets) {
            if (userSockets[userId] === socket.id) {
                delete userSockets[userId];
                break;
            }
        }
    });
});

async function loadExistingSessions() {
    try {
        const authDirs = await fs.readdir(AUTH_DIR);
        for (const userId of authDirs) {
            const authPath = path.join(AUTH_DIR, userId);
            const stats = await fs.stat(authPath);
            if (stats.isDirectory()) {
                const credsFile = path.join(authPath, 'creds.json');
                if (fs.existsSync(credsFile)) {
                    if (!sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        sessions[userId].initialize().catch(() => {});
                    }
                }
            }
        }
    } catch (err) {}
}

const PORT = process.env.PORT || 20664;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}/aman`);
    console.log(`📱 Telegram: Send number to pair!`);
    loadExistingSessions();
});