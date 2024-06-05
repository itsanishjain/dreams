import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  AI: any;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors());

app.get("/", async (c) => {
  return c.text("Hello Hono!");
});

app.post("/", async (c) => {
  const body = await c.req.json();

  console.log(body);
  const dreamText = body.dreamText;

  const prompt = `
    Provide a direct and concise interpretation of the following dream, focusing on its key symbolic elements, potential psychological meanings, and any notable characteristics. Avoid lengthy introductions or creative storytelling techniques. Maintain an objective and informative tone throughout the interpretation. Ensure that the entire interpretation is included in the response, without any part being cut off or truncated.

    Format the interpretation using Markdown syntax, with appropriate headings, bullet points, and other formatting as needed.

    Dream: ${dreamText}

    ### Interpretation
  `;

  // const prompt = `
  //   Provide a direct and concise interpretation of the following dream, focusing on its key symbolic elements, potential psychological meanings, and any notable characteristics. Avoid lengthy introductions or creative storytelling techniques. Maintain an objective and informative tone throughout the interpretation. Ensure that the entire interpretation is included in the response, without any part being cut off or truncated.

  //   Dream: ${dreamText}

  //   Interpretation:
  // `;

  // const prompt = `
  //   Provide an in-depth and engaging interpretation of the following dream, using creative language and storytelling techniques to delve into the dream's unique features, underlying meanings, and potential significance. Emphasize psychological insights, cultural/symbolic references, and any special characteristics. Maintain a positive, informative, and empathetic tone. Ensure that the entire interpretation is included in the response, without any part being cut off or truncated.

  //   Dream: ${dreamText}

  //   Interpretation:
  // `;

  try {
    const stream = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: prompt,
      stream: true,
    });

    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  } catch (error) {
    console.log(error);
    return c.text("Error");
  }
});

app.post("/analysis", async (c) => {
  const body = await c.req.json();

  const dreamText = body.dreamText;

  const prompt = `Please return the following analysis as JSON, without any additional explanation or text:

Dream: ${dreamText}

{
 "isFunny": [a number between 0-100 representing how funny the dream is],
 "isDark": [a number between 0-100 representing how dark or disturbing the dream is], 
 "isFrightening": [a number between 0-100 representing how frightening the dream is],
 "isAnxious": [a number between 0-100 representing how anxiety-inducing the dream is],
 "isSad": [a number between 0-100 representing how sad the dream is],
 "isJoyful": [a number between 0-100 representing how joyful the dream is],
 "isConfusing": [a number between 0-100 representing how confusing the dream is],
 "isExhilarating": [a number between 0-100 representing how exhilarating the dream is],
 "isEmbarrassing": [a number between 0-100 representing how embarrassing the dream is],
 "isErotic": [a number between 0-100 representing how erotic the dream is],
 "isNostalgic": [a number between 0-100 representing how nostalgic the dream is],
 "isSurreal": [a number between 0-100 representing how surreal the dream is],
 "isLucid": [a number between 0-100 representing how lucid the dream is],
 "isRecurring": [a number between 0-100 representing how recurring the dream is],
 "symbolism": [an array of strings representing any symbolism or symbolic elements in the dream]
}
`;

  try {
    const stream = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: prompt,
      stream: true,
    });

    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
  } catch (error) {
    console.log(error);
    return c.text("Error");
  }
});

export default app;
