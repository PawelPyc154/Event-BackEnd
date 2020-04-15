const { check } = require('express-validator');

exports.emailValidation = [
  check('email')
    .trim()
    .isEmail()
    .withMessage('Please include a valid email')
    .normalizeEmail(),
  check('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 6, max: 50 })
    .withMessage('Subject should have minimum length 6 and maximum 50'),
  check('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 6, max: 500 })
    .withMessage('Subject should have minimum length 6 and maximum 500'),
];
