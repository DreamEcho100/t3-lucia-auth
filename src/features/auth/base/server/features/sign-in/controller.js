import { errorFormatter } from "../../libs/error";
import { signInInput } from "./input";
import { signInService } from "./service";

/**
 * @param {unknown} input
 * @param {import("./types").SignInOptions} options
 */
export function signInController(input, options) {
  try {
    return signInService(signInInput(input), options);
  } catch (error) {
    return errorFormatter(error);
  }
}
