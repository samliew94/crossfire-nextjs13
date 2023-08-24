import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
const jwt = require("jsonwebtoken");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
      },
      async authorize(credentials, req) {
        if (
          credentials &&
          credentials.username &&
          credentials.username.length > 1
        ) {
          const username = credentials.username;

          const user = {
            id: username,
            name: username,
            email: `${username}@crossfire.com`,
          };

          return user;
        }

        return null;
      },
    }),
  ],
  jwt: {
    async encode({ token }) {
      console.log(`encoding token=${token}`);

      return jwt.sign(token as {}, process.env.NEXTAUTH_SECRET);
    },
    async decode({ token }) {
      return jwt.verify(token!, process.env.NEXTAUTH_SECRET!) as JWT;
    },
  },
  callbacks: {
    async jwt({ token }) {
      return {
        name: token.name,
      };
    },
    async session({ session, token }) {
      console.log(`session callback token=${JSON.stringify(token)}`);
      session.user = token as any;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
