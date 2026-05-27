const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

// Only initialize PostgreSQL connection pool if Supabase REST URL is not present
if (!process.env.SUPABASE_URL) {
  const poolConfig = {
    host: process.env.PG_HOST || 'localhost',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    database: process.env.PG_DATABASE || 'lead_crm',
    port: parseInt(process.env.PG_PORT || '5432'),
  };

  pool = new Pool(poolConfig);

  // Test local database connection on startup
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.warn('⚠️ Local PostgreSQL fallback connection failed. (Bypassed if using Supabase REST)');
    } else {
      console.log('✅ Local fallback PostgreSQL Database connected successfully!');
    }
  });
} else {
  console.log('⚡ Active Database Mode: Remote Supabase REST Engine (Zero Password Required!)');
}

module.exports = {
  query: (text, params) => {
    if (!pool) {
      throw new Error('PostgreSQL client pool is uninitialized. Currently running in Supabase REST Mode.');
    }
    return pool.query(text, params);
  },
  pool,
};
