import { S3, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import formidable from "formidable";
import { Transform } from "stream";

const s3 = new S3({ region: "ap-south-1" });

async function handler(req, res) {
  if (req.method === "DELETE") {
    console.log(req);
  }
  return new Promise((resolve, reject) => {
    if (req.method === "POST") {
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024,
        allowEmptyFiles: false,
      });

      let randomNumber = Math.floor(Math.random() * 10000);

      form.parse(req, (err, fields, files) => {});

      form.on("fileBegin", async (formName, file) => {
        console.log(file);

        const extension = file.originalFilename.split(".");
        const slugImage = extension[0].trim().replace(" ", "-").toLowerCase();
        const fileName = `${slugImage}-${randomNumber}.${extension[1]}`;

        console.log(fileName);

        file.open = async function () {
          this._writeStream = new Transform({
            transform(chunk, encoding, callback) {
              callback(null, chunk);
            },
          });

          this._writeStream.on("error", (e) => {
            form.emit("error", e);
          });

          // upload to S3
          try {
            const parallelUploads3 = new Upload({
              client: new S3({}) || new S3Client({}),
              params: {
                ACL: "public-read",
                Bucket: "construction-network-bucket",
                Key: `${fileName}`,
                Body: this._writeStream,
                ContentType: this.mimetype,
              },
              // tags: [], // optional tags
              // queueSize: 4, // optional concurrency configuration
              // partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
              // leavePartsOnError: false, // optional manually handle dropped parts
            });
            parallelUploads3.on("httpUploadProgress", async (progress) => {
              //await getEventImagePath({ imagePath: progress.Key });
              //console.log(progress);
            });

            await parallelUploads3.done();
            res.status(200).json({ success: "Image Uploaded successfully" });
          } catch (e) {
            console.log(e);
          }
        };
      });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
