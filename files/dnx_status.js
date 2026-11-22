/* DNX_STATUS_V1_START */
(function(){
  "use strict";
  if(window.__dnxStatusV1Loaded) return;
  window.__dnxStatusV1Loaded = true;

  var STATUS_ID = "dnx-live-status";
  var BTN_ID = "dnx-btn-status-toggle";
  var POS_KEY = "dnx_status_pos";
  var BTN_POS_KEY = "dnx.status.btn.pos.v1";
  var VIS_KEY = "dnx_status_visible";

  function isWanted(){ try{ var v = localStorage.getItem(VIS_KEY); return v === null ? true : v === "1"; }catch(e){ return true; } }
  function setWanted(v){ try{ localStorage.setItem(VIS_KEY, v ? "1" : "0"); }catch(e){} }

  function makeDraggable(el, storageKey, defaultPos, onClickOnly){
    if(el.__dnxDrag) return; el.__dnxDrag = true;
    var isDown=false, moved=false, sx=0, sy=0, ol=0, ot=0;
    el.addEventListener("pointerdown",function(e){
      if(e.button!==undefined && e.button!==0) return;
      isDown=true; moved=false; var r=el.getBoundingClientRect();
      sx=e.clientX; sy=e.clientY; ol=r.left; ot=r.top;
      el.style.cursor="grabbing"; try{ el.setPointerCapture(e.pointerId); }catch(err){}
    });
    el.addEventListener("pointermove",function(e){
      if(!isDown) return; var dx=e.clientX-sx, dy=e.clientY-sy;
      if(!moved && Math.abs(dx)+Math.abs(dy)<=5) return;
      moved=true; if(el.parentNode !== document.body) document.body.appendChild(el);
      el.style.position="fixed"; el.style.right="auto";
      el.style.left=Math.max(4,Math.min(window.innerWidth-el.offsetWidth-4,Math.round(ol+dx)))+"px";
      el.style.top=Math.max(4,Math.min(window.innerHeight-el.offsetHeight-4,Math.round(ot+dy)))+"px";
    });
    function up(e){
      if(!isDown) return; isDown=false; el.style.cursor="grab";
      try{ if(el.releasePointerCapture) el.releasePointerCapture(e.pointerId); }catch(err){}
      if(moved){
        try{ localStorage.setItem(storageKey, JSON.stringify({ left: el.style.left, top: el.style.top })); }catch(err){}
        el.dataset.dnxSuppress="1"; setTimeout(function(){ delete el.dataset.dnxSuppress; }, 220);
      } else if(onClickOnly){ onClickOnly(); }
    }
    el.addEventListener("pointerup",up); el.addEventListener("pointercancel",up);
    el.addEventListener("dblclick",function(e){
      e.preventDefault(); e.stopPropagation();
      try{ localStorage.removeItem(storageKey); }catch(err){}
      if(defaultPos){ el.style.left=defaultPos.left; el.style.top=defaultPos.top; }
    });
  }
  function restorePosition(el, key, defLeft, defTop){
    try{ var p=JSON.parse(localStorage.getItem(key)||"null"); if(p&&p.left&&p.top){ el.style.left=p.left; el.style.top=p.top; return true; } }catch(e){}
    if(defLeft) el.style.left=defLeft; if(defTop) el.style.top=defTop; return false;
  }
  function ensureToggleBtn(){
    var host = document.getElementById("dnx-line-toggle-box");
    if(!host){
      var r = document.getElementById("openwebrx-panel-receiver");
      if(r){
        host = document.createElement("div"); host.id = "dnx-line-toggle-box";
        host.style.cssText = "display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0 8px 0;";
        r.insertBefore(host, r.firstChild);
      }
    }
    var b = document.getElementById(BTN_ID);
    if(!b){
      b = document.createElement("button"); b.id = BTN_ID; b.type = "button";
      b.style.cssText = "height:26px;padding:0 10px;border-radius:999px;border:1px solid #fff;font:700 12px/1 Segoe UI,sans-serif;cursor:grab;user-select:none;touch-action:none;";
      b.title = "Klick = Status ein/aus · Ziehen = Button verschieben · Doppelklick = Reset";
      makeDraggable(b, BTN_POS_KEY, null, function(){ setWanted(!isWanted()); syncVisibility(); });
      b.addEventListener("dblclick", function(){ if(host && b.parentNode !== host){ host.appendChild(b); b.style.position=""; b.style.left=""; b.style.top=""; } });
      if(host) host.appendChild(b); else document.body.appendChild(b);
    }
    try{ if(localStorage.getItem(BTN_POS_KEY)) restorePosition(b, BTN_POS_KEY); }catch(e){}
    var on = isWanted();
    b.textContent = "DNX Status: " + (on ? "On" : "Off");
    b.style.setProperty("background", on ? "#168cff" : "#666666", "important");
    b.style.setProperty("color", "#ffffff", "important");
  }
  function syncVisibility(){
    var el = document.getElementById(STATUS_ID), on = isWanted();
    if(el) el.style.display = on ? "block" : "none";
    ensureToggleBtn();
  }
  async function fetchStatus(){
    var urls = ["/status.json?ts=" + Date.now(), "/static/static/settings.json?ts=" + Date.now()];
    for(var i=0;i<urls.length;i++){
      try{ var resp = await fetch(urls[i], {cache:"no-store"}); if(resp.ok) return await resp.json(); }catch(e){}
    }
    return null;
  }
  async function updateStatus(){
    ensureToggleBtn();
    var el = document.getElementById(STATUS_ID);
    if(!el){
      el = document.createElement("div"); el.id = STATUS_ID;
      el.title = "Ziehen = Statusleiste frei verschieben · Doppelklick = Standardposition";
      el.style.cssText = "position:fixed;left:20px;top:20px;z-index:999999;padding:8px 16px;border-radius:12px;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);color:#fff;font-size:13px;font-weight:700;white-space:nowrap;cursor:grab;user-select:none;touch-action:none;border:1px solid rgba(22,140,255,.55);box-shadow:0 0 18px rgba(0,180,255,.35);";
      document.body.appendChild(el);
      restorePosition(el, POS_KEY, "20px", "20px");
      makeDraggable(el, POS_KEY, { left: "20px", top: "20px" });
    }
    el.style.display = isWanted() ? "block" : "none";
    if(!isWanted()) return;
    var cfg = await fetchStatus();
    if(!cfg){ el.textContent = "DNX STATUS | Offline"; return; }
    var sdrs = cfg.sdrs || {}, profiles = 0;
    Object.values(sdrs).forEach(function(v){ profiles += Object.keys(v.profiles||{}).length; });
    var devices = Object.keys(sdrs).length;
    var rxName = (cfg.receiver && cfg.receiver.name) || cfg.receiver_name || "OpenWebRX+";
    var users = (typeof cfg.clients === "number") ? cfg.clients : 0;
    el.textContent = "DNX STATUS | " + rxName + " | 📡 " + profiles + " Profile | 📻 Devices: " + devices + " | 👤 Clients: " + users;
  }
  function boot(){ updateStatus(); setInterval(updateStatus, 3000); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 800); }, {once:true});
  else setTimeout(boot, 800);
})();
/* DNX_STATUS_V1_END */
