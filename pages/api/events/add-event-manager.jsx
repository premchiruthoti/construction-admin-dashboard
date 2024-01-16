import { hashPassword } from "@/lib/auth";
import { client } from "@/lib/db";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import slugify from "slugify";

async function handler(req, res) {

  if (req.method === "POST") {
    const userData = req.body;
    console.log(userData);

    const hashedPassword = await hashPassword(userData.password);

    if (
      userData.eventSlug.trim() === "" ||
      userData.name.trim() === "" ||
      userData.username.trim() === "" ||
      userData.password.trim() === ""
    ) {
      res.status(400).json({ message: "Please enter all the input fields" });
    }

    // const dbTableName = userData.eventSlug.replaceAll("-", "_");
    // console.log(dbTableName);

    try {
      // await client.query(
      //   `INSERT INTO admin_users (user_name, password, name, event_slug) VALUES (?, ?, ?, ?)`,
      //   [userData.username, hashedPassword, userData.name, userData.eventSlug]
      // );

      res.status(200).json({ message: "Successfully added event admin." });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if(req.method === 'GET') {
    try {
      const [results, fields] = await client.query(
        "SELECT id, user_name, name, event_slug, created_at FROM admin_users ORDER BY id DESC"
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }
}

export default handler;
