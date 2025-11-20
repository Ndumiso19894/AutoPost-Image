export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      const html = `<!DOCTYPE html><html><head><title>Upload Your Brand Image</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
      body { font-family: Arial; background:#f2f2f2; padding:20px; }
      .box { max-width:400px; margin:40px auto; background:white; padding:24px;
             border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.1); }
      button { width:100%; padding:12px; background:black; color:white;
               border:none; border-radius:8px; font-weight:bold; }
      </style>
      </head><body>
      <div class="box">
        <h2>Upload Your Photo</h2>
        <form action="/upload" method="POST" enctype="multipart/form-data">
          <input type="file" name="file" accept="image/*" required><br><br>
          <button type="submit">Upload</button>
        </form>
      </div></body></html>`;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    if (request.method === "POST" && url.pathname === "/upload") {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file) return new Response("No file", { status: 400 });

      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      let binary = "";
      for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
      const base64 = btoa(binary);

      await env.BRAND_IMG.put("photo", base64);

      return new Response("<h2>Uploaded ✔️</h2>", { headers: { "Content-Type": "text/html" } });
    }

    if (request.method === "GET" && url.pathname === "/test-image") {
      const base64 = await env.BRAND_IMG.get("photo");
      if (!base64) return new Response("No image uploaded", { status: 404 });

      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

      return new Response(bytes, { headers: { "Content-Type": "image/jpeg" } });
    }

    return new Response("OK");
  }
}
