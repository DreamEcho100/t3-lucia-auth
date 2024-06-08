import { SignUpSchema } from "~/features/auth/base/server/libs/validators";

/**
 * @param {unknown} input
 * @returns {import("./types").SignUpInput}
 */
export function signUpInput(input) {
  return SignUpSchema.parse(input);
}
