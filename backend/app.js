const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());

app.set('etag', false);


// Load nested Controllers API structure for side-effects
app.use('/auth', require('./controllers/auth/api/login_api'));
require('./controllers/pr/route/route');
require('./controllers/approval/route/route');
require('./controllers/admin/route/route');

// Mount global fluent router
const globalRouter = require('./utilities/route').globalRouter;
app.use('/', globalRouter);

// Users Route for Mock Auth
app.get('/users', async (req, res) => {
  try {
      const users = await db.users.findAll({
          include: [{ model: db.roles, as: 'role' }]
      });
      res.json(users);
  } catch(err) {
      res.status(500).json({ error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Approval Workflow API running');
});

const PORT = 3000;

// Sync database and start server
db.sequelize.sync({ alter: false }).then(() => {
  console.log('✅ Connected to PostgreSQL via Sequelize');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Connection error:', err);
});