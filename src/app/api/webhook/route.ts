import { OpenAI } from "openai";
import { ref, set } from "firebase/database";
import realTimeDb from "../../../../firebase";
import crypto from "crypto";

import { AWS_BASE_URL } from "@/lib/constants";

const openai = new OpenAI({
  apiKey: "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",
});

async function vision(image1Url: string, image2Url: string) {
  const prompt = `Given two images, provide a whimsical, lighthearted comparison highlighting any humorous resemblances or contrasts between the subjects, whether physical attributes, expressions, poses, etc. When assigning a similarity score from 0 (no resemblance) to 1 (strong resemblance), base this solely on observable likeness between the two subjects, regardless of whether they are the same species or not. Use no more than 60 words to craft a fun, fanciful narrative drawing an amusing parallel between the images and their score.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: image1Url,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: image2Url,
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

const verifySignature = (
  rawBody: Buffer,
  signature: string,
  secret: string
): boolean => {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const receivedSignature = Buffer.from(signature, "utf8");

  return crypto.timingSafeEqual(digest, receivedSignature);
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const data = JSON.parse(rawBody);

  const signature = request.headers.get("x-signature");
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "123456";

  if (!signature) {
    return new Response("Signature is missing.", {
      status: 400,
    });
  }

  if (!verifySignature(Buffer.from(rawBody), signature, secret)) {
    console.error("Signature verification failed.");
    return new Response("Signature verification failed.", {
      status: 400,
    });
  }

  console.log("Signature verified successfully.");

  const email = data["data"]["attributes"]["user_email"];
  const userId = data["meta"]["custom_data"]["user_id"];

  const image1 = `${AWS_BASE_URL}/${userId}/1.png`;
  const image2 = `${AWS_BASE_URL}/${userId}/2.png`;

  try {
    const result = await vision(image1, image2);
    // Update realtime DB
    set(ref(realTimeDb, "users/" + userId), {
      email: email,
      status: "paid",
      result: result,
    });
    return Response.json("result");
  } catch (err) {
    console.error(err);
    // Update realtime DB
    return Response.json("Error processing image.");
  }
}

export async function GET(request: Request) {
  return Response.json("lemon squeey webhook");
}
