//server.js
const app = require('./app');
const server = require('http').createServer(app);
const { init } = require('./socketio');
const port = Number(process.env.SERVICES_PORT) || 3000;

//init(server, app);

server.listen(port);
console.log(`Listening on port ${port}`);
