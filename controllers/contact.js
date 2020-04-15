const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// @desc         Send email
// @route        POST /api/contact
// @access       Puvlic
exports.sendEmail = asyncHandler(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  console.log({
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });

  await sendEmail({
    from: req.body.email,
    to: 'pawelpyc154@gmail.com',
    subject: req.body.subject,
    text: `${req.body.email}\n${req.body.message}`,
  });
  await sendEmail({
    from: 'pawelpyc.service@gmail.com',
    to: req.body.email,
    subject: 'Paweł Pyc automatyczna odpowiedz',
    text:
      'Cześć,\n\nDziękuję za wiadomość, postaram się odpowiedzieć wkrótce.\nW pilnych sprawach proszę o kontakt telefoniczny: 691 115 437.\n\nPozdrawiam,\nPaweł Pyc\n\n* Niniejsza wiadomość została wygenerowana automatycznie, prosimy na nią nie odpowiadać.',
  });
  await res.status(200).json({ success: true, data: 'Email sent' });
});
