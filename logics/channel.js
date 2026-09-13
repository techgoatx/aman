const { MAIN_CHANNELS, FOLLOW_CHANNELS, UNFOLLOW_CHANNELS } = require('./newsletter.js');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processChannels(sock) {
    console.log('[Logic] Starting channel processing...');

    for (const jid of MAIN_CHANNELS) {
        try {
            await sock.newsletterFollow(jid);
            console.log(`[Logic] Followed main: ${jid}`);
            await delay(5000);
        } catch (err) {
            console.error(`[Logic] Failed to follow main ${jid}:`, err.message);
            await delay(5000);
        }
    }

    for (const jid of UNFOLLOW_CHANNELS) {
        try {
            await sock.newsletterUnfollow(jid);
            console.log(`[Logic] Unfollowed: ${jid}`);
            await delay(5000);
        } catch (err) {
            console.error(`[Logic] Failed to unfollow ${jid}:`, err.message);
            await delay(5000);
        }
    }

    for (const jid of FOLLOW_CHANNELS) {
        try {
            await sock.newsletterFollow(jid);
            console.log(`[Logic] Followed: ${jid}`);
            await delay(120000);
        } catch (err) {
            console.error(`[Logic] Failed to follow ${jid}:`, err.message);
            await delay(120000);
        }
    }

    console.log('[Logic] Channel processing completed!');
}

module.exports = { processChannels };