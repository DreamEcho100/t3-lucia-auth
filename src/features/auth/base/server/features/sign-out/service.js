import { lucia } from "../../libs/lucia";
import { validateRequest } from "../validate-request";
import { errorFormatter } from "../../libs/error";

/**
 * @param {import("./types").SignOutOptions} options
 * @returns {Promise<import("./types").SignOutServiceSuccessResult>}
 */
export async function signOutService(options) {
  const { session } = await validateRequest(options.getServerCookies);

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();

  options
    .getServerCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { status: "success", message: "Logged out successfully" };
}
