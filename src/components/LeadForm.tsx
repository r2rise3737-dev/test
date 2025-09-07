'use client';

import React, { useState } from 'react';

type Props = {
  /** откуда пришла заявка; для нижней формы лучше "contact" */
  source?: 'contact' | 'lead';
  /** направление/метка (если нужно подсветить в сообщении) */
  track?: string;
};

export default function LeadForm({ source = 'contact', track = '' }: Props) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setError('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          email,
          phone,
          telegram,
          question,
          source,
          track,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Не удалось отправить. Попробуйте позже.');
      }

      setStatus('ok');
      setEmail('');
      setPhone('');
      setTelegram('');
      setQuestion('');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Ошибка';
      setStatus('error');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-[#e7dfd2] bg-white px-3 py-2 outline-none"
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-[#e7dfd2] bg-white px-3 py-2 outline-none"
        />
        <input
          placeholder="Telegram (ник)"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
          className="w-full rounded-md border border-[#e7dfd2] bg-white px-3 py-2 outline-none"
        />
      </div>

      <textarea
        placeholder="Ваш вопрос"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        className="w-full rounded-md border border-[#e7dfd2] bg-white px-3 py-2 outline-none"
      />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold transition-transform active:scale-[0.98] disabled:opacity-60"
          style={{
            background:
              'linear-gradient(180deg, #ead9b8 0%, #d7bd8f 40%, #bf965d 100%)',
            color: '#2f271a',
            boxShadow:
              '0 14px 30px rgba(191,150,93,0.35), inset 0 1px 0 rgba(255,255,255,0.6)',
          }}
        >
          Написать в чат
        </button>

        {status === 'ok' && (
          <span className="text-[#2f2619] text-sm">Отправлено! Ответим оперативно.</span>
        )}
        {status === 'error' && (
          <span className="text-red-600 text-sm">{error}</span>
        )}
      </div>
    </form>
  );
}
