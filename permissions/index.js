const master = require('./master.js');
const owner = require('./owner.js');
const sudo = require('./sudo.js');
const normal = require('./normal.js');
const admin = require('./admin.js');

async function checkPermission(sender, command, botMode, isMasterUser, isOwnerUser, isSudoUser, isAdminUser) {
    if (isMasterUser) {
        return { allowed: true, reason: 'Master' };
    }

    if (command.secret || command.category === 'master' || command.type === 'master') {
        return { allowed: false, reason: 'Master only' };
    }

    if (command.type === 'owner' || command.category === 'owner') {
        if (isOwnerUser || isSudoUser) {
            return { allowed: true, reason: 'Owner/Sudo' };
        }
        return { allowed: false, reason: 'Owner only' };
    }

    if (command.type === 'admin' || command.category === 'admin') {
        if (isAdminUser || isOwnerUser || isSudoUser) {
            return { allowed: true, reason: 'Admin' };
        }
        return { allowed: false, reason: 'Admin only' };
    }

    if (botMode === 'self') {
        if (isMasterUser || isOwnerUser) {
            return { allowed: true, reason: 'Self mode allowed' };
        }
        return { allowed: false, reason: 'Self mode' };
    }

    if (botMode === 'private') {
        if (isMasterUser || isOwnerUser || isSudoUser) {
            return { allowed: true, reason: 'Private mode allowed' };
        }
        return { allowed: false, reason: 'Private mode' };
    }

    return { allowed: true, reason: 'Public mode' };
}

async function getUserRole(sender, sock = null, chatId = null) {
    if (master.isMaster(sender)) return '👑 Master';
    if (await owner.isOwner(sender, sock, chatId)) return '⭐ Owner';
    if (sudo.isSudo(sender)) return '🔰 Sudo';
    if (admin.isAdminUser(sender)) return '🛡️ Admin';
    return '👤 User';
}

async function getUserRoleEmoji(sender, sock = null, chatId = null) {
    if (master.isMaster(sender)) return '👑';
    if (await owner.isOwner(sender, sock, chatId)) return '⭐';
    if (sudo.isSudo(sender)) return '🔰';
    if (admin.isAdminUser(sender)) return '🛡️';
    return '👤';
}

module.exports = {
    master,
    owner,
    sudo,
    normal,
    admin,
    checkPermission,
    getUserRole,
    getUserRoleEmoji
};