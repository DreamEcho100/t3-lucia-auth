import { SignInSchema } from "~/features/auth/base/server/libs/validators";

/**
 * @param {unknown} input
 * @returns {import("./types").SignInInput}
 */
export function signInInput(input) {
  return SignInSchema.parse(input);
}
