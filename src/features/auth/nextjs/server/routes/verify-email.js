import { cookies } from "next/headers";
import { env } from "~/env";
import {
  verifyEmailInput,
  verifyEmailService,
} from "~/features/auth/base/server/features/verify-email";
import { errorFormatter } from "~/features/auth/base/server/libs/error";

/** @param {import("next/server").NextRequest} req */
export async function VerifyEmailGetRoute(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const input = verifyEmailInput({ token: searchParams.get("token") });

    if (!input.token) {
      return Response.json({ error: "Token is not existed" }, { status: 400 });
    }

    const result = await verifyEmailService(input, {
      getCookies: cookies,
      env,
    });

    if (result.status === "redirect") {
      return Response.redirect(
        new URL(
          result.url,
          // /** @type {string} */(process.env.NEXT_PUBLIC_BASE_URL)
        ),
        302,
      );
    }
  } catch (err) {
    const formattedError = errorFormatter(err);
    return Response.json(formattedError, {
      status: formattedError.statusNumber,
    });
  }
}
