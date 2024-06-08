import { errorFormatter } from "../../libs/error";
import { signOutService } from "./service";

/**
 * @param {import("./types").SignOutOptions} options
 */
export function signOutController(options) {
  try {
    return signOutService(options);
  } catch (error) {
    return errorFormatter(error);
  }
}
