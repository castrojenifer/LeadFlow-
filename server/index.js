const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const leadRoutes = require('./routes/leads');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Dev level logger

// Base info route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Lead Management System API (Mini CRM)',
    version: '1.0.0',
    status: 'Healthy',
    endpoints: {
      auth: '/api/auth/login [POST]',
      leads: '/api/leads [GET, POST, PUT, DELETE]'
    }
  });
});

// Register routes
app.use('/api/leads', leadRoutes);

// Catch-all global error handler
app.use(errorHandler);

// Launch Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🚀 Mini CRM Server active in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 Server URL: http://127.0.0.1:${PORT}`);
  console.log(`===================================================`);
});
