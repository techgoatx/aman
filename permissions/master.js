const config = require('../config.js');

function isMaster(senderId) {
    const masterNumbers = config.master.numbers || [];
    const masterJids = config.master.jids || [];

    const senderClean = senderId.includes(':') ? senderId.split(':')[0] : (senderId.includes('@') ? senderId.split('@')[0] : senderId);
    const senderNumber = senderClean.replace(/[^0-9]/g, '');

    if (masterJids.includes(senderId)) return true;

    return masterNumbers.some(m => {
        const mNum = m.replace(/[^0-9]/g, '');
        return senderNumber === mNum || senderNumber.includes(mNum) || mNum.includes(senderNumber);
    });
}

function isMasterJid(senderId) {
    return (config.master.jids || []).includes(senderId);
}

function getMasterNumbers() {
    return config.master.numbers || [];
}

function getMasterJids() {
    return config.master.jids || [];
}

module.exports = {
    isMaster,
    isMasterJid,
    getMasterNumbers,
    getMasterJids
};