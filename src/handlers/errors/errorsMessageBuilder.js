const { dictionary } = require('./dictionary');


/**
 * @description Generador del mensaje o mensajes a transmitir al usuario
 * @author Juan Sebastian Vernaza Lopez
 * @date 02/10/2021
 * @param {*} err
 * @return {*} 
 */
async function generateMessage(err) {
  let messages = '';
  if (err) {
    let data = Promise.all(
      err.errors.map(async (item, index) => {
        let property = item.path.split('.')[2];
        let type = item.errorCode.split('.')[0];
        let errorCode = item.message.replace(/\s/g, '_');
        let cause = buildMessageByTypeError(type, errorCode, property);
        messages += cause + '|';
      })
    );
  }

  return messages;
}

/**
 * @description Construye el mensaje de error por el tipo de error
 * @author Juan Sebastian Vernaza Lopez
 * @date 02/10/2021
 * @param {*} type
 * @param {*} errorCode
 * @param {*} property
 * @return {*} 
 */
function buildMessageByTypeError(type, errorCode, property) {
  switch (type) {
    case 'type':
      return 'Tipo de dato ' + dictionary[errorCode] + ' para ' + dictionary[property];
    case 'required':
      return 'El ' + dictionary[property] + ' es obligatorio';
    default:
      break;
  }
}

module.exports = {
  generateMessage,
};
