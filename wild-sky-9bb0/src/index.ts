/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 *
 */

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "AI" with the variable name you defined.
	AI: any;
}

export default {
	async fetch(request, env): Promise<Response> {
		console.log('>>>>>>>>>>>', env);
		const stream = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
			prompt: 'why we dream?',
			stream: true,
		});

		return new Response(stream, {
			headers: { 'content-type': 'text/event-stream' },
		});
	},
} satisfies ExportedHandler<Env>;
