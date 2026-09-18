async function connectDB() {
    const url = process.env.MONGODB_URL;
    if (!url) {
        console.log('[Database] MONGODB_URL not configured. Continuing without MongoDB.');
        return false;
    }

    try {
        const mongoose = require('mongoose');
        await mongoose.connect(url, {
            dbName: process.env.DB_NAME || 'aman_md',
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000
        });
        console.log('[Database] MongoDB connected successfully.');
        return true;
    } catch (error) {
        console.error('[Database] MongoDB connection failed:', error.message);
        return false;
    }
}

module.exports = { connectDB };
