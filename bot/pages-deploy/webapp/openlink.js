(()=> {
  const TG = window.Telegram?.WebApp;
  try { TG?.ready(); TG?.expand?.(); } catch {}

  function openThenClose(url){
    try {
      if (TG?.openLink) TG.openLink(url);   // iOS/Android: встроенный браузер Telegram
      else location.href = url;             // desktop fallback
    } finally {
      try { setTimeout(()=>TG?.close?.(), 300); } catch {}
    }
  }

  document.addEventListener("click", (ev)=>{
    const t = ev.target instanceof Element ? ev.target.closest("a,button,[data-href]") : null;
    if (!t) return;

    const isMore =
      t.hasAttribute("data-open-browser") ||
      /подробнее о курсах/i.test((t.textContent||"").trim());

    if (!isMore) return;

    const url =
      (t instanceof HTMLAnchorElement && t.href) ||
      t.getAttribute?.("href") ||
      t.getAttribute?.("data-href") ||
      "";

    if (!url) return;

    ev.preventDefault();
    openThenClose(url);
  }, { capture:true, passive:false });
})();
