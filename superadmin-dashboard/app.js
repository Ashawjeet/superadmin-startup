const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/superadmins', require('./routes/superadmins'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/programmanagers', require('./routes/programmanagers'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
