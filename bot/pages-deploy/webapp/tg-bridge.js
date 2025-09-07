(()=> {
  const TG = window.Telegram?.WebApp;

  function toTgDeepLink(u){
    try{
      const url = new URL(u);
      if (url.hostname !== "t.me") return u;
      const parts = url.pathname.replace(/^\/+/, "").split("/");
      const domain  = parts[0] || "";
      const appname = parts[1] || ""; // list/app
      const sp = url.searchParams;
      const start    = sp.get("start");
      const startapp = sp.get("startapp");
      if (!domain) return u;
      let tg = `tg://resolve?domain=${domain}`;
      if (appname)  tg += `&appname=${encodeURIComponent(appname)}`;
      if (start)    tg += `&start=${encodeURIComponent(start)}`;
      if (startapp) tg += `&startapp=${encodeURIComponent(startapp)}`;
      return tg;
    }catch(_){ return u; }
  }

  function open(url){
    const deep = toTgDeepLink(url);
    try { TG?.openTelegramLink ? TG.openTelegramLink(deep) : (top.location.href = deep); }
    catch { top.location.href = deep; }
  }

  window.addEventListener("message", (e)=>{
    try{
      const d = e?.data;
      if (d && d.type === "OPEN_TME" && typeof d.url === "string") open(d.url);
    }catch(_){}
  });
})();
