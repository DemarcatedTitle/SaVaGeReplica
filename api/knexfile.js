const config = require('./config');

module.exports = {
  client: 'postgresql',
  seeds: {
    directory: config('/db/seedDirectory'),
  },
  connection: config('/db/connection'),
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
