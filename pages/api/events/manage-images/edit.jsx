import { client } from "@/lib/db";

async function handler(req, res) {
  if (req.method === "GET") {
    const editionId = req.query.editionId;

    try {
      const [results, fields] = await client.query(
        "SELECT * FROM event_images WHERE id = ?",
        [editionId]
      );
      res.status(200).json(results);
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }

  if (req.method === "PATCH") {
    const id = req.body.id;
    const editionId = req.body.shortName;
    const imagePath = req.body.key;
    const altTitle = req.body.altTitle;

    try {
      await client.query(
        `UPDATE event_images SET edition_id = ?, event_image_path = ?, event_image_alt_text = ? WHERE id = ?`,
        [editionId, imagePath, altTitle, id]
      );
      res.status(200).json({ message: "Updated successfully." });
    } catch (err) {
      res.status(500).json({ message: err.sqlMessage });
    }
  }
}

export default handler;
