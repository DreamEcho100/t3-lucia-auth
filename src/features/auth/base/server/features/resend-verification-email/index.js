import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { emailsVerifications } from "~/server/db/schema";
import { generateEmailVerificationToken, sendEmail } from "../../libs/email";
import { resendVerificationEmailSchema } from "../../libs/validators";

/**
 * @param {unknown} input
 * @returns {import("./types").ResendVerificationEmailInput}
 */
export function resendVerificationEmailInput(input) {
  return resendVerificationEmailSchema.parse(input);
}

/**
 * @param {import("./types").ResendVerificationEmailInput} input
 * @param {import("./types").ResendVerificationEmailOptions} options
 */
export async function resendVerificationEmailService(input, options) {
  const existingUser = await db.query.users.findFirst({
    where: (table) => eq(table.email, input.email),
  });

  if (!existingUser) {
    return { error: "User not found" };
  }

  if (existingUser.emailVerifiedAt) {
    return { error: "Email already verified" };
  }

  const existedCode = await db.query.emailsVerifications.findFirst({
    where: eq(emailsVerifications.userId, existingUser.id),
  });

  if (!existedCode) {
    return { error: "Code not found" };
  }

  const sentAt = new Date(existedCode.sentAt);
  const isOneMinuteHasPassed = new Date().getTime() - sentAt.getTime() > 60000; // 1 minute

  if (!isOneMinuteHasPassed) {
    return {
      error:
        "Email already sent next email in " +
        (60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)) +
        " seconds",
    };
  }

  const token = await generateEmailVerificationToken({
    userId: existingUser.id,
    email: existingUser.email,
    code: existedCode.code,
    env: options.env,
  });

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;
  await sendEmail({
    html: `<a href="${url}">Verify your email</a>`,
    subject: "Verify your email",
    to: input.email,
  });

  return { success: "Email sent" };
}