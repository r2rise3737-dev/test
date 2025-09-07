"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Star, ShieldCheck, Check, ArrowRight, Sparkles,
  BookOpen, MoonStar, MessageCircle, Clock,
  ChevronRight, Mail, Phone, User, Send, AtSign, Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  duration: string;
  points: string[];
  highlight?: boolean;
};

const ANGELA_IMG = "/photo_2025-08-16_21-20-50.jpg"; // public/

const tarotCourses: Course[] = [
  {
    id: "tarot-basic",
    title: "РўР°СЂРѕ СЃ РЅСѓР»СЏ: Р±Р°Р·РѕРІР°СЏ СЃРёСЃС‚РµРјР°",
    level: "РЎС‚Р°СЂС‚",
    price: 5500,
    duration: "4 РЅРµРґРµР»Рё",
    points: [
      "РњР»Р°РґС€РёРµ Рё РЎС‚Р°СЂС€РёРµ Р°СЂРєР°РЅС‹ Р±РµР· РІРѕРґС‹",
      "Р§С‘С‚РєРёРµ СЂР°СЃРєР»Р°РґС‹ РґР»СЏ Р±С‹С‚Р° Рё Р±РёР·РЅРµСЃР°",
      "РџСЂР°РєС‚РёРєР° РЅР° СЂРµР°Р»СЊРЅС‹С… РєРµР№СЃР°С…",
    ],
  },
  {
    id: "pro-interpretation",
    title: "РџСЂРѕС„Рё-РёРЅС‚РµСЂРїСЂРµС‚Р°С†РёСЏ СЂР°СЃРєР»Р°РґРѕРІ",
    level: "Middle",
    price: 12000,
    duration: "6 РЅРµРґРµР»СЊ",
    points: [
      "Р“Р»СѓР±РёРЅР° Р·РЅР°С‡РµРЅРёСЏ Р°СЂРєР°РЅРѕРІ",
      "РљРѕРјР±РёРЅР°С†РёРё Рё РїСЃРёС…РѕР»РѕРіРёС‡РµСЃРєРёРµ СЃРІСЏР·РєРё",
      "Р­С‚РёРєР° РєРѕРЅСЃСѓР»СЊС‚РёСЂРѕРІР°РЅРёСЏ",
    ],
  },
  {
    id: "love-money-spreads",
    title: "Р Р°СЃРєР»Р°РґС‹ РґР»СЏ РѕС‚РЅРѕС€РµРЅРёР№ Рё РґРµРЅРµРі",
    level: "РџСЂР°РєС‚РёРєР°",
    price: 18000,
    duration: "6 РЅРµРґРµР»СЊ",
    points: [
      "РђРІС‚РѕСЂСЃРєРёРµ СЃС…РµРјС‹ РЅР° РѕС‚РЅРѕС€РµРЅРёСЏ",
      "Р¤РёРЅР°РЅСЃРѕРІС‹Рµ СЃС†РµРЅР°СЂРёРё Рё СЂРёСЃРєРё",
      "Р Р°Р±РѕС‚Р° СЃ Р·Р°РїСЂРѕСЃР°РјРё РєР»РёРµРЅС‚РѕРІ",
    ],
  },
  {
    id: "tarot-for-brands",
    title: "РўР°СЂРѕ РґР»СЏ Р±Р»РѕРіРµСЂРѕРІ Рё Р±СЂРµРЅРґРѕРІ",
    level: "РџСЂРѕРґРІРёРЅСѓС‚С‹Р№",
    price: 26000,
    duration: "5 РЅРµРґРµР»СЊ",
    points: [
      "РљРѕРЅС‚РµРЅС‚-СЂР°СЃРєР»Р°РґС‹ РґР»СЏ СЃРѕС†СЃРµС‚РµР№",
      "Р›С‘РіРєР°СЏ РїРѕРґР°С‡Р° Рё СЌС‚РёРєР° РїСѓР±Р»РёС‡РЅРѕСЃС‚Рё",
      "РџРѕСЂС‚С„РѕР»РёРѕ Рё СѓРїР°РєРѕРІРєР° СѓСЃР»СѓРі",
      "РРјРёРґР¶ Рё СЌС‚РёРєР° РїСѓР±Р»РёС‡РЅРѕРіРѕ С‚Р°СЂРѕР»РѕРіР°",
    ],
  },
  {
    id: "master-diagnostics",
    title: "РњР°СЃС‚РµСЂ-СѓСЂРѕРІРµРЅСЊ: РґРёР°РіРЅРѕСЃС‚РёРєР° Рё СЃС‚СЂР°С‚РµРіРёСЏ",
    level: "Pro",
    price: 35000,
    duration: "8 РЅРµРґРµР»СЊ",
    points: [
      "РЎС‚СЂР°С‚РµРіРёС‡РµСЃРєРёРµ СЂР°СЃРєР»Р°РґС‹ Рё СЃР»РѕР¶РЅС‹Рµ РєРµР№СЃС‹",
      "РЎР»РѕР¶РЅС‹Рµ СЃР»СѓС‡Р°Рё Рё СЂР°Р·Р±РѕСЂС‹",
      "РђР»РіРѕСЂРёС‚РјС‹ СЂРµС€РµРЅРёР№ Рё РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ РїСЂРѕРіРЅРѕР·Р°",
      "РЎСѓРїРµСЂРІРёР·РёСЏ РѕС‚ РЅР°СЃС‚Р°РІРЅРёРєР°",
    ],
    highlight: true,
  },
];

