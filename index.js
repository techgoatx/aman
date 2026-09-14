const { connectDB } = require('./lib/database.js');

(async () => {
    await connectDB();
    require('./aman.js');
})();