//@ts-nocheck

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OpenAI } from "openai";

const ADMIN_OEPN_API = "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";

export async function aiMagic(base64_image, yourOpenAIKEY = "") {
  let openai;
  if (!yourOpenAIKEY) {
    console.log("ADMIn");
    openai = new OpenAI({
      apiKey: ADMIN_OEPN_API,
      dangerouslyAllowBrowser: true,
    });
  } else {
    console.log("HER HJERE JE R");
    openai = new OpenAI({
      apiKey: yourOpenAIKEY,
      dangerouslyAllowBrowser: true,
    });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
                If the provided image looks like a calendar, please analyze it and provide insights based on the following questions:
  
                1. Based on the calendar entries, what seem to be the person's priorities?
                2. What do you think the person aims to accomplish based on their schedule?
                3. What outcomes or results can the person expect to achieve in their life if they follow this calendar?
                4. What shifts or changes in their routine or priorities would you recommend for better results?
                5. Are there any new efforts or habits you would suggest to help them achieve their goals more effectively?
  
                Please provide specific suggestions, such as:
                - Working out in the morning
                - Wrapping up work by 6 pm
                - Focusing on content creation
  
                Remember, the big things should be prioritized first.
  
                If the provided image does not resemble a calendar, please respond with a humorous and slightly sarcastic message indicating that the input is not a calendar image.
              `,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64_image}`,
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

export async function uploadImage(humanBase64, petBase64) {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ humanBase64: humanBase64, petBase64: petBase64 }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.text();
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      "An error occurred while uploading the image. Please try again."
    );
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};
