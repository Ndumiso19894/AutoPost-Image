export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Serve HTML form at "/"
    if (url.pathname === "/") {
      return new Response(await env.ASSETS.fetch(request), {
        headers: { "Content-Type": "text/html" }
      });
    }

    return new Response("OK");
  }
}
