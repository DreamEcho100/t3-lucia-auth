import { ZodError } from "zod";

/**
 * @param {unknown} error
 * @returns {import("../types").AuthErrorResult}
 * */
export function errorFormatter(error) {
  if (error instanceof Error) {
    return { status: "error", message: error.message };
  }

  if (error instanceof ZodError) {
    return {
      status: "input-validation-errors",
      fields: error.flatten().fieldErrors,
    };
  }

  return {
    status: "error",
    message: "An error occurred\n" + JSON.stringify(error, null, 2),
  };
}
