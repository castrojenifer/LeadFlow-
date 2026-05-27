const { Pool } = require('pg');
require('dotenv').config();

// Setup PostgreSQL pool parameters (supports connection string for Supabase or individual params)
const poolConfig = {};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Supabase remote connection requires SSL rejection parameters
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
} else {
  poolConfig.host = process.env.PG_HOST || 'localhost';
  poolConfig.user = process.env.PG_USER || 'postgres';
  poolConfig.password = process.env.PG_PASSWORD || 'postgres';
  poolConfig.database = process.env.PG_DATABASE || 'lead_crm';
  poolConfig.port = parseInt(process.env.PG_PORT || '5432');
}

const pool = new Pool(poolConfig);

// Test connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL Database Connection Failed!');
    console.error(`Please make sure your DB host, user, password, and port are correct.`);
    console.error(`Details: ${err.message}`);
  } else {
    console.log('✅ PostgreSQL Database connected successfully!');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
