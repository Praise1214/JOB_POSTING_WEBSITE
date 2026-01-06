import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { prisma } from "./lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
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
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, create or update user in database
      if (account?.provider !== "credentials" && account) {
        try {
          // Use email if available, otherwise generate one from provider account ID
          const userEmail = user.email || `${account.providerAccountId}@${account.provider}.oauth`;
          
          console.log("[Auth] OAuth signIn - provider:", account.provider);
          console.log("[Auth] OAuth signIn - userEmail:", userEmail);
          console.log("[Auth] OAuth signIn - providerAccountId:", account.providerAccountId);
          
          const existingUser = await prisma.user.findUnique({
            where: { email: userEmail },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: userEmail,
                name: user.name || account.provider + " User",
                image: user.image,
              },
            });
            console.log("[Auth] Created new user:", userEmail);
          } else {
            console.log("[Auth] User exists:", userEmail);
          }
          
          // Update user object with the email so it's available in jwt callback
          user.email = userEmail;
        } catch (error) {
          console.error("[Auth] Error saving OAuth user to database:", error);
          // Still allow sign in even if database save fails
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
