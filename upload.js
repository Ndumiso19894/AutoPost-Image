export async function onRequestPost(context) {
  const request = context.request;
  const env = context.env;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response("No file received", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  let binary = "";
  for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
  const base64 = btoa(binary);

  await env.BRAND_IMG.put("photo", base64);

  return new Response("<h2>Uploaded ✔️</h2>", {
    headers: { "Content-Type": "text/html" }
  });
}

export async function onRequestGet(context) {
  return new Response("Use POST to upload.");
}
