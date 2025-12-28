import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "./app/generated/prisma";

const prisma = new PrismaClient();

export const {auth, handlers, signIn, signOut} = NextAuth({
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

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
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

    GitHub, 
    Google({ clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,}), 
    Twitter({ clientId: process.env.AUTH_TWITTER_ID!,
    clientSecret: process.env.AUTH_TWITTER_SECRET!,})],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token
    },

    async session({session, token}) {
      if(session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string
      }
      return session
    }
  }
})

