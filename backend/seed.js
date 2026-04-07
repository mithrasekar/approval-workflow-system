const db = require('./models');
const seeder = require('./seeders/20260407041500-seed-base-workflow.js');

db.sequelize.sync({ force: true }).then(async () => {
    console.log('DB Synced. Running seeder...');
    try {
        await seeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
        console.log('Seeding complete ✅');
    } catch (e) {
        if (e.name === 'SequelizeUniqueConstraintError') console.log('Already seeded.');
        else console.error('Seeding error:', e);
    }
    process.exit(0);
});
