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
  // const prompt = `Provide an in-depth and engaging interpretation of the following dream, using creative language and storytelling techniques to delve into the dream's unique features, underlying meanings, and potential significance. Emphasize psychological insights, cultural/symbolic references, and any special characteristics. Maintain a positive, informative, and empathetic tone.

  // Dream: ${dreamText}

  // Interpretation:`;

  const prompt = `
    Provide an in-depth and engaging interpretation of the following dream, using creative language and storytelling techniques to delve into the dream's unique features, underlying meanings, and potential significance. Emphasize psychological insights, cultural/symbolic references, and any special characteristics. Maintain a positive, informative, and empathetic tone. Ensure that the entire interpretation is included in the response, without any part being cut off or truncated.

    Dream: ${dreamText}

    Interpretation:
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
