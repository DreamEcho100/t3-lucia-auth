import { and, eq, getTableColumns } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type AdapterAccount, type AdapterSession } from "next-auth/adapters";
import { type VerificationToken } from "next-auth/adapters";
import { type AdapterUser, type Adapter } from "next-auth/adapters";
// import { type AdapterAuthenticator } from "@auth/core/adapters";
import GithubProvider from "next-auth/providers/github";
import {
  type DefaultPostgresSchema,
  defineTables,
} from "node_modules/@auth/drizzle-adapter/lib/pg";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";
import { createAsyncId } from "~/utils/createId";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PostgresDrizzleAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Github provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

function PostgresDrizzleAdapter(
  client: typeof db,
  // schema?: DefaultPostgresSchema,
): Adapter {
  // const {
  //   usersTable,
  //   accountsTable,
  //   sessionsTable,
  //   verificationTokensTable,
  //   // authenticatorsTable,
  // } = defineTables(schema);

  const usersTable = users;
  const accountsTable = accounts;
  const sessionsTable = sessions;
  const verificationTokensTable = verificationTokens;

  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      const insertData = data;

      return client
        .insert(usersTable)
        .values({ ...insertData, id: await createAsyncId() })
        .returning()
        .then((res) => res[0]!);
    },
    async getUser(userId: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then((res) => (res.length > 0 ? res[0]! : null));
    },
    async getUserByEmail(email: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then((res) => (res.length > 0 ? res[0]! : null));
    },
    async createSession(data: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) {
      return client
        .insert(sessionsTable)
        .values({
          id: data.sessionToken,
          expiresAt: data.expires,
          userId: data.userId,
        })
        .returning()
        .then((res) => {
          const data = res[0]!;

          return {
            // id: data.id,
            sessionToken: data.id,
            userId: data.userId,
            expires: data.expiresAt,
          };
        });
    },
    async getSessionAndUser(sessionToken: string) {
      return client
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.id, sessionToken))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
        .then((res) => {
          // (res.length > 0 ? res[0]! : null)
          if (res.length === 0) {
            return null;
          }

          const data = res[0]!;

          return {
            user: data.user,
            session: {
              sessionToken: data.session.id,
              userId: data.session.userId,
              expires: data.session.expiresAt,
            },
          };
        });
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.");
      }

      const [result] = await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning();

      if (!result) {
        throw new Error("No user found.");
      }

      return result;
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
    ) {
      return client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.id, data.sessionToken))
        .returning()
        .then((res) => {
          if (res.length === 0) {
            return null;
          }

          const data = res[0]!;

          return {
            sessionToken: data.id,
            userId: data.userId,
            expires: data.expiresAt,
          };
        });
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountsTable).values(data);
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      const result = await client
        .select({
          account: accountsTable,
          user: usersTable,
        })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId),
          ),
        )
        .then((res) => res[0]!);

      return result?.user ?? null;
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionsTable)
        .where(eq(sessionsTable.id, sessionToken));
    },
    async createVerificationToken(data: VerificationToken) {
      return client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .then((res) => res[0]!);
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return client
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token),
          ),
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0]! : null));
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id));
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) {
      await client
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId),
          ),
        );
    },
    // async getAccount(providerAccountId: string, provider: string) {
    //   return client
    //     .select()
    //     .from(accountsTable)
    //     .where(
    //       and(
    //         eq(accountsTable.provider, provider),
    //         eq(accountsTable.providerAccountId, providerAccountId),
    //       ),
    //     )
    //     .then((res) => res[0]! ?? null) as Promise<AdapterAccount | null>;
    // },
    // async createAuthenticator(data: AdapterAuthenticator) {
    //   return client
    //     .insert(authenticatorsTable)
    //     .values(data)
    //     .returning()
    //     .then((res) => res[0]! ?? null);
    // },
    // async getAuthenticator(credentialID: string) {
    //   return client
    //     .select()
    //     .from(authenticatorsTable)
    //     .where(eq(authenticatorsTable.credentialID, credentialID))
    //     .then((res) => res[0]! ?? null);
    // },
    // async listAuthenticatorsByUserId(userId: string) {
    //   return client
    //     .select()
    //     .from(authenticatorsTable)
    //     .where(eq(authenticatorsTable.userId, userId))
    //     .then((res) => res);
    // },
    // async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
    //   const authenticator = await client
    //     .update(authenticatorsTable)
    //     .set({ counter: newCounter })
    //     .where(eq(authenticatorsTable.credentialID, credentialID))
    //     .returning()
    //     .then((res) => res[0]!);

    //   if (!authenticator) throw new Error("Authenticator not found.");

    //   return authenticator;
    // },
  };
}
