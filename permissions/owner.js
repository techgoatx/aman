const fs = require('fs-extra');
const path = require('path');
const settings = require('../settings.js');
const {
    configuredNumberMatches,
    findParticipant,
    participantHasConfiguredNumber,
    phoneNumber
} = require('./identity.js');

const DATA_FILE = path.join(__dirname, '../data/bot_data.json');

function getOwnerList() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readJsonSync(DATA_FILE);
            return Array.isArray(data.ownerJids) ? data.ownerJids : [];
        }
    } catch (e) {
        console.error('[Owner] Could not read owner list:', e.message);
    }
    return [];
}

async function isOwner(senderId, sock = null, chatId = null) {
    if (!senderId) return false;

    const configuredNumbers = [settings.ownernumber, ...getOwnerList()].filter(Boolean);
    if (configuredNumberMatches(senderId, configuredNumbers)) return true;

    const participant = await findParticipant(sock, chatId, senderId);
    return participantHasConfiguredNumber(participant, configuredNumbers);
}

function addOwner(jid) {
    try {
        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        if (!Array.isArray(data.ownerJids)) data.ownerJids = [];
        const num = phoneNumber(jid);
        if (!num) return false;
        if (!data.ownerJids.includes(num)) {
            data.ownerJids.push(num);
            fs.writeJsonSync(DATA_FILE, data);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function removeOwner(jid) {
    try {
        if (fs.existsSync(DATA_FILE)) {
            let data = fs.readJsonSync(DATA_FILE);
            if (!Array.isArray(data.ownerJids)) data.ownerJids = [];
            const num = phoneNumber(jid);
            if (!num) return false;
            const before = data.ownerJids.length;
            data.ownerJids = data.ownerJids.filter(o => {
                const oNum = phoneNumber(o);
                return oNum !== num;
            });
            fs.writeJsonSync(DATA_FILE, data);
            return data.ownerJids.length !== before;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function getOwnerJids() {
    return getOwnerList().map(o => o + '@s.whatsapp.net');
}

module.exports = {
    isOwner,
    addOwner,
    removeOwner,
    getOwnerList,
    getOwnerJids
};