(()=> {
  const TG = window.Telegram?.WebApp;
  try { TG?.ready(); TG?.expand?.(); } catch {}

  function ensureUI(){
    let ov = document.getElementById("inapp-overlay");
    if (ov) return ov;
    const style = document.createElement("style");
    style.textContent = `
      .inapp-overlay{position:fixed;inset:0;display:none;z-index:99999;background:var(--tg-theme-bg-color,#000)}
      .inapp-overlay.open{display:block}
      .inapp-iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}
      html,body{overscroll-behavior:none}`;
    document.head.appendChild(style);

    ov = document.createElement("div");
    ov.id = "inapp-overlay"; ov.className = "inapp-overlay";
    ov.innerHTML = `<iframe id="inapp-frame" class="inapp-iframe"
      allow="clipboard-write; autoplay; fullscreen"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"></iframe>`;
    document.body.appendChild(ov);
    return ov;
  }

  function buildFrameUrl(raw){
    const url = raw || "https://angelapearl-academy.pages.dev/";
    try{
      const u = new URL(url, location.origin);
      if (u.origin === location.origin && u.pathname === "/proxy" && u.searchParams.get("u")) return u.href;
    }catch{}
    return "/proxy?u="+encodeURIComponent(url);
  }

  function openInApp(url){
    const ov = ensureUI();
    ov.classList.add("open");
    const f = document.getElementById("inapp-frame");
    const finalUrl = buildFrameUrl(url);
    try {
      TG?.BackButton.show();
      TG?.BackButton.onClick(closeInApp);
      TG?.HapticFeedback?.impactOccurred?.("soft");
    } catch {}
    f.src = finalUrl;
  }

  function closeInApp(){
    const ov = document.getElementById("inapp-overlay");
    const f  = document.getElementById("inapp-frame");
    if (ov) ov.classList.remove("open");
    if (f)  f.src = "about:blank";
    try { TG?.BackButton.hide(); } catch {}
  }

  // перехватываем только "Подробнее о курсах" (или явно помеченные data-inapp)
  document.addEventListener("click", (ev)=>{
    const t = ev.target instanceof Element ? ev.target.closest("a,button") : null;
    if (!t) return;
    const explicit = t.hasAttribute("data-inapp");
    const byText = /подробнее о курсах/i.test((t.textContent||"").trim());
    if (!(explicit || byText)) return;

    const url = (t instanceof HTMLAnchorElement && t.href) || t.getAttribute("data-href");
    if (!url) return;

    ev.preventDefault();
    openInApp(url);
  }, { capture:true, passive:false });

  window.InAppView = { open: openInApp, close: closeInApp };
})();