const astroCourses: Course[] = [
  {
    id: "astro-basic",
    title: "РђСЃС‚СЂРѕР»РѕРіРёСЏ СЃ РЅСѓР»СЏ",
    level: "РЎС‚Р°СЂС‚",
    price: 6500,
    duration: "4 РЅРµРґРµР»Рё",
    points: [
      "РџР»Р°РЅРµС‚С‹, РґРѕРјР°, Р°СЃРїРµРєС‚С‹",
      "РљР°Рє С‡РёС‚Р°С‚СЊ РЅР°С‚Р°Р»СЊРЅСѓСЋ РєР°СЂС‚Сѓ",
      "Р‘С‹СЃС‚СЂС‹Р№ СЂР°Р·Р±РѕСЂ РґР»СЏ СЃРµР±СЏ",
    ],
  },
  {
    id: "astro-profi",
    title: "РџСЂРѕС„Рё-СЂР°Р·Р±РѕСЂ РЅР°С‚Р°Р»СЊРЅС‹С… РєР°СЂС‚",
    level: "Middle",
    price: 14000,
    duration: "6 РЅРµРґРµР»СЊ",
    points: [
      "РЎРёР»СЊРЅС‹Рµ Рё СЃР»Р°Р±С‹Рµ Р·РѕРЅС‹",
      "РљР°СЂСЊРµСЂРЅС‹Рµ Рё С„РёРЅР°РЅСЃРѕРІС‹Рµ РІРµРєС‚РѕСЂС‹",
      "РљРѕРјРјСѓРЅРёРєР°С†РёСЏ СЃ РєР»РёРµРЅС‚РѕРј",
    ],
  },
  {
    id: "astro-synastry",
    title: "РЎРёРЅР°СЃС‚СЂРёСЏ Рё СЃРѕРІРјРµСЃС‚РёРјРѕСЃС‚СЊ",
    level: "РџСЂР°РєС‚РёРєР°",
    price: 20000,
    duration: "5 РЅРµРґРµР»СЊ",
    points: [
      "Р›СЋР±РѕРІРЅС‹Рµ Рё РґРµР»РѕРІС‹Рµ СЃРѕСЋР·С‹",
      "РљРѕРЅС„Р»РёРєС‚С‹ Рё С‚РѕС‡РєРё СЂРѕСЃС‚Р°",
      "Р–РёР·РЅРµРЅРЅС‹Рµ СЃС‚СЂР°С‚РµРіРёРё РїР°СЂС‹",
    ],
  },
  {
  id: "astro-prognostics",
  title: "РђСЃС‚СЂРѕР»РѕРіРёСЏ РґР»СЏ Р±Р»РѕРіР° Рё Р±РёР·РЅРµСЃР°",
  level: "Pro",
  price: 27000,
  duration: "6 РЅРµРґРµР»СЊ",
  points: [
    "Р’РєР»СЋС‡Р°РµС‚ РїСЂРµРґС‹РґСѓС‰РёРµ",
    "РљРѕРЅС‚РµРЅС‚-РїР»Р°РЅ РїРѕ Р·РІС‘Р·РґР°Рј",
    "РџСЂРѕРґСѓРєС‚-Р»РёРЅРµР№РєР° Рё Р·Р°РїСѓСЃРєРё",
    "РљР°Р»РµРЅРґР°СЂСЊ СѓРґР°С‡РЅС‹С… РґР°С‚",
  ],
},

{
  id: "astro-blog-business",
  title: "РњР°СЃС‚РµСЂ-Р°СЃС‚СЂРѕР»РѕРі: РґРёР°РіРЅРѕСЃС‚РёРєР° Рё СЃС‚СЂР°С‚РµРіРёСЏ",
  level: "Pro",
  price: 33000,
  duration: "8 РЅРµРґРµР»СЊ",
  points: [
    "Р’РєР»СЋС‡Р°РµС‚ РїСЂРµРґС‹РґСѓС‰РёРµ",
    "Р”РёР°РіРЅРѕСЃС‚РёРєР° СЏРґСЂР° Р»РёС‡РЅРѕСЃС‚Рё Рё СЂРµСЃСѓСЂСЃРѕРІ: СѓРїСЂР°РІРёС‚РµР»Рё, РґРѕСЃС‚РѕРёРЅСЃС‚РІР°, СЃРёРіРЅРёС„РёРєР°С‚РѕСЂС‹",
    "РЎР»РѕР¶РЅС‹Рµ РєРµР№СЃС‹: РїРµСЂРµРµР·РґС‹, Р±РёР·РЅРµСЃ-СЂРµС€РµРЅРёСЏ, РєСЂРёР·РёСЃС‹, В«СѓР·РєРёРµ РјРµСЃС‚Р°В» РєР°СЂС‚С‹",
    "Р›РёС‡РЅС‹Р№ РїР»Р°РЅ РїСЂР°РєС‚РёРєРё РЅР° 3 РјРµСЃСЏС†Р° + СЃРµСЂС‚РёС„РёРєР°С†РёСЏ",
  ],
  // РјРѕР¶РЅРѕ РїРѕРјРµС‚РёС‚СЊ, РµСЃР»Рё Р·Р°С…РѕС‡РµС€СЊ РІРёР·СѓР°Р»СЊРЅРѕ РІС‹РґРµР»СЏС‚СЊ
  // highlight: true,
}
,
];

const formatPrice = (n: number) => new Intl.NumberFormat("ru-RU").format(n) + " в‚Ѕ";

// Р’Р•Р”РЃРњ РќРђ РќРћР’РЈР® РЎРўР РђРќРР¦РЈ CHECKOUT
function getCheckoutHref(c: Course) {
  return `/checkout?courseId=${encodeURIComponent(c.id)}`;
}

