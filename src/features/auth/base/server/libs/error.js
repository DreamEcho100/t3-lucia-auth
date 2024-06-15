import { ZodError } from "zod";

/**
 * @param {unknown} error
 * @returns {import("../types").AuthErrorResult}
 * */
export function errorFormatter(error) {
  if (error instanceof AuthError) {
    return {
      status: "error",
      message: error.message,
      statusNumber: error.statusNumber,
    };
  }

  if (error instanceof ZodError) {
    return {
      status: "input-validation-errors",
      fields: error.flatten().fieldErrors,
      statusNumber: 400,
    };
  }

  if (error instanceof Error) {
    return { status: "error", message: error.message, statusNumber: 500 };
  }

  return {
    status: "error",
    message: "An error occurred\n" + JSON.stringify(error, null, 2),
    statusNumber: 500,
  };
}

export class AuthError extends Error {
  /** @type {number} */
  statusNumber;

  /**
   * @param {string} message
   * @param {number} statusNumber
   */
  constructor(message, statusNumber) {
    super(message);
    this.name = "AuthError";
    this.statusNumber = statusNumber;
  }
}

// export class AuthErrorRedirect extends AuthError {
//   /** @type {string} */
//   redirectUrl;

//   /**
//    * @param {string} message
//    * @param {string} redirectUrl
//    * @param {number} [statusNumber=302]
//    */
//   constructor(message, redirectUrl, statusNumber = 302) {
//     super(message, statusNumber);
//     this.redirectUrl = redirectUrl;
//   }
// }
