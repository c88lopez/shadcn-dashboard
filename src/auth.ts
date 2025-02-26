import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// import type { User } from "@/app/lib/definitions";
// import bcrypt from "bcrypt";

async function getUser(email: string) {
  const validEmail = "admin@vandelay-labs.com";

  if (email !== validEmail) {
    return null;
  }

  return {
    username: "admin",
    email: validEmail,
  };
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
          const { email } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;

          return user;
        }

        return null;
      },
    }),
  ],
});
