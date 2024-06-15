import { errorFormatter } from "../../libs/error";
import { db } from "~/server/db";
import { lucia } from "../../libs/lucia";
import { createAsyncId } from "~/utils/createId";
import { users } from "~/server/db/schema";
import { hash } from "../../libs/hash";
import { SignUpSchema } from "~/features/auth/base/server/libs/validators";

/**
 * @param {unknown} input
 * @returns {import("./types").SignUpInput}
 */
export function signUpInput(input) {
  return SignUpSchema.parse(input);
}

/**
 * @param {import("./types").SignUpInput} input
 * @param {import("./types").SignUpOptions} options
 * @returns {Promise<import("./types").SignUpServiceSuccessResult>}
 */
export async function signUpService(input, options) {
  const hashedPassword = await hash(input.password);
  const userId = await createAsyncId();

  await db
    .insert(users)
    .values({
      id: userId,
      name: input.name,
      email: input.email,
      hashedPassword,
    })
    .returning({ id: users.id, name: users.name });

  const session = await lucia.createSession(userId, {
    expiresIn: 60 * 60 * 24 * 30,
  });

  const sessionCookie = lucia.createSessionCookie(session.id);

  options
    .getCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { status: "success", data: { userId } };
}

/**
 * @param {unknown} input
 * @param {import("./types").SignUpOptions} options
 */
export function signUpController(input, options) {
  return signUpService(signUpInput(input), options).catch(errorFormatter);
}
