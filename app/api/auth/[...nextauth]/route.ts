// Example NextAuth configuration using environment variables

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/lib/models";
import connect from "@/app/lib/utils";
import bcrypt from 'bcryptjs';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
              return Promise.resolve(user); // Ensure to return a promise
            } else {
              throw new Error('Invalid password');
            }
          } else {
            throw new Error('No user found with the provided email');
          }
        } catch (error: any) {
          console.error('Error during authorization:', error);
          throw new Error('Error during authorization');
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }:any) {
      if (user?.id) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }:any) {
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
