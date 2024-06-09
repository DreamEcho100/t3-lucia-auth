import { errorFormatter } from "../../libs/error";
import { signOutService } from "./service";

/**
 * @param {import("./types").SignOutOptions} options
 */
export function signOutController(options) {
  return signOutService(options).catch(errorFormatter);
}
