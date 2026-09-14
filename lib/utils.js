function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function parseJid(jid) {
    return jid.replace(/[^0-9]/g, '');
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncate(str, length = 30) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateCode(length = 6) {
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

function isValidPhone(number) {
    return /^[0-9]{10,15}$/.test(number.replace(/[^0-9]/g, ''));
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function getFileExtension(filename) {
    return filename.split('.').pop();
}

function getFileName(filename) {
    return filename.split('.').slice(0, -1).join('.');
}

function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

function uniqueArray(arr) {
    return [...new Set(arr)];
}

function getTimestamp() {
    return new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
}

function getDate() {
    return new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' });
}

module.exports = {
    delay,
    formatUptime,
    formatBytes,
    formatNumber,
    parseJid,
    capitalize,
    truncate,
    randomItem,
    generateId,
    generateCode,
    isValidPhone,
    isValidUrl,
    getFileExtension,
    getFileName,
    chunkArray,
    uniqueArray,
    getTimestamp,
    getDate
};