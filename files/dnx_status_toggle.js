/* DNX_STATUS_TOGGLE_START */
(function(){
  "use strict";

  if(window.__dnxStatusToggle) return;
  window.__dnxStatusToggle=true;

  var STORE="dnx.status.visible";
  var BUTTON_ID="dnx-btn-status-toggle";

  function isVisible(){
    try{
      var value=localStorage.getItem(STORE);

      if(value===null) return true;

      return value==="1";
    }catch(error){
      return true;
    }
  }

  function save(value){
    try{
      localStorage.setItem(
        STORE,
        value ? "1" : "0"
      );
    }catch(error){}
  }

  function apply(){
    var visible=isVisible();

    var status=document.getElementById(
      "dnx-live-status"
    );

    if(status){
      status.style.setProperty(
        "display",
        visible ? "block" : "none",
        "important"
      );

      status.style.setProperty(
        "visibility",
        visible ? "visible" : "hidden",
        "important"
      );

      status.style.setProperty(
        "opacity",
        visible ? "1" : "0",
        "important"
      );
    }

    var button=document.getElementById(
      BUTTON_ID
    );

    if(button){
      button.textContent=
        "DNX Status: " +
        (visible ? "On" : "Off");

      button.style.setProperty(
        "background",
        visible ? "#168cff" : "#666666",
        "important"
      );

      button.style.setProperty(
        "color",
        "#ffffff",
        "important"
      );

      button.style.setProperty(
        "border",
        "1px solid #ffffff",
        "important"
      );

      button.style.setProperty(
        "box-shadow",
        visible
          ? "0 0 10px rgba(22,140,255,.55)"
          : "none",
        "important"
      );
    }
  }

  function ensureButton(){
    var host=document.getElementById(
      "dnx-line-toggle-box"
    );

    if(!host){
      var receiver=document.getElementById("openwebrx-panel-receiver");
      if(!receiver) return false;
      host=document.createElement("div");
      host.id="dnx-line-toggle-box";
      host.style.cssText="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0 8px";
      receiver.insertBefore(host,receiver.firstChild);
    }

    var button=document.getElementById(
      BUTTON_ID
    );

    if(!button){
      button=document.createElement("button");
      button.id=BUTTON_ID;
      button.type="button";

      button.style.cssText=
        "height:26px;" +
        "padding:0 10px;" +
        "border-radius:999px;" +
        "border:1px solid #ffffff;" +
        "background:#168cff;" +
        "color:#ffffff;" +
        "font:700 12px/1 Segoe UI,sans-serif;" +
        "cursor:pointer;";

      button.addEventListener(
        "click",
        function(){
          save(!isVisible());
          apply();
        }
      );

      host.appendChild(button);
    }

    apply();
    return true;
  }

  function boot(){
    ensureButton();
    apply();

    setInterval(function(){
      ensureButton();
      apply();
    },500);
  }

  if(document.readyState==="loading"){
    document.addEventListener(
      "DOMContentLoaded",
      boot,
      {once:true}
    );
  }else{
    boot();
  }

  window.addEventListener("load",boot);
})();
/* DNX_STATUS_TOGGLE_END */
