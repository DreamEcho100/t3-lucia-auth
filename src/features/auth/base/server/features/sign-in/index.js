import { SignInSchema } from "~/features/auth/base/server/libs/validators";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { lucia } from "../../libs/lucia";
import { verify } from "../../libs/hash";
import { AuthError } from "../../libs/error";
import { AUTH_ERROR_CODES } from "../../libs/constants";

/**
 * @param {unknown} input
 * @returns {import("./types").SignInInput}
 */
export function signInInput(input) {
  return SignInSchema.parse(input);
}
/**
 * @param {import("./types").SignInInput} input
 * @param {import("./types").SignInOptions} options
 * @returns {Promise<import("./types").SignInServiceSuccessResult>}
 */
export async function signInService(input, options) {
  const existingUser = await db.query.users.findFirst({
    where: (table) => {
      if (input.email) {
        return eq(table.email, input.email);
      }

      if (!input.name) {
        throw new Error("Username or email is required");
      }

      return eq(table.name, input.name);
    },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (!existingUser.hashedPassword) {
    throw new Error("User not found");
  }

  const isValidPassword = await verify(
    existingUser.hashedPassword,
    input.password,
  );

  if (!isValidPassword) {
    throw new Error("Incorrect name or password");
  }

  if (!existingUser.emailVerifiedAt) {
    throw new AuthError(
      "Email not verified",
      400,
      AUTH_ERROR_CODES.EMAIL_NOT_VERIFIED,
    );
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  options
    .getCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { status: "success", message: "Logged in successfully" };
}
