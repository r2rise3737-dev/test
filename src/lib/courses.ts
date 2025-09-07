// src/lib/courses.ts
// Единый каталог курсов для сайта и бота.
// Цены в звёздах рассчитаны из рублей по ~1.6 ₽/⭐ и округлены до “красивых” чисел.
// При желании курс пересчёта можно поменять позже и перезапустить фронт/бота.

export type Course = {
  id: string;                               // стабильный ID (совпадает с HomeClient.tsx)
  title: string;                            // название курса
  stars: number;                            // цена в звёздах (XTR)
  category: "Таро" | "Астрология";          // направление
  level: "Старт" | "Middle" | "Практика" | "Продвинутый" | "Pro";
  duration: string;                         // для отображения
  includesPrev?: boolean;                   // включает ли предыдущие уровни
  fileId?: string;                          // Telegram file_id ZIP (рекомендуется)
  fileUrl?: string;                         // альтернатива: HTTPS-ссылка на ZIP
};

const TEST_FILE_ID = "BQACAgIAAxkBAAMSaK99AAHVtb-oV7CfAileCeLkn1bfAAIQkAACFnaASWhpKpWXMqRuNgQ";

export const COURSES: Record<string, Course> = {
  // ==== ТАРО ====
  "tarot-basic": {
    id: "tarot-basic",
    title: "Таро с нуля: базовая система",
    stars: 3500,             // 5 500 ₽ ≈ 3 500 ⭐
    category: "Таро",
    level: "Старт",
    duration: "4 недели",
    fileId: TEST_FILE_ID,
    // fileUrl: "https://cdn.yourdomain.com/tarot_basic.zip",
  },
  "pro-interpretation": {
    id: "pro-interpretation",
    title: "Профи-интерпретация раскладов",
    stars: 7500,             // 12 000 ₽ ≈ 7 500 ⭐
    category: "Таро",
    level: "Middle",
    duration: "6 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "love-money-spreads": {
    id: "love-money-spreads",
    title: "Расклады для отношений и денег",
    stars: 11500,            // 18 000 ₽ ≈ 11 500 ⭐
    category: "Таро",
    level: "Практика",
    duration: "6 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "tarot-for-brands": {
    id: "tarot-for-brands",
    title: "Таро для блогеров и брендов",
    stars: 16500,            // 26 000 ₽ ≈ 16 500 ⭐
    category: "Таро",
    level: "Продвинутый",
    duration: "5 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "master-diagnostics": {
    id: "master-diagnostics",
    title: "Мастер-уровень: диагностика и стратегия",
    stars: 22000,            // 35 000 ₽ ≈ 22 000 ⭐
    category: "Таро",
    level: "Pro",
    duration: "8 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },

  // ==== АСТРОЛОГИЯ ====
  "astro-basic": {
    id: "astro-basic",
    title: "Астрология с нуля: базовая система",
    stars: 4000,             // 6 500 ₽ ≈ 4 000 ⭐
    category: "Астрология",
    level: "Старт",
    duration: "4 недели",
    fileId: TEST_FILE_ID,
  },
  "astro-profi": {
    id: "astro-profi",
    title: "Профи-разбор натальных карт",
    stars: 9000,             // 14 000 ₽ ≈ 9 000 ⭐
    category: "Астрология",
    level: "Middle",
    duration: "6 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "astro-synastry": {
    id: "astro-synastry",
    title: "Синастрия и совместимость",
    stars: 12500,            // 20 000 ₽ ≈ 12 500 ⭐
    category: "Астрология",
    level: "Практика",
    duration: "5 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "astro-prognostics": {
    id: "astro-prognostics",
    title: "Прогностика: транзиты и хорар",
    stars: 17000,            // 27 000 ₽ ≈ 17 000 ⭐
    category: "Астрология",
    level: "Продвинутый",
    duration: "6 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
  "astro-blog-business": {
    id: "astro-blog-business",
    title: "Астрология для блога и бизнеса",
    stars: 21000,            // 33 000 ₽ ≈ 21 000 ⭐
    category: "Астрология",
    level: "Pro",
    duration: "6 недель",
    includesPrev: true,
    fileId: TEST_FILE_ID,
  },
};

// Утилита: безопасно получить курс по ID
export function getCourse(courseId: string | null | undefined): Course | null {
  if (!courseId) return null;
  return COURSES[courseId] ?? null;
}
