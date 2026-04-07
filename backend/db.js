const { Pool } = require('pg');

const approvalDB = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'approval_user',
  password: 'ITriangle',
  database: 'approval_process',
});

approvalDB.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
  });

module.exports = approvalDB;