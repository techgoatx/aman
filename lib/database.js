const mongoose = require('mongoose');

async function connectDB() {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) {
            console.error('MONGODB_URL not set in .env');
            return false;
        }

        await mongoose.connect(url, {
            dbName: process.env.DB_NAME || 'aman_md'
        });

        console.log('MongoDB connected successfully!');
        return true;
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        return false;
    }
}

module.exports = { connectDB };