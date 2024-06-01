import S3 from "aws-sdk/clients/s3";
import { NextApiRequest, NextApiResponse } from "next";

export const MAX_FILE_UPLOAD_SIZE = 5242880 * 10; // 50MB
export const AWS_BASE_URL = "https://overpassip.s3.amazonaws.com/petmate";
export const AWS_S3_BUCKET_NAME = "overpassip";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: "SMwyXRTzAAWtHyuuu4CZRQBf+Dv/ag2goG8BQ84c",
  secretAccessKey: "AKIAXIQ6HJDMBLKHJLUY",
  signatureVersion: "v4",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = JSON.parse(req.body);
    const awsPath = `${AWS_BASE_URL}/${userId}`;

    let folderName = "petmate";

    const key = `${folderName}/${userId}`;

    const params: S3.PresignedPost.Params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Fields: { key: key },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, MAX_FILE_UPLOAD_SIZE],
      ],
    };

    // const data = s3.createPresignedPost(params);
    s3.createPresignedPost(params, function (err, data) {
      if (err) {
        return res.status(400).json("error");
      } else {
        return res.status(200).json({ data });
      }
    });
    // return res.json({ awsPath, data });
  } catch (err) {
    console.error(err);
    res.status(400).json({ err });
  }
};

export default handler;
