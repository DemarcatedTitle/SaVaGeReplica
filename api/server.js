const Hapi = require('hapi');
const imageRoutes = require('./src/application/image/image-routes.js');
const imageDB = require('./imageDB.js');
imageDB.start();
const server = new Hapi.Server({ port: 9000 });

server.route(imageRoutes);

server
  .start()
  .then(test => console.log('Server started at: ' + server.info.uri))
  .catch(err => console.log(err));
