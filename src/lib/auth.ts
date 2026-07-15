import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import connectDb from "./db";
import User from "@/model/user.model";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;
      
          console.log("Login email:", email);
          console.log("Password received:", Boolean(password));
      
          if (!email || !password) {
            throw new Error("Email and password are required");
          }
      
          await connectDb();
      
          const user = await User.findOne({ email }).select("+password");
      
          console.log("User found:", Boolean(user));
          console.log("Password exists:", Boolean(user?.password));
      
          if (!user) {
            throw new Error("User not found");
          }
      
          if (!user.password) {
            throw new Error(
              "This account was created with Google. Please sign in with Google."
            );
          }
      
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
      
          console.log("Password matched:", isPasswordCorrect);
      
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }
      
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
          };
        } catch (error) {
          console.error("Authorize failed:", error);
          throw error;
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      if (!user.email) {
        return false;
      }

      await connectDb();

      const email = user.email.trim().toLowerCase();

      let databaseUser = await User.findOne({ email });

      if (!databaseUser) {
        databaseUser = await User.create({
          name: user.name || "Google User",
          email,
          image: user.image || "",
          provider: "google",
        });
      }

      // MongoDB user-এর আসল ID session/JWT-তে পাঠানো হবে
      user.id = databaseUser._id.toString();
      user.name = databaseUser.name;
      user.email = databaseUser.email;
      user.image = databaseUser.image || user.image;

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
    
      if (trigger === "update" && session) {
        if (session.name) {
          token.name = session.name;
        }
    
        if (session.image !== undefined) {
          token.picture = session.image;
        }
      }
    
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name || "User";
        session.user.email = token.email || "";
        session.user.image =
          typeof token.picture === "string"
            ? token.picture
            : null;
      }
    
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;