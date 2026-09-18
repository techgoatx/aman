const { connectDB } = require('./lib/database.js');
require('./aman.js');

connectDB().catch((error) => {
    console.error('[Database] Background connection error:', error.message);
});