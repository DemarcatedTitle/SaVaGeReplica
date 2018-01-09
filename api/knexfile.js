const config = require('./config');

module.exports = {
  client: 'postgresql',
  // seeds: {
  //   directory: config('/db/seedDirectory'),
  // },
  connection: config.$base.db.connection,
  acquireConnectionTimeout: 10000,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
