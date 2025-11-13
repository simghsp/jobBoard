//  Load environment variables first
require('dotenv').config();

//  Import core modules using require()
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');

//  Initialize app
const app = express();

//  Connect to MongoDB
connectDB();

//  Middleware setup
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));

//  Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// Handle unexpected errors
process.on('unhandledRejection', (err) =>
  console.error('UNHANDLED REJECTION', err)
);
process.on('uncaughtException', (err) =>
  console.error('UNCAUGHT EXCEPTION', err)
);
