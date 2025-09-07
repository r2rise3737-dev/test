export const onRequestGet = () =>
  new Response(JSON.stringify({ ok: true, from: "functions" }), {
    headers: { "content-type": "application/json" }
  });
