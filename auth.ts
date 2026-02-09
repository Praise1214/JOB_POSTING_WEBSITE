import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { prisma } from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";

const basePrismaAdapter = PrismaAdapter(prisma);

// Wrap the PrismaAdapter to handle Twitter's missing email.
// Twitter doesn't return an email, so the adapter's getUserByEmail
// receives undefined and Prisma throws a validation error.
const adapter: Adapter = {
  ...basePrismaAdapter,
  getUserByEmail: async (email: string) => {
    if (!email) return null;
    return basePrismaAdapter.getUserByEmail!(email);
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  adapter,
  session: {
    strategy: "jwt",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>
      ) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),

    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email ?? `${profile.id}@github.oauth`,
          image: profile.avatar_url,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
      profile(profile) {
        const userData = profile.data ?? profile;
        const id = String(userData.id ?? profile.id ?? Date.now());
        const name = String(userData.name ?? profile.name ?? "Twitter User");
        const email = String(userData.email ?? profile.email ?? `${id}@twitter.oauth`);
        const image = (userData.profile_image_url ?? profile.profile_image_url ?? null) as string | null;

        return { id, name, email, image };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add user info to token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
