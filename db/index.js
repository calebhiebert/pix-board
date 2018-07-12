const pg = require('pg-promise');
const path = require('path');
const logger = require('pino')({ name: 'db', level: process.env.LOG_LEVEL || 'info' });

function sql(file) {
  const fullPath = path.join(__dirname, 'sql', file);
  return new pg.QueryFile(fullPath, { minify: true });
}

const q = {
  getPixHistory: sql('get_pix_history.sql'),
  getPix: sql('get_pix.sql'),
  insertPix: sql('insert_pix.sql'),
  tables: sql('tables.sql'),
};

const db = pg()({
  host: process.env.PGHOST,
  database: process.env.PGUSER,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

db.any(q.tables)
  .then((result) => {
    logger.info('Successfully created database');
  })
  .catch((err) => {
    logger.error('Database creation error', err);
  });

const insertPix = (x, y, pix, userId) => {
  return db.one(q.insertPix, { x, y, pix, user_id: userId });
};

const getPixHistory = (x, y) => {
  return db.any(q.getPixHistory, { x, y });
};

const getPix = (id) => {
  return db.one(q.getPix, { id });
};

module.exports = {
  insertPix,
  getPixHistory,
  getPix,
};
