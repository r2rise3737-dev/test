export interface Env {
  BOT_TOKEN: string; // задайте в Cloudflare Pages → Settings → Environment variables
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("id required", { status: 400 });

  // читаем список курсов из того же деплоя
  const coursesResp = await fetch(new URL("/data/courses.json", request.url).toString(), {
    headers: { "cache-control": "no-store" },
  });
  if (!coursesResp.ok) return new Response("courses.json fetch failed", { status: 500 });

  const courses = await coursesResp.json();
  const course = (courses as any[]).find(c => c.id === id);
  if (!course || !Number.isInteger(course.stars) || course.stars <= 0) {
    return new Response("invalid course/stars", { status: 400 });
  }

  // создаём инвойс Stars
  const api = `https://api.telegram.org/bot${env.BOT_TOKEN}/createInvoiceLink`;
  const tgRes = await fetch(api, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: course.label || course.title || id,
      description: course.desc || "Оплата курса",
      payload: `course:${id}:${Date.now()}`,
      currency: "XTR",                        // Stars
      prices: [{ label: "Course", amount: course.stars }], // amount = число звёзд
    }),
  }).then(r => r.json());

  if (!tgRes.ok) return new Response(JSON.stringify(tgRes), { status: 500 });
  return new Response(JSON.stringify({ link: tgRes.result }), {
    headers: { "content-type": "application/json" },
  });
};
