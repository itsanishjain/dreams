import S3 from "aws-sdk/clients/s3";

import {
  MAX_FILE_UPLOAD_SIZE,
  AWS_BASE_URL,
  AWS_S3_BUCKET_NAME,
} from "@/lib/constants";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: "AKIAXIQ6HJDMBLKHJLUY",
  secretAccessKey: "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",
  signatureVersion: "v4",
});

export async function POST(request: Request) {
  const { userId, name } = await request.json();

  const key = `petmate/${userId}/${name}`;
  try {
    const params: S3.PresignedPost.Params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Fields: { key: key },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, MAX_FILE_UPLOAD_SIZE],
      ],
    };

    const data = s3.createPresignedPost(params);
    const awsPath = `${AWS_BASE_URL}/${userId}/${name}`;
    return Response.json({ data, awsPath });
  } catch (err) {
    console.error(err);
    return Response.json("Error processing image."); // error
  }
}

export async function GET(request: Request) {
  return Response.json("S3 API");
}
