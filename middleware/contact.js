const { check } = require('express-validator');

exports.emailValidation = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Wpisz prawidłowy email')
    .normalizeEmail(),
  check('subject')
    .trim()
    .notEmpty()
    .withMessage('Temat jest wymagany')
    .isLength({ min: 6, max: 50 })
    .withMessage('Temat powinien mieć od 6 do 50 znaków'),
  check('message')
    .trim()
    .notEmpty()
    .withMessage('Wiadomość jest wymagana')
    .isLength({ min: 6, max: 500 })
    .withMessage('Wiadomość powinna mieć od 6 do 50 znaków'),
];
