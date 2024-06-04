//@ts-nocheck
export interface Env {
	AI: any;
}

// const corsHeaders = {
// 	'Access-Control-Allow-Headers': '*',
// 	'Access-Control-Allow-Methods': 'POST',
// 	'Access-Control-Allow-Origin': '*',
// };

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

// addEventListener('fetch', (event) => {
// 	const request = event.request;
// 	const requestHeaders = request.headers;

// 	if (request.method === 'OPTIONS') {
// 		event.respondWith(handleOptions(request));
// 	} else {
// 		event.respondWith(handleRequest(request));
// 	}
// });

// async function handleOptions(request) {
// 	const headers = corsHeaders;
// 	const body = null;
// 	return new Response(body, { headers });
// }

// async function handleRequest(request) {
// 	const response = await fetch(request);
// 	const modifiedResponse = new Response(response.body, response);
// 	Object.entries(corsHeaders).forEach(([key, value]) => {
// 		modifiedResponse.headers.set(key, value);
// 	});
// 	return modifiedResponse;
// }

export default {
	async fetch(request, env): Promise<Response> {
		// let text = await request.text();
		// console.log('Request text:', text);

		// // Check if the request body is empty
		// if (text.trim().length === 0) {
		// 	console.error('Error: Empty request body');
		// 	return new Response('Empty request body', { status: 400 });
		// }

		let dreamText = 'I saw a man is cashing me down seems like he wanna hurt me';
		// try {
		// 	const json = JSON.parse(text);
		// 	dreamText = json.dreamText;
		// } catch (error) {
		// 	console.error('Error parsing JSON:', error);
		// 	return new Response('Invalid JSON input', { status: 400 });
		// }

		console.log('Dream text:', dreamText);

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
			const stream = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
				prompt: prompt,
				stream: true,
			});

			// return new Response(JSON.stringify(stream));
			return new Response(stream, {
				headers: { 'content-type': 'text/event-stream', ...corsHeaders },
			});
			// return new Response(stream, { headers: { 'content-type': 'text/event-stream' } });
		} catch (error) {
			return new Response(error);
		}
	},
} satisfies ExportedHandler<Env>;
