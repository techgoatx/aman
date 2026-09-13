const fs = require('fs-extra');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/bot_data.json');

function getSudoList() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readJsonSync(DATA_FILE);
            return data.sudoJids || [];
        }
    } catch (e) {}
    return [];
}

function isSudo(senderId) {
    const sudoList = getSudoList();
    if (sudoList.length === 0) return false;

    const senderClean = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
    const senderNumber = senderClean.replace(/[^0-9]/g, '');

    return sudoList.some(s => {
        const sNum = s.replace(/[^0-9]/g, '');
        return senderNumber === sNum || senderNumber.includes(sNum) || sNum.includes(senderNumber);
    });
}

function addSudo(jid) {
    try {
        let data = {};
        if (fs.existsSync(DATA_FILE)) {
            data = fs.readJsonSync(DATA_FILE);
        }
        if (!data.sudoJids) data.sudoJids = [];
        const num = jid.replace(/[^0-9]/g, '');
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
            if (!data.sudoJids) data.sudoJids = [];
            const num = jid.replace(/[^0-9]/g, '');
            data.sudoJids = data.sudoJids.filter(s => {
                const sNum = s.replace(/[^0-9]/g, '');
                return sNum !== num;
            });
            fs.writeJsonSync(DATA_FILE, data);
            return true;
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