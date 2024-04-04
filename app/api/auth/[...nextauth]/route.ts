import NextAuth from "next-auth"
import { Account, User as AuthUser } from "next-auth";
// import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/lib/models"
import connect from "@/app/lib/utils";
import bcrypt from 'bcryptjs'

export const authOptions: any = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any) {
                await connect();
                try {
                    const user = await User.findOne({ email: credentials.email});
                    
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                        if(isPasswordCorrect){
                            return user;
                        }
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        }),
        // GithubProvider({
        //   clientId: process.env.GITHUB_ID,
        //   clientSecret: process.env.GITHUB_SECRET,
        // }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account: Account }) {
          if (account?.provider == "credentials") {
            return true;
          }
        },
        async jwt({ token, user }: any) {
            // If the user object is available and has an ID, add it to the token
            if (user?.id) {
              token.id = user.id;
            }
            return token;
          },
          async session({ session, token }: any) {
            // Assign the user ID from the token to the session object
            session.user.id = token.id;
            return session;
          },
        
      },
}

export const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}