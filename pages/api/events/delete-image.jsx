import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({});

async function handler(req, res) {
  if(req.method === 'DELETE') {
    console.log(req.body)
    const command = new DeleteObjectCommand({
      Bucket: "construction-network-bucket",
      Key: req.body.key,
    });
  
    try {
      const response = await client.send(command);
      if(response.$metadata.httpStatusCode === 204 ){
        res.status(200).json({message: "Image successfully deleted."})
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default handler