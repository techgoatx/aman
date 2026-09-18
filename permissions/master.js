const config = require('../config.js');
const { configuredNumberMatches, findParticipant, participantHasConfiguredNumber } = require('./identity.js');

async function isMaster(senderId, sock = null, chatId = null) {
    const masterNumbers = config.master.numbers || [];
    const masterJids = config.master.jids || [];

    if (masterJids.includes(senderId) || configuredNumberMatches(senderId, masterNumbers)) return true;

    const participant = await findParticipant(sock, chatId, senderId);
    return participantHasConfiguredNumber(participant, [...masterNumbers, ...masterJids]);
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