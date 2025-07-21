import NextAuth, { User } from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { CredentialsSignin } from "@auth/core/errors";

async function getUser(email: string, password: string) {
  const authLoginResponse = await fetch(`${process.env.AUTH_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (authLoginResponse.status === 401) {
    throw new CredentialsSignin("Invalid credentials");
  }

  const { access_token: accessToken } = await authLoginResponse.json();

  return { id: accessToken };
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email, password);

          if (!user) return null;

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (!user) {
        return token;
      }

      return {
        ...token,
        accessToken: (user as unknown as User & { accessToken: string })
          .accessToken,
      };
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, id: token.sub },
      };
    },
  },
});
