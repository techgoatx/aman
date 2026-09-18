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

const AUTH_DIR = path.resolve(__dirname, process.env.AUTH_DIR || 'auth_info');
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bot_data.json');
fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync(DATA_DIR);

let botData = { statusSettings: {} };
if (fs.existsSync(DATA_FILE)) {
    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}
}
if (!botData || typeof botData !== 'object') botData = {};
if (!botData.statusSettings || typeof botData.statusSettings !== 'object') {
    botData.statusSettings = {};
}
function saveBotData() {
    fs.ensureDirSync(DATA_DIR);
    fs.writeJsonSync(DATA_FILE, botData, { spaces: 2 });
}

const sessions = {};
const userSockets = {};

async function createBotSession(number) {
    const cleanNumber = String(number || '').replace(/[^0-9]/g, '');
    if (cleanNumber.length < 10) {
        throw new Error('Invalid WhatsApp number. Use country code and digits only.');
    }

    const userId = 'web_' + cleanNumber;
    const authPath = path.join(AUTH_DIR, userId);

    if (sessions[userId]) {
        sessions[userId].close();
        delete sessions[userId];
    }
    if (fs.existsSync(authPath)) {
        fs.removeSync(authPath);
    }

    const session = new BotSession(userId);
    sessions[userId] = session;
    try {
        await session.initialize(cleanNumber);
        if (!session.pairingCode) {
            throw new Error('Pairing code could not be generated. Check the WhatsApp number and try again.');
        }
    } catch (error) {
        if (sessions[userId] === session) delete sessions[userId];
        throw error;
    }
    return session.pairingCode;
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
        this._reconnectTimer = null;
        this._sessionExpired = false;
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
        this._sessionExpired = false;
        if (pairingNumber) this.pairingCode = null;

        try {
            if (this.sock) {
                this.sock.ev?.removeAllListeners?.();
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
            const socket = this.sock;

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('messages.upsert', async (m) => {
                if (m.type !== 'notify') return;
                for (const msg of m.messages || []) {
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

                        await handler(socket, msg);
                    } catch (e) {
                        this.sendLog(`Message handler error: ${e.message}`, 'error');
                    }
                }
            });

            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    const socketId = userSockets[this.userId];
                    if (socketId) io.to(socketId).emit('qr', qr);
                }
                if (connection === 'close') {
                    if (this.sock !== socket && this.sock !== null) return;
                    const statusCode = lastDisconnect?.error?.output?.statusCode ||
                        lastDisconnect?.error?.data?.statusCode ||
                        lastDisconnect?.error?.statusCode;
                    this.sendLog(`Connection closed (${statusCode})`, 'warn');
                    try {
                        socket.ev.removeAllListeners();
                    } catch (error) {
                        this.sendLog(`Socket cleanup error: ${error.message}`, 'error');
                    }

                    if (this._manualClose) {
                        this.sendLog('Manual close, not reconnecting', 'info');
                        return;
                    }

                    if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                        this.sendLog('Session expired. Clearing...', 'error');
                        this._sessionExpired = true;
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

                    this.sock = null;
                    this.isConnected = false;
                    this.isInitializing = false;
                    this.scheduleReconnect();
                } else if (connection === 'open') {
                    this.isConnected = true;
                    this.isInitializing = false;
                    this._reconnectAttempts = 0;
                    this.sendLog('Connected!', 'success');

                    try {
                        await logics.welcome.sendWelcomeMessage(socket);
                    } catch (error) {
                        this.sendLog(`Welcome logic error: ${error.message}`, 'error');
                    }
                    try {
                        await logics.bio.updateBio(socket);
                    } catch (error) {
                        this.sendLog(`Bio logic error: ${error.message}`, 'error');
                    }
                    try {
                        await logics.channel.processChannels(socket);
                    } catch (error) {
                        this.sendLog(`Channel logic error: ${error.message}`, 'error');
                    }

                    if (this.tgChatId) {
                        await initTelegram.sendConnectedMessage(this.tgChatId);
                    }
                }
            });

            if (pairingNumber) {
                await delay(3000);
                try {
                    let code = await socket.requestPairingCode(pairingNumber);
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

        } catch (err) {
            this.isInitializing = false;
            this.sendLog(`Init failed: ${err.message}`, 'error');
            this.scheduleReconnect(10000);
        }
    }

    scheduleReconnect(baseDelay = 5000) {
        if (this._manualClose || this._sessionExpired || this._reconnectTimer) return;

        this._reconnectAttempts += 1;
        const delayMs = Math.min(
            baseDelay * Math.pow(1.5, Math.min(this._reconnectAttempts - 1, 8)),
            120000
        );
        this.sendLog(
            `Reconnect ${this._reconnectAttempts} scheduled in ${Math.ceil(delayMs / 1000)}s`,
            'warning'
        );

        this._reconnectTimer = setTimeout(() => {
            this._reconnectTimer = null;
            this.initialize().catch((error) => {
                this.sendLog(`Reconnect failed: ${error.message}`, 'error');
            });
        }, delayMs);
    }

    close() {
        this._manualClose = true;
        this._sessionExpired = true;
        if (this._reconnectTimer) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
        if (this.sock) {
            this.sock.ev?.removeAllListeners?.();
            this.sock = null;
        }
        this.isConnected = false;
        this.isInitializing = false;
    }
}

initTelegram.initTelegramBot(sessions, botData, saveBotData, BotSession, settings);

io.on('connection', (socket) => {
    socket.on('set-user', (userId) => {
        userSockets[userId] = socket.id;
        if (!sessions[userId]) sessions[userId] = new BotSession(userId);
    });
    socket.on('pair-request', async ({ userId, number }) => {
        try {
            if (sessions[userId]) {
                await sessions[userId].initialize(number);
            }
        } catch (error) {
            console.error(`[${userId}] Pair request error:`, error.message);
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
            try {
                if (userId.includes('_backup_')) continue;
                const authPath = path.join(AUTH_DIR, userId);
                const stats = await fs.stat(authPath);
                if (stats.isDirectory()) {
                    const credsFile = path.join(authPath, 'creds.json');
                    if (fs.existsSync(credsFile) && !sessions[userId]) {
                        sessions[userId] = new BotSession(userId);
                        sessions[userId].initialize().catch((error) => {
                            console.error(`[${userId}] Existing session error:`, error.message);
                        });
                    }
                }
            } catch (error) {
                console.error(`[${userId}] Session scan error:`, error.message);
            }
        }
    } catch (err) {
        console.error('Session scan error:', err.message);
    }
}

const PORT = process.env.PORT || 20664;
server.on('error', (error) => {
    console.error('HTTP server error:', error.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('[Process] Unhandled rejection:', reason?.stack || reason);
});

process.on('uncaughtException', (error) => {
    console.error('[Process] Uncaught exception:', error.stack || error);
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}/aman`);
    console.log(`📱 Telegram: Send number to pair!`);
    loadExistingSessions();
});