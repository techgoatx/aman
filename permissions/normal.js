const master = require('./master.js');
const owner = require('./owner.js');
const sudo = require('./sudo.js');

async function isNormal(senderId, sock = null, chatId = null) {
    if (await master.isMaster(senderId, sock, chatId)) return false;
    if (await owner.isOwner(senderId, sock, chatId)) return false;
    if (await sudo.isSudo(senderId, sock, chatId)) return false;
    return true;
}

module.exports = { isNormal };