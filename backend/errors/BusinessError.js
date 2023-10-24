export class BusinessError extends Error {
  constructor({ status, message, detail }) {
    super(message);
    this.status = status;
    this.message = message;
    this.detail = detail;
    Error.captureStackTrace(this, this.constructor);
  }
}