function CourseCard({
  course,
  includePrev,
}: {
  course: Course;
  includePrev?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card
        className="flex flex-col justify-between h-full border-0 shadow-lg rounded-2xl bg-white/70 backdrop-blur-md relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(1200px 400px at 10% -10%, rgba(232,220,198,0.45), transparent), radial-gradient(800px 300px at 110% 10%, rgba(233,226,212,0.5), transparent)",
        }}
      >
        {/* РјСЏРіРєРёРµ Р·РѕР»РѕС‚РёСЃС‚С‹Рµ РїСЏС‚РЅР° */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.65), rgba(215,187,143,0))", filter:"blur(10px)"}} />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.55), rgba(215,187,143,0))", filter:"blur(14px)"}} />

        <div>
          <CardHeader className="p-6">
            <CardTitle className="text-xl tracking-tight text-[#3c2f1e] font-medium">
              {course.title}
            </CardTitle>

            <div className="mt-2 flex items-center gap-3 text-sm text-[#6b5a43]">
              <span className="px-2 py-1 rounded-full bg-[#f2ebdf] border border-[#eadfcf]">
                {course.level}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.duration}
              </span>
            </div>

            {includePrev && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#f8f1e2] border border-[#eadfcf] text-xs text-[#6b5a43]">
                  <Layers className="h-4 w-4" />
                  Р’РєР»СЋС‡Р°РµС‚ РїСЂРµРґС‹РґСѓС‰РёРµ
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="px-6 pb-0">
            <ul className="space-y-2 text-[#4a3e2c] min-h-[96px]">
              {course.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-5 w-5 mt-[2px]" />
                  <span className="leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </div>

        <div className="px-6 pb-6 pt-4 flex items-center justify-between mt-auto">
          <div className="text-2xl text-[#3c2f1e] font-semibold tracking-tight">
            {formatPrice(course.price)}
          </div>
          <Button
            asChild
            className="rounded-xl px-5 leading-none"
            style={{
              background:
                "linear-gradient(180deg, #e7d6b2 0%, #d5bb8a 40%, #c39f61 100%)",
              color: "#2e2619",
              boxShadow:
                "0 8px 24px rgba(195,159,97,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            <Link href={getCheckoutHref(course)} prefetch={false} rel="nofollow">
              РџРѕР»СѓС‡РёС‚СЊ РґРѕСЃС‚СѓРї <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function runDevTests() {
  try {
    const groups = [
      { name: "tarot", data: tarotCourses },
      { name: "astro", data: astroCourses },
    ];
    console.assert(groups[0].data.length === 5, "Tarot: РѕР¶РёРґР°Р»РѕСЃСЊ 5 РєСѓСЂСЃРѕРІ");
    console.assert(groups[1].data.length === 5, "Astro: РѕР¶РёРґР°Р»РѕСЃСЊ 5 РєСѓСЂСЃРѕРІ");
    for (const g of groups) {
      let hasHighlight = false;
      for (const c of g.data) {
        console.assert(typeof c.id === "string" && c.id, `${g.name}: id РѕР±СЏР·Р°С‚РµР»РµРЅ`);
        console.assert(typeof c.title === "string" && c.title.length > 2, `${g.name}:${c.id} РЅРµРєРѕСЂСЂРµРєС‚РЅС‹Р№ title`);
        console.assert(typeof c.level === "string" && c.level, `${g.name}:${c.id} level РѕР±СЏР·Р°С‚РµР»РµРЅ`);
        console.assert(typeof c.price === "number" && c.price >= 5500 && c.price <= 35000, `${g.name}:${c.id} price РІРЅРµ РґРёР°РїР°Р·РѕРЅР° 5500вЂ“35000`);
        console.assert(typeof c.duration === "string" && c.duration, `${g.name}:${c.id} duration РѕР±СЏР·Р°С‚РµР»РµРЅ`);
        console.assert(Array.isArray(c.points) && c.points.length >= 3, `${g.name}:${c.id} РјРёРЅРёРјСѓРј 3 bullets`);
        console.assert(c.points.every((p: string) => typeof p === "string" && p.length > 0), `${g.name}:${c.id} РїСѓСЃС‚С‹Рµ bullets`);
        hasHighlight = hasHighlight || !!c.highlight;
      }
      console.assert(hasHighlight, `${g.name}: РЅСѓР¶РµРЅ С…РѕС‚СЏ Р±С‹ РѕРґРёРЅ highlight=true`);
    }
    console.assert(/\.(jpg|jpeg|png)$/i.test(ANGELA_IMG), "ANGELA_IMG РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ jpg/png");
    console.log("[DEV TESTS] Р’СЃРµ РїСЂРѕРІРµСЂРєРё РїСЂРѕР№РґРµРЅС‹ вњ”");
  } catch (e) {
    console.error("[DEV TESTS] РћС€РёР±РєР° РїСЂРѕРІРµСЂРѕРє:", e);
  }
}

export default function HomeClient() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [track, setTrack] = useState<"tarot" | "astro">("tarot");

  // РџРѕР»СЏ С„РѕСЂРјС‹ РІ РЅРёР¶РЅРµРј Р±Р»РѕРєРµ В«РљРѕРЅС‚Р°РєС‚С‹В»
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cTg, setCTg] = useState("");
  const [cMsg, setCMsg] = useState("");
  const [cSending, setCSending] = useState(false);
  const [cSent, setCSent] = useState<null | "ok" | "err" | "invalid">(null);

  useEffect(() => { if (typeof window !== "undefined") runDevTests(); }, []);

  const features: { icon: LucideIcon; title: string; text: string }[] = [
    { icon: BookOpen, title: "РњРµС‚РѕРґРёРєР°", text: "РЎС‚СЂСѓРєС‚СѓСЂРЅРѕ, Р±РµР· Р»РёС€РЅРµРіРѕ" },
    { icon: MoonStar, title: "РџСЂР°РєС‚РёРєР°", text: "РљР°Р¶РґС‹Р№ РјРѕРґСѓР»СЊ вЂ” СЂР°Р·Р±РѕСЂ" },
    { icon: MessageCircle, title: "РљРѕРјРјСЊСЋРЅРёС‚Рё", text: "РћР±РјРµРЅ Р·Р°СЏРІРєР°РјРё" },
  ];

  const reviews = [
    {
      name: "РђРЅРЅР° Р’.",
      role: "РЈС‡РµРЅРёС†Р° РђРєР°РґРµРјРёРё Angela Pearl",
      text:
        "РЎ РїРµСЂРІРѕРіРѕ РјРµСЃСЏС†Р° РЅР°С‡Р°Р»Р° Р±СЂР°С‚СЊ РєРѕРЅСЃСѓР»СЊС‚Р°С†РёРё. РњР°С‚РµСЂРёР°Р» СЃС‚СЂСѓРєС‚СѓСЂРЅС‹Р№, Р±РµР· РІРѕРґС‹ вЂ” Р±С‹СЃС‚СЂРѕ РІС‹С€Р»Р° РЅР° СЃС‚Р°Р±РёР»СЊРЅС‹Р№ РїРѕС‚РѕРє РєР»РёРµРЅС‚РѕРІ.",
      avatar:
        "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "РњР°СЂРёРЅР° Рљ.",
      role: "РўР°СЂРѕР»РѕРі РёР· РЅРѕРІРѕРіРѕ РїРѕС‚РѕРєР°",
      text:
        "РџРѕРЅСЂР°РІРёР»Р°СЃСЊ СЃРёСЃС‚РµРјР° СЂР°Р·Р±РѕСЂРѕРІ: РїРѕСЃР»Рµ РєР°Р¶РґРѕРіРѕ Р±Р»РѕРєР° РµСЃС‚СЊ РїСЂР°РєС‚РёРєР° Рё РѕР±СЂР°С‚РЅР°СЏ СЃРІСЏР·СЊ. Р­С‚Рѕ СЃРёР»СЊРЅРѕ СѓСЃРєРѕСЂСЏРµС‚ СЂРѕСЃС‚.",
      avatar:
        "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=256&h=256&fit=crop&crop=faces",
    },
    {
      name: "РђР»РµРєСЃРµР№ Р .",
      role: "РђСЃС‚СЂРѕР»РѕРі Рё РєРѕРЅСЃСѓР»СЊС‚Р°РЅС‚ РєР»РёРµРЅС‚РѕРІ",
      text:
        "Р“Р»СѓР±РѕРєРёРµ РјРµС‚РѕРґРёРєРё + СЌС‚РёРєР° СЂР°Р±РѕС‚С‹ СЃ Р·Р°РїСЂРѕСЃРѕРј. Р§С‘С‚РєРѕ, СѓРІР°Р¶РёС‚РµР»СЊРЅРѕ Рє РєР»РёРµРЅС‚Сѓ вЂ” Рё СЂРµР·СѓР»СЊС‚Р°С‚С‹ Р·Р°РјРµС‚РЅС‹.",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop&crop=faces",
    },
  ];

  function scrollToCourses() {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submitLead() {
    try {
      setSending(true); setSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, question }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent("ok"); setEmail(""); setPhone(""); setQuestion("");
    } catch {
      setSent("err");
    } finally {
      setSending(false);
    }
  }

  async function submitContact() {
    if (!cEmail && !cPhone && !cTg) { setCSent("invalid"); return; }
    if (!cMsg.trim()) { setCSent("invalid"); return; }

    try {
      setCSending(true); setCSent(null);
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cEmail,
          phone: cPhone,
          telegram: cTg,
          question: cMsg,
          source: "contact"
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCSent("ok");
      setCEmail(""); setCPhone(""); setCTg(""); setCMsg("");
    } catch {
      setCSent("err");
    } finally {
      setCSending(false);
    }
  }

  const currentCourses = track === "tarot" ? tarotCourses : astroCourses;

  return (
    <div className="min-h-screen w-full" style={{ background: "#f8f5ef" }}>
      {/* РќР°РІР±Р°СЂ */}
      <header className="sticky top-0 z-40 border-b border-[#eadfcf]/80 backdrop-blur-xl bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl" style={{ background:"conic-gradient(from 180deg at 50% 50%, #e9dcc5, #d1b582, #b98d4e, #e9dcc5)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.7)" }}/>
            <div className="text-[#3c2f1e] tracking-tight">Angela Pearl вЂ” РђРєР°РґРµРјРёСЏ</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#5b4a33]">
            <a href="#courses" className="hover:opacity-70">РљСѓСЂСЃС‹</a>
            <a href="#about" className="hover:opacity-70">РћР± Р°РІС‚РѕСЂРµ</a>
            <a href="#reviews" className="hover:opacity-70">РћС‚Р·С‹РІС‹</a>
            <a href="#faq" className="hover:opacity-70">FAQ</a>
            <a href="#contact" className="hover:opacity-70">РљРѕРЅС‚Р°РєС‚С‹</a>
          </nav>
          <Button
            className="rounded-xl px-4 py-2 text-sm"
            style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
            onClick={scrollToCourses}
          >
            РџРѕР»СѓС‡РёС‚СЊ РґРѕСЃС‚СѓРї
          </Button>
        </div>
      </header>

      {/* HERO вЂ” РњРЇР“РљРР™ РџР•Р Р•РҐРћР”, Р‘Р•Р— PLAY-РРљРћРќРљР РќРђ РњРћР‘РР›Р¬РќРћРњ, Р‘Р•Р— Р”РЃР Р“РђРќРР™ */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden rounded-b-[28px] border-b border-transparent">
          {/* РњРѕР±РёР»СЊРЅС‹Р№ С„РѕРЅ вЂ” СЃС‚Р°С‚РёРєР° РІРјРµСЃС‚Рѕ РІРёРґРµРѕ */}
          <div className="relative h-[72vh] w-full md:hidden">
            <img
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transform-gpu will-change-transform"
              style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            />
            {/* РњСЏРіРєРёР№ РІРµСЂС‚РёРєР°Р»СЊРЅС‹Р№ РіСЂР°РґРёРµРЅС‚ РґРѕ Р±РµР¶РµРІРѕРіРѕ */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,245,239,0.00) 0%, rgba(248,245,239,0.10) 25%, rgba(248,245,239,0.40) 55%, rgba(248,245,239,0.72) 80%, #f8f5ef 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,245,239,0) 0%, rgba(248,245,239,0.55) 45%, #f8f5ef 100%)",
              }}
            />
          </div>

          {/* Р”РµСЃРєС‚РѕРї вЂ” РІРёРґРµРѕ */}
          <video
            className="hidden md:block h-[72vh] w-full object-cover transform-gpu will-change-transform"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            aria-hidden="true"
            poster="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop"
            style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          />
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(248,245,239,0) 0%, rgba(248,245,239,0.16) 35%, rgba(248,245,239,0.50) 65%, #f8f5ef 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-16">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfcf] bg-white/70 px-3 py-1 text-xs text-[#6b5a43]">
              <Sparkles className="h-3.5 w-3.5" /> вЏіРњРѕРё Р»СЋР±РёРјС‹Рµ, РїСЂРѕРґР»РёР»Р° РґРѕСЃС‚СѓРї Рє РєСѓСЂСЃР°Рј РґРѕ 17 СЃРµРЅС‚СЏР±СЂСЏ. Р•СЃР»Рё С…РѕС‚РёС‚Рµ СЏСЃРЅРѕСЃС‚Рё РІ СЃРµР±Рµ Рё СЂРµС€РµРЅРёСЏС… вЂ” РїСЂРёСЃРѕРµРґРёРЅСЏР№С‚РµСЃСЊ.
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl leading-snug text-[#2f2619] font-semibold text-left">
              РљСѓСЂСЃС‹ РўР°СЂРѕ Рё РђСЃС‚СЂРѕР»РѕРіРёРё РѕС‚ Angela Pearl
            </h1>

            {/* В«РћР±Р»Р°С‡РєРѕВ» РїРѕРґ Р°Р±Р·Р°С†РµРј вЂ” РµС‰С‘ Р±РѕР»РµРµ РїСЂРѕР·СЂР°С‡РЅРѕРµ Рё СЃ РјСЏРіРєРёРј СЂР°СЃС‚РІРѕСЂРµРЅРёРµРј РєСЂР°С‘РІ */}
            <div className="relative mt-4 max-w-2xl">
<div className="relative inline-block px-4 py-4">
  <div
    className="pointer-events-none absolute inset-0 rounded-[22px]"
    style={{ backgroundColor: "rgba(255,255,255,0.28)",
      WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, black 72%, transparent 100%)",
      maskImage: "radial-gradient(closest-side at 50% 50%, black 72%, transparent 100%)",
      WebkitTransform: "translateZ(0)",
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
    }} />
  <p className="relative text-[15px] leading-relaxed text-[#3d372c] md:text-[#5b5a43] md:text-lg font-semibold z-[1] inline-block w-fit">
              Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ Р·РЅР°РЅРёР№ Рё РІРґРѕС…РЅРѕРІРµРЅРёСЏ. РќР°С€Рё РїСЂРѕРіСЂР°РјРјС‹ РїРѕРјРѕРіСѓС‚ РІР°Рј Р»СѓС‡С€Рµ РїРѕРЅСЏС‚СЊ СЃРµР±СЏ Рё
              РѕРєСЂСѓР¶Р°СЋС‰РёР№ РјРёСЂ, РѕС‚РєСЂС‹С‚СЊ РЅРѕРІС‹Рµ РіРѕСЂРёР·РѕРЅС‚С‹ Рё РїСЂРё Р¶РµР»Р°РЅРёРё СЃРґРµР»Р°С‚СЊ РїРµСЂРІС‹Рµ С€Р°РіРё Рє РїСЂРѕС„РµСЃСЃРёРё. РўР°СЂРѕ Рё РђСЃС‚СЂРѕР»РѕРіРёСЏ
              Р·РґРµСЃСЊ вЂ” СЌС‚Рѕ РЅРµ С‚РѕР»СЊРєРѕ РёРЅСЃС‚СЂСѓРјРµРЅС‚ СЂР°Р±РѕС‚С‹, РЅРѕ Рё РїСѓС‚СЊ Рє Р»РёС‡РЅРѕРјСѓ СЂР°Р·РІРёС‚РёСЋ, РіР°СЂРјРѕРЅРёРё Рё РѕСЃРѕР·РЅР°РЅРЅРѕСЃС‚Рё.
            </p>
</div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button
                className="rounded-xl px-5 py-5 text-base leading-none"
                style={{
                  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)",
                  color:"#2f271a",
                  boxShadow:"0 16px 36px rgba(191,150,93,0.35)",
                }}
                onClick={scrollToCourses}
              >
                Р—Р°РїРёСЃР°С‚СЊСЃСЏ СЃРµР№С‡Р°СЃ <ChevronRight className="ml-2 h-5 w-5" />
              </Button>

              <Button variant="outline" className="rounded-xl px-5 py-5 text-base border-[#d9c6a2] text-[#3c2f1e] leading-none" asChild>
                <a href="#about">
                  РћР± Р°РІС‚РѕСЂРµ <User className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-[#6b5a43]">
              <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> РЎРµСЂС‚РёС„РёРєР°С‚ РѕР± РѕРєРѕРЅС‡Р°РЅРёРё</div>
              <div className="flex items-center gap-1"><Star className="h-4 w-4" /> РџСЂР°РєС‚РёРєР° РЅР° Р¶РёРІС‹С… РєРµР№СЃР°С…</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* РљРђРўРђР›РћР“ */}
      <section id="courses" className="mx-auto max-w-7xl px-4 py-16 scroll-mt-24">
        <div className="mb-2">
          <h2 className="text-3xl tracking-tight text-[#2f2619] font-semibold">РџСЂРѕРіСЂР°РјРјС‹ РѕР±СѓС‡РµРЅРёСЏ</h2>
        </div>

        <div className="flex items-center gap-3 mb-3" role="tablist" aria-label="РќР°РїСЂР°РІР»РµРЅРёСЏ РѕР±СѓС‡РµРЅРёСЏ">
          <div className="text-[#6b5a43] mr-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Р’С‹Р±РµСЂРёС‚Рµ РЅР°РїСЂР°РІР»РµРЅРёРµ:</span>
          </div>

          <Button
            role="tab"
            aria-selected={track === "tarot"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "tarot" ? "" : "border border-[#d9c6a2] bg-white/80 text-[#3c2f1e]"}`}
            style={ track === "tarot" ? {  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"  } : undefined }
            onClick={() => setTrack("tarot")}
          >
            РўР°СЂРѕ
          </Button>

          <Button
            role="tab"
            aria-selected={track === "astro"}
            className={`rounded-xl px-4 py-2 text-sm ${track === "astro" ? "" : "border border-[#d9c6a2] bg-white/80 text-[#3c2f1e]"}`}
            style={ track === "astro" ? {  background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a"  } : undefined }
            onClick={() => setTrack("astro")}
          >
            РђСЃС‚СЂРѕР»РѕРіРёСЏ
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              includePrev={c.level !== "РЎС‚Р°СЂС‚"}
            />
          ))}
        </div>
      </section>

      {/* РћР‘ РђР’РўРћР Р• вЂ” Р±РµР· СЂР°РјРѕРє Рё В«РїРѕРґР»РѕР¶РµРєВ», С‡РёСЃС‚РѕРµ РёР·РѕР±СЂР°Р¶РµРЅРёРµ */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-16 relative">
        <div className="pointer-events-none absolute -top-12 right-0 h-40 w-40 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.6), rgba(215,187,143,0))", filter:"blur(12px)"}}/>
        <div className="pointer-events-none absolute bottom-0 -left-10 h-48 w-48 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.5), rgba(215,187,143,0))", filter:"blur(14px)"}}/>

        <div className="grid lg:grid-cols-2 gap-10 items-center relative">
          <div>
            {/* Р±С‹Р»Рѕ: СЂР°РјРєР°/С„РѕРЅ/РїР°РґРґРёРЅРі. СЃС‚Р°Р»Рѕ: С‡РёСЃС‚С‹Р№ РєРѕРЅС‚РµР№РЅРµСЂ Р±РµР· СЂР°РјРѕРє */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/1land.PNG"
                  alt="Angela Pearl"
                  className="w-full h-full"
                  style={{
                    objectFit: "cover",
                    // СЃРјРµС‰Р°РµРј РєР°РґСЂ С‡СѓС‚СЊ РІС‹С€Рµ, С‡С‚РѕР±С‹ Р»РёС†Рѕ/РіРѕР»РѕРІР° РІСЃРµРіРґР° Р±С‹Р»Рё РІРёРґРЅС‹
                    objectPosition: "center 15%",
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold">Angela Pearl</h3>
            <p className="mt-2 text-[#5b4a33] leading-relaxed font-medium">
              Angela Pearl вЂ” РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ СЌРєСЃРїРµСЂС‚, С‡СЊРёРј РїСЂРѕРіРЅРѕР·Р°Рј РґРѕРІРµСЂСЏСЋС‚ РјРёР»Р»РёРѕРЅС‹ Р·СЂРёС‚РµР»РµР№.
            </p>
            <p className="mt-4 text-[#5b4a33] leading-relaxed">
              РњРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Р№ РєРѕРЅСЃСѓР»СЊС‚Р°РЅС‚ Рё Р°РІС‚РѕСЂ РјРµС‚РѕРґРёРє РїРѕ РўР°СЂРѕ Рё РђСЃС‚СЂРѕР»РѕРіРёРё. Р‘РѕР»РµРµ 20 Р»РµС‚ РїСЂР°РєС‚РёРєРё Рё СЃРѕС‚РЅРё СЃРїРµС†РёР°Р»РёСЃС‚РѕРІ РїРѕ РІСЃРµРјСѓ РјРёСЂСѓ. Р§С‘С‚РєР°СЏ СЃС‚СЂСѓРєС‚СѓСЂР° РѕР±СѓС‡РµРЅРёСЏ, СѓРІР°Р¶РµРЅРёРµ Рє СЌС‚РёРєРµ РїСЂРѕС„РµСЃСЃРёРё Рё С„РѕРєСѓСЃ РЅР° РїСЂР°РєС‚РёРєРµ вЂ” Р±РµР· Р»РёС€РЅРµРіРѕ.
            </p>
            <p className="mt-3 text-[#5b4a33] leading-relaxed">
              Р РµРіСѓР»СЏСЂРЅС‹Рµ СЂР°Р·Р±РѕСЂС‹ СЂРµР°Р»СЊРЅС‹С… Р·Р°РїСЂРѕСЃРѕРІ (Р±С‹С‚, РѕС‚РЅРѕС€РµРЅРёСЏ, Р±РёР·РЅРµСЃ) СЃ Р°РєС†РµРЅС‚РѕРј РЅР° РєРѕСЂСЂРµРєС‚РЅСѓСЋ РєРѕРјРјСѓРЅРёРєР°С†РёСЋ Рё РїСЂРёРєР»Р°РґРЅСѓСЋ РїСЃРёС…РѕР»РѕРіРёСЋ. РџСЂРѕРіСЂР°РјРјС‹ РѕР±РЅРѕРІР»СЏСЋС‚СЃСЏ вЂ” РґРѕР±Р°РІР»СЏСЋС‚СЃСЏ СЃРѕРІСЂРµРјРµРЅРЅС‹Рµ СЂР°СЃРєР»Р°РґС‹, РїСЂРёРјРµСЂС‹ Рё Р¶РёРІС‹Рµ РєРµР№СЃС‹.
            </p>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                { k: "РЎРїРµС†РёР°Р»РёСЃС‚РѕРІ", v: "700+" },
                { k: "РЎС‚СЂР°РЅ", v: "20+" },
                { k: "Р›РµС‚ РїСЂР°РєС‚РёРєРё", v: "20+" },
              ].map((i) => (
                <div key={i.k} className="relative rounded-2xl border border-[#eadfcf] p-4 text-center shadow-sm hover:shadow-md transition-shadow bg-white/70">
                  <div className="text-2xl text-[#3c2f1e] font-semibold">{i.v}</div>
                  <div className="text-xs text-[#6b5a43] mt-1">{i.k}</div>
                  <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full"
                       style={{background:"radial-gradient(circle, rgba(234,217,184,0.45), rgba(215,187,143,0))", filter:"blur(10px)"}}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* РњРѕР±РёР»СЊРЅР°СЏ Р°РґР°РїС‚Р°С†РёСЏ Р±Р»РѕРєР° В«Рћ Р°РІС‚РѕСЂРµВ» */}
        <style>{`
          @media (max-width: 768px) {
            #about img {
              object-fit: cover !important;
              object-position: center 18% !important;
            }
          }
        `}</style>
      </section>

      {/* РљР Р•РђРўРР’РќР«Р• В«РћРљРћРЁРљРВ»-РўР РР“Р“Р•Р Р« */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <MoonStar className="h-5 w-5" /> РџСЂР°РєС‚РёРєР°
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              РљР°Р¶РґСѓСЋ РЅРµРґРµР»СЋ вЂ” <span className="font-medium">СЂР°Р·Р±РѕСЂ Р¶РёРІС‹С… Р·Р°РїСЂРѕСЃРѕРІ</span> + РѕР±СЂР°С‚РЅР°СЏ СЃРІСЏР·СЊ РѕС‚ РЅР°СЃС‚Р°РІРЅРёРєР°.
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <MessageCircle className="h-5 w-5" /> РљРѕРјРјСЊСЋРЅРёС‚Рё
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              РўС‘РїР»РѕРµ СЃРѕРѕР±С‰РµСЃС‚РІРѕ вЂ” <span className="font-medium">РѕР±С‰РёРµ РєРµР№СЃС‹, РЅРµС‚РІРѕСЂРєРёРЅРі Рё РІР·Р°РёРјРѕРїРѕРјРѕС‰СЊ</span>.
            </div>
          </div>

          <div className="relative rounded-2xl border border-[#eadfcf] bg-white/80 p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full" style={{background:"radial-gradient(circle, rgba(234,217,184,0.7), rgba(215,187,143,0))", filter:"blur(8px)"}}/>
            <div className="flex items-center gap-2 text-[#3c2f1e] font-medium">
              <BookOpen className="h-5 w-5" /> РњРµС‚РѕРґРёРєР°
            </div>
            <div className="mt-1 text-sm text-[#5b4a33]">
              РџРѕС€Р°РіРѕРІРѕ Рё Р±РµР· РІРѕРґС‹: <span className="font-medium">СЏСЃРЅС‹Рµ Р°Р»РіРѕСЂРёС‚РјС‹</span> Рё С€Р°Р±Р»РѕРЅС‹ РґР»СЏ Р±С‹СЃС‚СЂС‹С… СЂРµР·СѓР»СЊС‚Р°С‚РѕРІ.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
        <h3 className="text-3xl tracking-tight text-[#2f2619] font-semibold text-center">FAQ</h3>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {[
            { q: "РџРѕРґРѕР№РґС‘С‚ Р»Рё РєСѓСЂСЃ, РµСЃР»Рё СЏ РЅРѕРІРёС‡РѕРє?", a: "Р”Р°, РѕР±СѓС‡РµРЅРёРµ РїРѕСЃС‚СЂРѕРµРЅРѕ СЃ РЅСѓР»СЏ, СЂР°Р·Р±РµСЂС‘РјСЃСЏ РІРјРµСЃС‚Рµ." },
            { q: "Рђ РµСЃР»Рё РјРЅРµ РЅРµ РїРѕРЅСЂР°РІРёС‚СЃСЏ?", a: "РЎРІСЏР¶РёС‚РµСЃСЊ СЃ РЅР°РјРё, СЂРµС€РёРј РІРѕРїСЂРѕСЃ." },
            { q: "Angela Pearl СЃР°РјР° РІРµРґС‘С‚ Р·Р°РЅСЏС‚РёСЏ?", a: "Р”Р°, РІС‹ РїРѕР»СѓС‡Р°РµС‚Рµ Р°РІС‚РѕСЂСЃРєСѓСЋ СЃРёСЃС‚РµРјСѓ Рё РїСЂР°РєС‚РёРєРё РѕС‚ Angela." },
            { q: "РљР°Рє РѕРїР»Р°С‚РёС‚СЊ?", a: "РџСЂРѕСЃС‚Рѕ: РїСЂСЏРјРѕ РІ Telegram С‡РµСЂРµР· в­ђ (Р·РІС‘Р·РґС‹), СѓРґРѕР±РЅРѕ Рё Р±РµР·РѕРїР°СЃРЅРѕ." },
          ].map((item, i) => (
            <Card key={i} className="border border-[#eadfcf] rounded-2xl bg-white/70 backdrop-blur-md p-6">
              <h4 className="text-lg font-medium text-[#3c2f1e]">{item.q}</h4>
              <p className="mt-2 text-[#5b4a33]">{item.a}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="text-[#3c2f1e] mb-3">рџЋЃ Р‘РѕРЅСѓСЃ: РјРµС‚РѕРґРёС‡РєР° PDF + РґРѕСЃС‚СѓРї РІ Р·Р°РєСЂС‹С‚С‹Р№ С‡Р°С‚</div>
          <Button
            className="rounded-xl px-6 py-4 text-lg font-semibold"
            style={{ background:"linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)", color:"#2f271a" }}
            onClick={scrollToCourses}
          >
            Р—Р°РїРёСЃР°С‚СЊСЃСЏ СЃРµР№С‡Р°СЃ
          </Button>
        </div>
      </section>

      {/* РљРћРќРўРђРљРўР« */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 relative">
        <div className="pointer-events-none absolute -top-8 left-10 h-32 w-32 rounded-full"
             style={{background:"radial-gradient(circle, rgba(234,217,184,0.5), rgba(215,187,143,0))", filter:"blur(10px)"}}/>
        <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-full"
             style={{background:"radial-gradient(circle, rgba(233,226,212,0.45), rgba(215,187,143,0))", filter:"blur(12px)"}}/>

        <div className="rounded-2xl border border-[#eadfcf] bg-white/70 p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h4 className="text-2xl tracking-tight text-[#2f2619] font-semibold">РћСЃС‚Р°Р»РёСЃСЊ РІРѕРїСЂРѕСЃС‹?</h4>
              <p className="text-[#6b5a43] mt-1">РќР°РїРёС€РёС‚Рµ РІ РїРѕРґРґРµСЂР¶РєСѓ вЂ” РѕС‚РІРµС‚РёРј РѕРїРµСЂР°С‚РёРІРЅРѕ.</p>
            </div>

            {/* Р¤РѕСЂРјР° РєРѕРЅС‚Р°РєС‚Р° */}
            <div className="w-full lg:w-[60%]">
              <div className="text-xs text-[#6b5a43] mb-2">
                РЈРєР°Р¶РёС‚Рµ С…РѕС‚СЏ Р±С‹ РѕРґРёРЅ РєРѕРЅС‚Р°РєС‚: email, С‚РµР»РµС„РѕРЅ РёР»Рё Telegram
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Mail className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cEmail}
                    onChange={(e) => setCEmail(e.target.value)}
                    placeholder="Email"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <Phone className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    placeholder="РўРµР»РµС„РѕРЅ"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
                <div className="flex items-center border border-[#e0d4bf] rounded-xl bg-white/80 px-3">
                  <AtSign className="h-4 w-4 text-[#6b5a43]" />
                  <Input
                    value={cTg}
                    onChange={(e) => setCTg(e.target.value)}
                    placeholder="Telegram (РЅРёРє)"
                    className="border-0 focus-visible:ring-0 text-[#3c2f1e]"
                  />
                </div>
              </div>

              <Textarea
                value={cMsg}
                onChange={(e) => setCMsg(e.target.value)}
                placeholder="Р’Р°С€ РІРѕРїСЂРѕСЃ"
                className="mt-3 border-[#e0d4bf] text-[#3c2f1e]"
              />

              <div className="mt-3 flex items-center gap-3">
                <Button
                  className="rounded-xl px-5 leading-none"
                  variant="outline"
                  style={{ borderColor: "#d9c6a2", color: "#3c2f1e" }}
                  onClick={submitContact}
                  disabled={cSending}
                >
                  {cSending ? "РћС‚РїСЂР°РІР»СЏРµРј..." : <>РќР°РїРёСЃР°С‚СЊ РІ С‡Р°С‚ <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </div>

              {cSent === "invalid" && (
                <div className="text-red-700 text-sm mt-2">
                  Р—Р°РїРѕР»РЅРёС‚Рµ РІРѕРїСЂРѕСЃ Рё СѓРєР°Р¶РёС‚Рµ РјРёРЅРёРјСѓРј РѕРґРёРЅ РєРѕРЅС‚Р°РєС‚ (email, С‚РµР»РµС„РѕРЅ РёР»Рё Telegram).
                </div>
              )}
              {cSent === "ok" && (
                <div className="text-green-700 text-sm mt-2">
                  РЎРїР°СЃРёР±Рѕ! РЎРѕРѕР±С‰РµРЅРёРµ РѕС‚РїСЂР°РІР»РµРЅРѕ вЂ” РјС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё.
                </div>
              )}
              {cSent === "err" && (
                <div className="text-red-700 text-sm mt-2">
                  РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ. РџРѕРїСЂРѕР±СѓР№С‚Рµ РїРѕР·Р¶Рµ.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Р¤СѓС‚РµСЂ */}
      <footer className="border-t border-[#eadfcf] bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#6b5a43]">В© {new Date().getFullYear()} Angela Pearl Academy</div>
          <div className="text-xs text-[#6b5a43] flex items-center gap-4">
            <a href="#" className="hover:opacity-70">РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё</a>
            <a href="#" className="hover:opacity-70">Р”РѕРіРѕРІРѕСЂ РѕС„РµСЂС‚С‹</a>
          </div>
        </div>
      </footer>
    </div>
  );
}


