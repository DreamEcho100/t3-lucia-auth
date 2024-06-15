import { unstable_cache as cache } from "next/cache";
import { validateRequestService as baseValidateRequest } from "../../base/server/features/validate-request/index.js";
import { cookies } from "next/headers";

export const validateRequest = cache(async () => {
  try {
    return await baseValidateRequest(cookies);
  } catch (error) {
    console.error(error);
    // Next.js throws error when attempting to set cookies when rendering page
    return { user: null, session: null };
  }
});
