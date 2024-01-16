import { useEffect, useState } from "react";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { keys } from "lodash";
import Image from "next/image";

const client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIASNTMHWBPIEFLT3OT",
    secretAccessKey: "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",
  },
});

const Dashboard = (props) => {
  const [images, getImages] = useState(props.contents);

  useEffect(() => {
    const getAdminSession = async () => {
      const session = await getSession();

      if(session.user.name !== 'admin') {
        signOut();
      }
    }

    getAdminSession()
  },  []);

  return (
    <>
      <div>
        <h1>Dashboard page</h1>
        <p>
          {images.map((image) => (
            <img
              src={`https://construction-network-bucket.s3.ap-south-1.amazonaws.com/${image}`}
              key={image}
              alt=""
            />
          ))}
        </p>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const command = new ListObjectsV2Command({
    Bucket: "construction-network-bucket",
    MaxKeys: 1,
  });

//   try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n");
    let contents = [];
    let data = {};

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);
      //const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
      //contents += contentsList + "\n";
      Contents.map((content) => contents.push(content.Key));
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }

//   } catch (err) {
//     console.error(err);
//   }

  return {
    props: { contents },
  };
}

export default Dashboard;
