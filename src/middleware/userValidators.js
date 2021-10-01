const { check } = require("express-validator");

const loginValidators = [
  check("login")
    .isLength({ min: 1 })
    .withMessage("El email o usuario es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El email debe contener menos de 50 caracteres"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("El password es obligatorio")
];

const registerValidators = [
  check("email")
    .isLength({ min: 1 })
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no tiene formato indicado")
    .isLength({ max: 50 })
    .withMessage("El email debe contener menos de 50 caracteres"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("El password es obligatorio")
];

const emailValidators = [
  check("email")
    .isLength({ min: 1 })
    .withMessage("El email es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El email debe contener menos de 50 caracteres")
    .isEmail()
    .withMessage("El email no tiene formato indicado")
];

module.exports = {
  loginValidators,
  registerValidators,
  emailValidators
};
