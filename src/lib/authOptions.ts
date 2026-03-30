import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import UserModel from "@/model/User";

export  const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
         identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },

      },
      async authorize(credentials, req): Promise<any> {
        const identifier = credentials?.identifier

        const password = credentials?.password;


        if (!identifier || !password) {
          throw new Error("email or password is not found");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials?.identifier }, { username: credentials?.identifier }],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
