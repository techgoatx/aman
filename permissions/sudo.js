const fs = require('fs-extra');
const path = require('path');
const { configuredNumberMatches, findParticipant, participantHasConfiguredNumber, phoneNumber } = require('./identity.js');

const DATA_FILE = path.join(__dirname, '../data/bot_data.json');

function getSudoList() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readJsonSync(DATA_FILE);
            return Array.isArray(data.sudoJids) ? data.sudoJids : [];
        }
    } catch (e) {
        console.error('[Sudo] Could not read sudo list:', e.message);
    }
    return [];
}

async function isSudo(senderId, sock = null, chatId = null) {
    const sudoList = getSudoList();
    if (sudoList.length === 0) return false;

    if (configuredNumberMatches(senderId, sudoList)) return true;

    const participant = await findParticipant(sock, chatId, senderId);
    return participantHasConfiguredNumber(participant, sudoList);
}

function addSudo(jid) {
    try {
        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        if (!Array.isArray(data.sudoJids)) data.sudoJids = [];
        const num = phoneNumber(jid);
        if (!num) return false;
        if (!data.sudoJids.includes(num)) {
            data.sudoJids.push(num);
            fs.writeJsonSync(DATA_FILE, data);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function removeSudo(jid) {
    try {
        if (fs.existsSync(DATA_FILE)) {
            let data = fs.readJsonSync(DATA_FILE);
            if (!Array.isArray(data.sudoJids)) data.sudoJids = [];
            const num = phoneNumber(jid);
            if (!num) return false;
            const before = data.sudoJids.length;
            data.sudoJids = data.sudoJids.filter(s => {
                const sNum = phoneNumber(s);
                return sNum !== num;
            });
            fs.writeJsonSync(DATA_FILE, data);
            return data.sudoJids.length !== before;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function getSudoJids() {
    return getSudoList().map(s => s + '@s.whatsapp.net');
}

module.exports = {
    isSudo,
    addSudo,
    removeSudo,
    getSudoList,
    getSudoJids
};