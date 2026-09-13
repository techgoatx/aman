const fs = require('fs-extra');
const path = require('path');
const settings = require('../settings.js');

const DATA_FILE = path.join(__dirname, '../data/bot_data.json');

function getOwnerList() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readJsonSync(DATA_FILE);
            return data.ownerJids || [];
        }
    } catch (e) {}
    return [];
}

async function isOwner(senderId, sock = null, chatId = null) {
    const ownerNumber = settings.ownernumber || '';
    const ownerNumberClean = ownerNumber.replace(/[^0-9]/g, '');
    const ownerJid = ownerNumberClean + '@s.whatsapp.net';

    if (senderId === ownerJid) return true;

    const senderIdClean = senderId.split(':')[0].split('@')[0];
    const senderLidNumeric = senderId.includes('@lid') ? senderId.split('@')[0].split(':')[0] : '';

    if (senderIdClean === ownerNumberClean) return true;

    const ownerList = getOwnerList();
    for (const o of ownerList) {
        const oClean = o.replace(/[^0-9]/g, '');
        if (senderIdClean === oClean || senderId.includes(oClean)) return true;
    }

    if (sock && chatId && chatId.endsWith('@g.us') && senderId.includes('@lid')) {
        try {
            const botLid = sock.user?.lid || '';
            const botLidNumeric = botLid.includes(':') ? botLid.split(':')[0] : (botLid.includes('@') ? botLid.split('@')[0] : botLid);

            if (senderLidNumeric && botLidNumeric && senderLidNumeric === botLidNumeric) return true;

            const metadata = await sock.groupMetadata(chatId);
            const participants = metadata.participants || [];
            const participant = participants.find(p => {
                const pLid = p.lid || '';
                const pLidNumeric = pLid.includes(':') ? pLid.split(':')[0] : (pLid.includes('@') ? pLid.split('@')[0] : pLid);
                return p.lid === senderId || p.id === senderId || pLidNumeric === senderLidNumeric;
            });

            if (participant) {
                const participantId = participant.id || '';
                const participantIdClean = participantId.split(':')[0].split('@')[0];
                if (participantId === ownerJid || participantIdClean === ownerNumberClean) return true;
            }
        } catch (e) {}
    }

    if (senderId.includes(ownerNumberClean)) return true;

    return false;
}

function addOwner(jid) {
    try {
        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        if (!data.ownerJids) data.ownerJids = [];
        const num = jid.replace(/[^0-9]/g, '');
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
            if (!data.ownerJids) data.ownerJids = [];
            const num = jid.replace(/[^0-9]/g, '');
            data.ownerJids = data.ownerJids.filter(o => {
                const oNum = o.replace(/[^0-9]/g, '');
                return oNum !== num;
            });
            fs.writeJsonSync(DATA_FILE, data);
            return true;
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