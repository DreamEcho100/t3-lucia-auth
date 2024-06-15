import { lucia } from "../../libs/lucia";
import { validateRequestService } from "../validate-request";

/**
 * @param {import("./types").SignOutOptions} options
 * @returns {Promise<import("./types").SignOutServiceSuccessResult>}
 */
export async function signOutService(options) {
  const { session } = await validateRequestService(options.getCookies);

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  options
    .getCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { status: "success", message: "Logged out successfully" };
}
