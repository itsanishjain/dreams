import { OpenAI } from "openai";

export const config = {
  api: {
    responseLimit: "8mb",
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
};

const openai = new OpenAI({
  apiKey: "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",
});

// async function main(base64_image) {
//   const response = await openai.chat.completions.create({
//     model: "gpt-4-vision-preview",
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text: `Explain the image`,
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: `data:image/jpeg;base64,${base64_image}`,
//             },
//           },
//         ],
//       },
//     ],
//   });
//   console.log(response.choices[0].message.content);
//   return response.choices[0].message.content;
// }

// // pages/api/upload.js

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { humanBase64, petBase64 } = req.body;

//     if (!humanBase64 && !petBase64) {
//       return res.status(400).send("No image data provided.");
//     }

//     try {
//       const r = await main(humanBase64); // Assuming `main` is your processing logic function
//       return res.send(r);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).send("Error processing image.");
//     }
//   } else {
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// async function main(humanBase64, petBase64) {
//   const prompt = `We have two images, one of a human and one of a pet. People often choose pets that look like them. Analyze these images and rate their similarity on a scale from 0 to 1, where 1 is very similar. Also, provide a fun and memeable explanation of how they are similar or different. Here are the images:`;

//   const response = await openai.chat.completions.create({
//     model: "gpt-4-vision-preview",
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "text",
//             text: prompt,
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: `data:image/jpeg;base64,${humanBase64}`,
//             },
//           },
//           {
//             type: "image_url",
//             image_url: {
//               url: `data:image/jpeg;base64,${petBase64}`,
//             },
//           },
//         ],
//       },
//     ],
//   });

//   console.log(response.choices[0].message.content);
//   return response.choices[0].message.content;
// }

async function main(humanBase64, petBase64) {
  // const prompt = `We have two images: one of a person and their pet. It's often said that pets and their owners can share amusing similarities. Could you create a light-hearted and fun narrative or meme about any resemblance or amusing contrast you might find between these two images? Please rate the resemblance on a scale from 0 to 1, where 1 is very similar, and add a fun twist to your explanation.`;

  // const prompt = `We have two images: one featuring a person alongside their beloved pet. It's often said that pets and their owners can share amusing similarities. Imagine the bond between these two and create a light-hearted and fun narrative or meme that captures any resemblance or amusing contrast you might find. Feel free to add a humorous twist to your explanation. How closely do you think they resemble each other on a scale from 0 to 1, where 1 signifies a strong similarity?`;

  // const prompt = `Explain the given images under 60 words. do the whimsical comparison between two images and give a score between 0 and 1 where 1 signifies a strong similarity and please don't account distinctly different subjects like if one is human and other is cat or dog etc for scoring`;

  // const prompt = `Given two images, provide a whimsical, lighthearted comparison highlighting any humorous resemblances or contrasts between the subjects, whether physical attributes, expressions, poses, etc. Avoid making comparisons between distinctly different subjects like humans and animals. Assign a similarity score from 0 (no resemblance) to 1 (strong resemblance) based solely on the likeness between the two subjects. Use no more than 60 words to craft a fun, fanciful narrative drawing an amusing parallel between the images and theirScore`;

  const prompt = `Given two images, provide a whimsical, lighthearted comparison highlighting any humorous resemblances or contrasts between the subjects, whether physical attributes, expressions, poses, etc. When assigning a similarity score from 0 (no resemblance) to 1 (strong resemblance), base this solely on observable likeness between the two subjects, regardless of whether they are the same species or not. Use no more than 60 words to craft a fun, fanciful narrative drawing an amusing parallel between the images and their score.`;

  // const prompt = `
  // Given two images, provide a whimsical, lighthearted comparison highlighting any humorous resemblances or contrasts between the subjects, whether physical attributes, expressions, poses, etc. When assigning a similarity score from 0 (no resemblance) to 1 (strong resemblance), base this solely on observable likeness between the two subjects, regardless of whether they are the same species or not. The output should be in the following format:
  // text: "<whimsical comparison narrative in 60 words or less>"
  // score: <similarity score between 0 and 1>
  // For example:
  // text: "The shaggy pooch and unkempt human share a delightfully disheveled look, with errant tufts of hair seeming to defy gravity."
  // score: 0.9`;

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
              url: `data:image/jpeg;base64,${humanBase64}`,
            },
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${petBase64}`,
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0].message.content);
  return response.choices[0].message.content;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { humanBase64, petBase64 } = req.body;

    if (!humanBase64 || !petBase64) {
      return res.status(400).send("No image data provided.");
    }

    try {
      const result = await main(humanBase64, petBase64);
      return res.send(result);
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error processing image.");
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
