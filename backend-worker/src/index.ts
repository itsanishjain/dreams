import { Hono } from "hono";
import { cors } from "hono/cors";

export interface Env {
  AI: any;
}

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
			Provide an in-depth and engaging interpretation of the following dream, including numeric analysis for "darkness" and "funny" aspects, and any other relevant insights. Return the interpretation and analysis in JSON format.

			Dream: ${dreamText}

			Interpretation:
			Use creative language and storytelling techniques to delve into the dream's unique features, underlying meanings, and potential significance. Emphasize psychological insights, cultural/symbolic references, and any special characteristics. Maintain a positive, informative, and empathetic tone.

			Analysis:
			- Dark: [a number between 0-100]
			- Funny: [a number between 0-100]
			- Additional Analysis: [any other relevant metrics or insights]
			`;

  try {
    const stream = await c.env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: prompt,
      stream: true,
    });

    // return new Response(JSON.stringify(stream));
    return new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    });
    // return new Response(stream, { headers: { 'content-type': 'text/event-stream' } });
  } catch (error) {
    console.log(error);
    return c.text("Error");
  }
});

export default app;
