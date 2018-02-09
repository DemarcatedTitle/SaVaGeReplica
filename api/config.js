// const Confidence = require('confidence');
const env = process.env.APP_ENV || 'development';

const getQaOidcUrl = () => {
  let qaUrlBase = `https://${process.env.REACT_APP_CS_PROJECT}-${process.env
    .REACT_APP_CS_REPO}`;
  let oidcBase = `${qaUrlBase}-oidc-${process.env.REACT_APP_CS_BRANCH}`;
  oidcBase = oidcBase.toLowerCase().substr(0, 64);
  return oidcBase + '.test';
};

const config = {
  $filter: 'env',
  $base: {
    env,
    db: {
      acquireConnectionTimeout: 3000,
      client: 'pg',
      connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: process.env.POSTGRES_PORT,
      },
      seedDirectory: './seeds/dev',
    },
    auth: {
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
      oidcFrontend: process.env.OIDC_BASE_URL,
      domain: 'http://oidc:9000',
    },
  },
  development: {},
  qa: {
    auth: { oidcFrontend: getQaOidcUrl() },
  },
  staging: {
    db: { seedDir: './seeds/prod' },
  },
  production: {
    db: { seedDir: './seeds/prod' },
  },
};

module.exports = config;
// module.exports = function(path, criteria) {
//   const store = new Confidence.Store();
//   path = path ? path : '/';
//   criteria = criteria ? criteria : {};
//   criteria.env = env;

//   store.load(config);
//   return store.get(path, criteria);
// };
