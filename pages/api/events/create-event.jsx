import { client } from "@/lib/db";
import { getSession } from "next-auth/react";
import slugify from "slugify";

async function handler(req, res) {

  if (req.method === "POST") {
    const eventData = req.body;

    if (
      eventData.eventName.trim() === "" ||
      eventData.eventSlug.trim() === ""
    ) {
      res.status(400).json({ message: "Please enter all the input fields" });
    }

    const eventSlug = slugify(eventData.eventSlug.toLowerCase());

    try {
      await client.query(
        "INSERT INTO events (event_name, slug) VALUES (?, ?)",
        [eventData.eventName, eventSlug]
      );
      res.status(200).json({ message: "Successfully added event" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if (req.method === "GET") {
    try {
      const [results, fields] = await client.query(
        "SELECT * FROM events ORDER BY id DESC"
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }
}

export default handler;
