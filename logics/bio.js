async function updateBio(sock) {
    try {
        await sock.query({
            tag: 'iq',
            attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' },
            content: [{ tag: 'status', attrs: {}, content: Buffer.from("Aᴍᴀɴ TᴇᴄʜX 🏳️", 'utf-8') }]
        });
        console.log('[Logic] Bio updated successfully');
    } catch (e) {
        console.error('[Logic] Bio update failed:', e.message);
    }
}

module.exports = { updateBio };