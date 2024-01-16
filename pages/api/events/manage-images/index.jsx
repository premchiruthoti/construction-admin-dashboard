import { client } from "@/lib/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const slug = req.body.slug;
    const shortName = req.body.shortName;
    const altTitle = req.body.altTitle;
    const imagePath = req.body.imagePath;

    try {
      await client.query(
        `INSERT INTO event_images (slug, edition_id, event_image_path, event_image_alt_text)
        VALUES (?, ?, ?, ?)`,
        [slug, shortName, imagePath, altTitle]
      );
      res.status(200).json({ message: "Successfully added image." });
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if (req.method === "GET") {
    const slug = req.query.slug;
    try {
      const [results, fields] = await client.query(
        "SELECT * FROM event_images WHERE slug = ? ORDER BY id DESC",
        [slug]
      );
      console.log(results)
      res.status(200).json(results);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if(req.method === 'PATCH') {
    const editionId = req.body.editionId

    if (req.body.isFeatured !== undefined) {
      const isFeatured = req.body.isFeatured;
      try {
        await client.query(
          "UPDATE event_images SET is_featured = ? WHERE id = ?",
          [isFeatured, editionId]
        );
        res.status(200).json({ message: "Updated successfully." });
      } catch (err) {
        res.status(500).json({ message: err.sqlMessage });
      }
    }
  }
}

export default handler;
