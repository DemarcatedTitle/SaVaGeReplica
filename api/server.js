const Hapi = require('hapi');
const imageRoutes = require('./src/application/image/image-routes.js');
const imageDB = require('./imageDB.js');
const Inert = require('inert');

imageDB.start();

async function SavageServer() {
  const server = new Hapi.Server({ port: 9000 });
  await server.register(Inert);
  server.route(imageRoutes);
  await server.start();
  console.log('Server started at: ' + server.info.uri);
  // .then(test => console.log('Server started at: ' + server.info.uri))
  // .catch(err => console.log(err));
}

SavageServer();
