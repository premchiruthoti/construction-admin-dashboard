import { client } from "@/lib/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const errorMessage = {
      year: "",
      shortName: "",
      mainTitle: "",
      date: "",
      city: "",
    };

    if (
      req.body.year.trim() === "" ||
      req.body.shortName.trim() === "" ||
      req.body.mainTitle.trim() === "" ||
      req.body.startDate.trim() === 0 ||
      req.body.endDate.trim() === 0 ||
      req.body.city.trim() === 0
    ) {
      req.body.year.trim() === ""
        ? (errorMessage.year = "This field is required.")
        : "";
      req.body.shortName.trim() === ""
        ? (errorMessage.shortName = "This field is required.")
        : "";
      req.body.mainTitle.trim() === ""
        ? (errorMessage.mainTitle = "This field is required.")
        : "";
      req.body.startDate.trim() === ""
        ? (errorMessage.date = "This field is required.")
        : "";
      req.body.city.trim() === ""
        ? (errorMessage.city = "This field is required.")
        : "";

      res.status(400).json(errorMessage);
    } else {
      const slug = req.body.slug;
      const year = req.body.year;
      const shortName = req.body.shortName;
      const editionTitle = req.body.editionTitle;
      const mainTitle = req.body.mainTitle;
      const startDate = req.body.startDate.split("T").shift();
      const endDate = req.body.endDate.split("T").shift();
      const city = req.body.city;
      const country = req.body.country;
      const description = req.body.description;
      const metaTitle = req.body.metaTitle;
      const metaKeywords = req.body.metaKeywords;
      const metaDescription = req.body.metaDescription;

      try {
        await client.query(
          `INSERT INTO events_manage_editions
        (slug, year, short_name, edition_title, main_title, start_date, end_date, city, country, description, meta_title, meta_keywords, meta_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          [
            slug,
            year,
            shortName,
            editionTitle,
            mainTitle,
            startDate,
            endDate,
            city,
            country,
            description,
            metaTitle,
            metaKeywords,
            metaDescription,
          ]
        );
        res.status(200).json({ message: "Successfully added event data." });
      } catch (err) {
        res.status(500).json({ message: err.sqlMessage });
      }
    }
  }

  if (req.method === "GET") {
    const slug = req.query.slug;
    try {
      const [results, fields] = await client.query(
        "SELECT * FROM events_manage_editions WHERE slug = ? ORDER BY id DESC",
        [slug]
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if (req.method === "PATCH") {
    const eventId = req.body.eventId;
    if (req.body.isFeatured !== undefined) {
      const isFeatured = req.body.isFeatured;
      try {
        await client.query(
          "UPDATE events_manage_editions SET is_featured = ? WHERE id = ?",
          [isFeatured, eventId]
        );
        res.status(200).json({ message: "Updated successfully." });
      } catch (err) {
        res.status(500).json({ message: err.sqlMessage });
      }
    }

    if (req.body.featuredInPastEvent !== undefined) {
      const featuredInPastEvent = req.body.featuredInPastEvent;
      try {
        await client.query(
          "UPDATE events_manage_editions SET featured_in_past_event = ? WHERE id = ?",
          [featuredInPastEvent, eventId]
        );
        res.status(200).json({ message: "Updated successfully." });
      } catch (err) {
        res.status(500).json({ message: err.sqlMessage });
      }
    }
  }
}

export default handler;
