const JWT = require('jsonwebtoken');
const bluebird = require('bluebird');
var fs = require('fs');
var path = require('path');
const postgresDB = require('../db/postgresDB');

let verifyToken = async (req, res, next) => {
  let token = req.get('Authorization');
  let idTransaction = req.get('Transaction');
  if (!token || !idTransaction) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized',
    });
  }
  var publicKEY = fs.readFileSync(path.join(__dirname, '../../public.pem'), 'utf8');

  var verifyOptions = {
    issuer: 'KyK8MWIiifNty7vFOWjxgKdS9iT2il9R',
    subject: 'gys@user.com',
    audience: 'http://gys.in',
    expiresIn: '12h',
    algorithm: ['RS256'],
  };

  JWT.verify(token, publicKEY, verifyOptions, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized',
      });
    } else {
      let login_histories = postgresDB.default.instance.db.login_histories;
      let login = await login_histories
        .findOne({
          where: {
            id_user: decoded.id,
            id_transaction: idTransaction,
          },
          raw: true,
        })
        .catch((e) => {
          console.log(e);
        });

      if (!login) {
        return res.status(401).json({
          error: true,
          message: 'Unauthorized',
        });
      }

      req.decoded = decoded;
      next();
    }
  });
};

module.exports = {
  verifyToken,
};
