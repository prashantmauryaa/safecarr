const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initDb } = require('./db/init');

// Initialize DB
initDb();

const app = express();

app.use(cors({
    origin: process.env.Frontend_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', msg: 'Carsafe API is running' }));

// TODO: Routes
const authRoutes = require('./routes/auth');
const ownerRoutes = require('./routes/owner');
const publicRoutes = require('./routes/public');

app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/public', publicRoutes);

module.exports = app;
