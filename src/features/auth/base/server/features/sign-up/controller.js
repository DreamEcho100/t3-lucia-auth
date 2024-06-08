import { errorFormatter } from "../../libs/error";
import { signUpInput } from "./input";
import { signUpService } from "./service";

/**
 * @param {unknown} input
 * @param {import("./types").SignUpOptions} options
 */
export function signUpController(input, options) {
  try {
    return signUpService(signUpInput(input), options);
  } catch (error) {
    return errorFormatter(error);
  }
}