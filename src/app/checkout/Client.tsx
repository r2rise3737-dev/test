"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Если переменная не задана — используем надежный fallback на серверный редирект
const MENU_POST = process.env.NEXT_PUBLIC_MENU_POST || "/api/order";

// Карта курсов (название + цена в ₽). Тексты внутри карточки — единые «продающие».
const COURSES: Record<string, { title: string; rub: number }> = {
  // TAROT
  "tarot-basic": { title: "Таро с нуля: базовая система", rub: 5500 },
  "pro-interpretation": { title: "Профи-интерпретация раскладов", rub: 12000 },
  "love-money-spreads": { title: "Расклады для отношений и денег", rub: 18000 },
  "tarot-for-brands": { title: "Таро для блогеров и брендов", rub: 26000 },
  "master-diagnostics": { title: "Мастер-уровень: диагностика и стратегия", rub: 35000 },
  // ASTRO
  "astro-basic": { title: "Астрология с нуля", rub: 6500 },
  "astro-profi": { title: "Профи-разбор натальных карт", rub: 14000 },
  "astro-synastry": { title: "Синастрия и совместимость", rub: 20000 },
  "astro-prognostics": { title: "Прогностика: транзиты и хорар", rub: 27000 },
  "astro-blog-business": { title: "Астрология для блога и бизнеса", rub: 33000 },
};

const SUBTITLE = "Доступ к материалам, живые разборы и сопровождение наставника";
const BENEFITS = [
  "Практические модули + разборы кейсов каждую неделю",
  "Структура без воды: алгоритмы, шаблоны, реальные запросы",
  "Поддержка в чате и чек-листы по шагам",
  "Если что-то не зайдёт — поможем решить вопрос",
];

const nf = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default function CheckoutClient() {
  const sp = useSearchParams();
  const courseId = sp.get("courseId") || sp.get("courseld") || "";
  const course = courseId ? COURSES[courseId] : undefined;

  if (!course) {
    return (
      <div className="min-h-screen" style={{ background: "#f8f5ef" }}>
        <div className="mx-auto max-w-[1080px] px-6 py-12">
          <h1 className="text-[36px] leading-tight font-semibold text-[#2f2619]">
            Оформление доступа
          </h1>
          <p className="mt-4 text-[#5b4a33]">
            Курс не найден. Вернитесь на главную и выберите программу.
          </p>
          <div className="mt-6">
            <Link className="underline" href="/">← На главную</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f8f5ef" }}>
      <div className="mx-auto max-w-[1080px] px-6 py-12">
        <h1 className="text-[36px] leading-tight font-semibold text-[#2f2619]">
          Оформление доступа
        </h1>

        <article
          className="mt-6 rounded-[22px] border bg-white/85 backdrop-blur shadow-[0_14px_36px_rgba(47,38,25,0.08)]"
          style={{ borderColor: "#eadfcf" }}
        >
          <div className="p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-[22px] lg:text-[24px] font-semibold text-[#2f2619]">
                {course.title}
              </h2>
              <p className="mt-1 text-[14px] lg:text-[15px] text-[#6b5a43]">
                {SUBTITLE}
              </p>

              <ul className="mt-4 space-y-2 text-[#3c2f1e]">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[7px] block h-[6px] w-[6px] rounded-full bg-[#bfa06b]" />
                    <span className="text-[15px] lg:text-[16px] leading-[1.5]">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col lg:items-end justify-start">
              <div className="flex items-center justify-between w-full lg:w-auto">
                <div className="text-[24px] lg:text-[28px] font-semibold text-[#2f2619]">
                  {nf(course.rub)} ₽
                </div>

                <a
                  href={MENU_POST}
                  rel="nofollow"
                  className="ml-4 inline-flex items-center rounded-[14px] px-5 py-3 text-[14px] font-semibold transition-transform active:scale-[0.98]"
                  style={{
                    background:
                      "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                    color: "#2f271a",
                    boxShadow:
                      "0 18px 36px rgba(191,150,93,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
                    filter: "drop-shadow(0 12px 24px rgba(153,122,70,0.25))",
                  }}
                >
                  Получить доступ
                </a>
              </div>

              <p className="mt-5 text-[13px] leading-[1.45] text-[#6b5a43] max-w-[420px] text-left lg:text-right">
                Оплата проходит в официальной инфраструктуре Telegram Stars (StarsPay).
                Данные карт нам не передаются.
              </p>
            </div>
          </div>
        </article>

        <div className="mt-8">
          <Link href="/" className="text-[#6b5a43] text-[14px] underline">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
