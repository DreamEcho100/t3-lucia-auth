import { db } from "~/server/db";
// import { hash, verify } from "@node-rs/argon2";
import { lucia } from "../../libs/lucia";
import { createAsyncId } from "~/utils/createId";
import { users } from "~/server/db/schema";
import { hash } from "../../libs/hash";

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
    .getServerCookies()
    .set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return { status: "success", data: { userId } };
}
