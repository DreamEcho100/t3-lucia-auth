/**
 * @param {unknown} error
 * @returns {import("../types").AuthErrorResult}
 * */
export function errorFormatter(error) {
  if (error instanceof Error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "error",
    message: "An error occurred\n" + JSON.stringify(error, null, 2),
  };
}
