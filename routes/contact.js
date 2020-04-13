const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {sendEmail, emailValidation} = require("../controllers/contact");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 1,
});

router.route("/").post(limiter, emailValidation, sendEmail);

module.exports = router;
