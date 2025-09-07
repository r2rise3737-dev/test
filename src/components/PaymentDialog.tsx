"use client";

import { useMemo, useState } from "react";
import { X, Lock, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  amount: number;
};

const fmtRub = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " ₽";

export default function PaymentDialog({ open, onClose, title, amount }: Props) {
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [holder, setHolder] = useState("");
  const [email, setEmail] = useState("");

  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const digits = card.replace(/\s+/g, "");
    const expOk = /^\d{2}\/\d{2}$/.test(exp);
    const cvcOk = /^\d{3,4}$/.test(cvc);
    return digits.length >= 12 && expOk && cvcOk && holder.trim().length >= 2;
  }, [card, exp, cvc, holder]);

  if (!open) return null;

  function maskCard(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }
  function maskExp(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return d.slice(0, 2) + "/" + d.slice(2);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      // НИ ОДНОЕ поле карты никуда не отправляем — ниже шлём только метаданные
      const payloadEmail = email || "demo@no-email.local";
      const note = `DEMO-ОПЛАТА (без отправки карты): ${title} — ${fmtRub(amount)}`;
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payloadEmail,
          phone: "",
          question: note,
        }),
      }).catch(() => {});
      // имитируем процесс
      await new Promise((r) => setTimeout(r, 900));
      setDone(true);
    } catch {
      setErr("Что-то пошло не так. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
      />
      <Card className="relative z-[101] w-[92%] max-w-lg rounded-2xl border-0 shadow-2xl bg-white">
        <button
          onClick={() => !busy && onClose()}
          className="absolute right-3 top-3 rounded-lg p-1 text-neutral-500 hover:bg-neutral-100"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {!done ? (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-[#2f2619]">
                Демо-оплата — {title}
              </CardTitle>
              <div className="mt-1 text-sm text-[#6b5a43]">
                К оплате: <b>{fmtRub(amount)}</b>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="mb-3 flex items-center gap-2 text-xs text-[#6b5a43]">
                <Lock className="h-4 w-4" />
                Демо-режим: данные карты никуда не отправляются и не сохраняются.
              </div>

              <form onSubmit={onSubmit} className="grid gap-3">
                <div>
                  <label className="text-xs text-[#6b5a43]">Номер карты</label>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={card}
                    onChange={(ev) => setCard(maskCard(ev.target.value))}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6b5a43]">Срок (MM/YY)</label>
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={exp}
                      onChange={(ev) => setExp(maskExp(ev.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6b5a43]">CVC</label>
                    <Input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(ev) =>
                        setCvc(ev.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#6b5a43]">Имя на карте</label>
                  <Input
                    autoComplete="cc-name"
                    placeholder="IVAN IVANOV"
                    value={holder}
                    onChange={(ev) => setHolder(ev.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6b5a43]">
                    Email (для подтверждения)
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className="mt-1"
                  />
                </div>

                {err && <div className="text-sm text-red-700 mt-1">{err}</div>}

                <div className="mt-2 flex items-center justify-between gap-2">
                  <Button
                    type="submit"
                    disabled={busy || !isValid}
                    className="rounded-xl px-5 py-5 text-base"
                    style={{
                      background:
                        "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                      color: "#2f271a",
                    }}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обрабатываем…
                      </>
                    ) : (
                      "Завершить демо-оплату"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={onClose}
                    className="rounded-xl border-[#d9c6a2] text-[#3c2f1e]"
                  >
                    Отмена
                  </Button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#6b5a43]">
                  <ShieldCheck className="h-4 w-4" />
                  Для реальных платежей будет подключён Stripe/Cloud-касса. Сейчас — демонстрация интерфейса.
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg">Готово!</span>
              </div>
              <div className="text-sm text-[#6b5a43] mt-1">
                Демо-оплата «{title}» отмечена. Проверьте канал/бот — пришло уведомление.
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Button
                onClick={onClose}
                className="rounded-xl px-5 py-5 text-base"
                style={{
                  background:
                    "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                  color: "#2f271a",
                }}
              >
                Закрыть
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
