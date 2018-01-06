const Hapi = require('hapi');

const server = new Hapi.Server({ port: 9000 });

server.route({ method: 'GET', path: '/api/hello', handler: () => 'ok' });

server
  .start()
  .then(test => console.log('Server started at: ' + server.info.uri))
  .catch(err => console.log(err));
