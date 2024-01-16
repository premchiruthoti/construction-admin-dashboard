import { client } from "@/lib/db";

async function handler(req, res) {
  if (req.method === "GET") {
    const eventId = req.query.eventId;

    try {
      const [results, fields] = await client.query(
        "SELECT * FROM events_manage_editions WHERE id = ?",
        [eventId]
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if (req.method === "PATCH") {
    console.log(req.body);

    const eventId = req.body.eventId;
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
        `UPDATE events_manage_editions SET 
          year = ?,
          short_name = ?,
          edition_title = ?,
          main_title = ?,
          start_date = ?,
          end_date = ?,
          city = ?,
          country = ?,
          description = ?,
          meta_title = ?,
          meta_keywords = ?,
          meta_description = ? 
          WHERE id = ?`,
        [
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
          eventId,
        ]
      );
      res.status(200).json({ message: "Updated successfully." });
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
    res.status(200).json({ message: "Updated successfully." });
  }
}

export default handler;
