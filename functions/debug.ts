export const onRequest: PagesFunction = () =>
  new Response("ok: functions are running", {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
