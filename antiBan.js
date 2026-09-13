class AntiBan {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.lastMessageTime = 0;
        this.delay = 1000;
        this.messageCount = 0;
        this.dailyLimit = 500;
        this.isBlocked = false;
    }

    async queueMessage(sock, jid, content, options = {}) {
        this.queue.push({ sock, jid, content, options });
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const msg = this.queue.shift();
            try {
                const now = Date.now();
                const timeSinceLast = now - this.lastMessageTime;
                if (timeSinceLast < this.delay) {
                    await new Promise(resolve => setTimeout(resolve, this.delay - timeSinceLast));
                }

                this.messageCount++;
                if (this.messageCount > this.dailyLimit) {
                    await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
                    this.messageCount = 0;
                    this.queue.unshift(msg);
                    continue;
                }

                await msg.sock.sendMessage(msg.jid, msg.content, msg.options);
                this.lastMessageTime = Date.now();
            } catch (err) {
                console.error('[AntiBan] Send error:', err.message);
                if (err.message.includes('blocked') || err.message.includes('ban')) {
                    this.isBlocked = true;
                }
            }
        }

        this.isProcessing = false;
    }

    getStatus() {
        return {
            queueLength: this.queue.length,
            totalMessages: this.messageCount,
            isBlocked: this.isBlocked,
            dailyLimit: this.dailyLimit
        };
    }

    clearQueue() {
        this.queue = [];
        return { success: true };
    }
}

module.exports = new AntiBan();