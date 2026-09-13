const master = require('./master.js');
const owner = require('./owner.js');
const sudo = require('./sudo.js');

async function isNormal(senderId, sock = null, chatId = null) {
    if (master.isMaster(senderId)) return false;
    if (await owner.isOwner(senderId, sock, chatId)) return false;
    if (sudo.isSudo(senderId)) return false;
    return true;
}

module.exports = { isNormal };