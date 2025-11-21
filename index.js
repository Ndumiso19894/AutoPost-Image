export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Show upload page
    if (request.method === "GET" && url.pathname === "/") {
      return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Upload Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial; padding: 40px;">
        <h2>Upload Your Photo</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
          <input type="file" name="file" accept="image/*" required>
          <br><br>
          <button type="submit">Upload</button>
        </form>
      </body>
      </html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // Handle upload
    if (request.method === "POST" && url.pathname === "/upload") {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!file) {
        return new Response("No file uploaded", { status: 400 });
      }

      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);

      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      await env.BRAND_IMG.put("photo", btoa(binary));

      return new Response("<h2>Uploaded ✔️</h2>", {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Show stored photo
    if (request.method === "GET" && url.pathname === "/test-image") {
      const b64 = await env.BRAND_IMG.get("photo");

      if (!b64) {
        return new Response("No image saved", { status: 404 });
      }

      const bin = atob(b64);
      const len = bin.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = bin.charCodeAt(i);
      }

      return new Response(bytes, {
        headers: { "Content-Type": "image/jpeg" }
      });
    }

    return new Response("OK");
  }
};
