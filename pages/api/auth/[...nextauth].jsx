import { verifyPassword } from "@/lib/auth";
import { client } from "@/lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const username = credentials.username;
        if (credentials.username === "admin") {
          const [user, fields] = await client.query(
            "SELECT * FROM admin_users WHERE user_name = ?",
            [username]
          );

          if (user.length === 0) {
            throw new Error("No user found!");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user[0].password
          );

          if (!isValid) {
            throw new Error("Could not log you in");
          }

          return { name: user[0].user_name };
        }
        else if(credentials.username !== "admin") {
          const username = credentials.username;
          const eventSlug = credentials.slug;

          const [user, fields] = await client.query(
            "SELECT * FROM admin_users WHERE user_name = ? AND event_slug = ?",
            [username, eventSlug]
          );

          if (user.length === 0) {
            throw new Error("No user found!");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user[0].password
          );

          if (!isValid) {
            throw new Error("Could not log you in");
          }

          return { name: user[0].user_name };
        }
      },
    }),
  ],
});
