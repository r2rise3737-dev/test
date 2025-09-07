"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessClient() {
  const sp = useSearchParams();

  const title = sp.get("title") ?? "Доступ к программе";
  const amount = Number(sp.get("amount") ?? 0);
  const currency = (sp.get("currency") ?? "RUB").toUpperCase();

  const price = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: currency === "RUB" ? "RUB" : "RUB",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f8f5ef" }}>
      <div className="max-w-md w-full rounded-2xl border border-[#eadfcf] bg-white/80 backdrop-blur-md p-8 text-center shadow-lg">
        <div className="text-2xl text-[#2f2619] font-semibold">Доступ открыт</div>
        <div className="mt-2 text-[#6b5a43]">«{title}» — {price}</div>
        <p className="mt-4 text-sm text-[#6b5a43]">
          Письмо с деталями и ссылками отправлено на указанный email. Если нет во «Входящих», проверьте «Спам».
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="rounded-xl px-5 py-5 text-base"
            style={{ background: "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color: "#2f271a" }}
          >
            <Link href="/">На главную</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl border-[#d9c6a2] text-[#3c2f1e]">
            <Link href="/#courses">К каталогу курсов</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
