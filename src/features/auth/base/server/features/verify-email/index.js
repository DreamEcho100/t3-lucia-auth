import { db } from "~/server/db";
import { emailsVerifications, users } from "~/server/db/schema";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { lucia } from "../../libs/lucia";
import { AuthError } from "../../libs/error";
import { ERROR_CODES } from "../../libs/constants";
import { verifyEmailSchema } from "../../libs/validators";
import { verifyEmailVerificationToken } from "../../libs/email";

/**
 * @param {unknown} input
 * @returns {import("./types").VerifyEmailInput}
 */
export function verifyEmailInput(input) {
  return verifyEmailSchema.parse(input);
}

/**
 * @param {import("./types").VerifyEmailInput} input
 * @param {import("./types").VerifyEmailOptions} options
 * @returns {Promise<import("./types").VerifyEmailServiceSuccessResult>}
 */
export async function verifyEmailService(input, options) {
  const decoded = verifyEmailVerificationToken(
    input.token,
    options.env.JWT_SECRET,
  );

  const emailVerificationQueryResult =
    await db.query.emailsVerifications.findFirst({
      where:
        eq(emailsVerifications.userId, decoded.userId) &&
        eq(emailsVerifications.code, decoded.code),
    });

  if (!emailVerificationQueryResult) {
    throw new AuthError(ERROR_CODES.INVALID_TOKEN, 400);
  }

  await db.transaction(async (trx) => {
    return Promise.all([
      trx
        .delete(emailsVerifications)
        .where(eq(emailsVerifications.userId, decoded.userId)),
      trx
        .update(users)
        .set({ emailVerifiedAt: new Date() })
        .where(eq(users.email, decoded.email)),
    ]);
  });

  const session = await lucia.createSession(decoded.userId, {
    expiresIn: 60 * 60 * 24 * 30,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  options
    .getCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return {
    status: "redirect",
    url: /** @type {string} */ (process.env.NEXT_PUBLIC_BASE_URL),
    statusNumber: 301,
  };
}
