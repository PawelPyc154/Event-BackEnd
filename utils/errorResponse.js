class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.ststusCode = statusCode;
  }
}

module.exports = ErrorResponse;
