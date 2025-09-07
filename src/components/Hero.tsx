"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Star, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  scrollToCourses: () => void;
};

export default function Hero({ scrollToCourses }: Props) {
  return (
    <section className="relative">
      {/* Видеофон */}
      <div className="absolute inset-0 overflow-hidden rounded-b-[28px] border-b border-transparent">
        <video
          className="h-[72vh] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: "brightness(0.98) contrast(1.02)" }}
          poster="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
        />

        {/* Вертикальный градиент */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(248,245,239,0) 0%, rgba(248,245,239,0.18) 30%, rgba(248,245,239,0.45) 55%, rgba(248,245,239,0.75) 82%, #f8f5ef 100%)",
          }}
        />
      </div>

      {/* Контент */}
      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/70 px-3 py-1 text-xs text-[#6b5a43] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Новый поток обучения — количество мест ограничено
          </div>

          <h1
            className="mt-6 text-4xl md:text-5xl leading-snug font-semibold text-left"
            style={{
              color: "#b08a3c",
              textShadow:
                "0 1px 0 rgba(255,255,255,0.8), 0 2px 10px rgba(47,38,25,0.25)",
              letterSpacing: "-0.01em",
            }}
          >
            Курсы Таро и Астрологии от Angela Pearl
          </h1>

          {/* Жирный абзац */}
          <p
            className="mt-4 text-base md:text-lg max-w-2xl text-left font-bold"
            style={{
              color: "#8a6a3a",
              textShadow: "0 1px 0 rgba(255,255,255,0.7)",
              lineHeight: 1.6,
            }}
          >
            Добро пожаловать в пространство знаний и вдохновения. Наши программы помогут вам лучше понять себя и
            окружающий мир, открыть новые горизонты и при желании сделать первые шаги к профессии. Таро и Астрология
            здесь — это не только инструмент работы, но и путь к личному развитию, гармонии и осознанности.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              className="rounded-xl px-5 py-5 text-base leading-none"
              style={{
                background: "linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                color: "#2f271a",
                boxShadow: "0 16px 36px rgba(191,150,93,0.35)",
              }}
              onClick={scrollToCourses}
            >
              Записаться сейчас <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="rounded-xl px-5 py-5 text-base border-[#d9c6a2] leading-none"
              asChild
              style={{ color: "#3c2f1e" }}
            >
              <a href="#about">
                Об авторе <User className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm" style={{ color: "#6b5a43" }}>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Сертификат об окончании
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" /> Практика на живых кейсах
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
