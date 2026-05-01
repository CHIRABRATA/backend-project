require('dotenv').config(); // MUST BE LINE 1

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
