const socketIO = require('socket.io');
const redis = require('redis');
const { promisify } = require('util');
const { saveLogError } = require('./functions/generalFunctions');
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || 'localhost';

const client = redis.createClient({
  port: redisPort,
  host: redisHost,
});

const getAsync = promisify(client.get).bind(client);

function init(server, app) {
  try {
    const options = {
      /* ... */
    };
    //console.log(app);
    const io = socketIO(server);
    io.sockets.on('connection', function (socket) {
      var socketId = socket.id;
      var clientIp = socket.request.connection.remoteAddress;
    });
    io.on('connection', (socket) => {
      //Eliminamos el id socket del usuario que se desconecto
      socket.on('disconnect', function () {});
      //Registra el socket del usuario logueado
      socket.on('set user-socket', async (data) => {
        let socketUserId = [];
        let userIds = await getAsync(data.id_user);
        if (userIds !== '' && userIds !== null) {
          socketUserId = JSON.parse(userIds);
          socketUserId = [...socketUserId, data.socketId];
        } else {
          socketUserId = [data.socketId];
        }
        client.set(data.id_user, JSON.stringify(socketUserId));
      });

      //Valida peticiones de las notificaciones
      socket.on('get notifications', (data) => {
        io.sockets.emit('send notification', { title: 'Nueva postulación', message: 'Se ha agregado una nueva postulación' });
      });

      //Envia nuevas notificaciones
      //socket.emit('send notification', { message: 'hola' });
    });
    var socketIo = function (req, res, next) {
      req.socketIo = io;
      next();
    };

    app.use(socketIo);
  } catch (e) {
    saveLogError(e.message, 'registerUser');
  }
}

module.exports = {
  init,
};
