(function(){
  "use strict";

  var STORAGE_KEY = "byte-cookie-consent-v1";
  var CONSENT_VERSION = 1;
  var layer;
  var panel;
  var previousFocus;

  function readChoice(){
    try {
      var value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return value && value.version === CONSENT_VERSION ? value : null;
    } catch (e) {
      return null;
    }
  }

  function writeChoice(statistics, marketing){
    var choice = {
      version: CONSENT_VERSION,
      necessary: true,
      statistics: Boolean(statistics),
      marketing: Boolean(marketing),
      savedAt: new Date().toISOString()
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choice)); } catch (e) {}
    window.byteCookieConsent = choice;
    window.dispatchEvent(new CustomEvent("byte:consentchange", { detail: choice }));
    return choice;
  }

  function template(showPreferences, canClose){
    return '<section class="cookie-panel" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-description">' +
      '<div class="cookie-panel-head"><div><h2 id="cookie-title">Cookies op bytecompany.nl</h2>' +
      '<p id="cookie-description">We gebruiken noodzakelijke opslag om de website en je cookiekeuze goed te laten werken. Met jouw toestemming kunnen later aanvullende cookies worden gebruikt om de website te verbeteren. Momenteel zijn er geen statistiek- of marketingtools actief. Lees meer in onze <a href="privacy.html">privacyverklaring</a>.</p></div>' +
      (canClose ? '<button class="cookie-close" type="button" data-cookie-close aria-label="Cookie-instellingen sluiten">×</button>' : '') + '</div>' +
      (showPreferences ? preferencesMarkup() : '<div class="cookie-actions"><button class="cookie-action primary" type="button" data-cookie-all>Alles accepteren</button><button class="cookie-action secondary" type="button" data-cookie-necessary>Alleen noodzakelijke cookies</button><button class="cookie-action secondary" type="button" data-cookie-preferences>Voorkeuren instellen</button></div>') +
      '</section>';
  }

  function preferencesMarkup(){
    var choice = readChoice() || { statistics:false, marketing:false };
    return '<div class="cookie-preferences">' +
      '<label class="cookie-option"><span><strong>Noodzakelijk</strong><span>Nodig om je keuze lokaal in deze browser te onthouden.</span></span><input type="checkbox" checked disabled aria-label="Noodzakelijke opslag, altijd actief"></label>' +
      '<label class="cookie-option"><span><strong>Statistieken</strong><span>Momenteel niet in gebruik. Wordt alleen met toestemming geactiveerd als later een analysetool wordt toegevoegd.</span></span><input type="checkbox" data-cookie-statistics ' + (choice.statistics ? 'checked' : '') + '></label>' +
      '<label class="cookie-option"><span><strong>Marketing</strong><span>Momenteel niet in gebruik. Wordt alleen met toestemming geactiveerd als later marketingtechnologie wordt toegevoegd.</span></span><input type="checkbox" data-cookie-marketing ' + (choice.marketing ? 'checked' : '') + '></label>' +
      '<div class="cookie-actions"><button class="cookie-action primary" type="button" data-cookie-save>Voorkeuren opslaan</button><button class="cookie-action secondary" type="button" data-cookie-necessary>Alleen noodzakelijke cookies</button><button class="cookie-action secondary" type="button" data-cookie-all>Alles accepteren</button></div></div>';
  }

  function ensureLayer(){
    if (layer) return;
    layer = document.createElement("div");
    layer.className = "cookie-layer";
    layer.hidden = true;
    document.body.appendChild(layer);
    layer.addEventListener("click", handleClick);
  }

  function openPanel(showPreferences){
    ensureLayer();
    previousFocus = document.activeElement;
    layer.innerHTML = template(Boolean(showPreferences), Boolean(readChoice()));
    layer.hidden = false;
    panel = layer.querySelector(".cookie-panel");
    var firstButton = panel.querySelector("button");
    if (firstButton) firstButton.focus();
  }

  function closePanel(){
    if (!layer) return;
    layer.hidden = true;
    layer.innerHTML = "";
    if (previousFocus && previousFocus.focus) previousFocus.focus();
  }

  function showToast(){
    var toast = document.createElement("div");
    toast.className = "cookie-toast";
    toast.setAttribute("role", "status");
    toast.textContent = "Je cookievoorkeuren zijn opgeslagen.";
    document.body.appendChild(toast);
    requestAnimationFrame(function(){ toast.classList.add("show"); });
    setTimeout(function(){ toast.classList.remove("show"); setTimeout(function(){ toast.remove(); }, 250); }, 2600);
  }

  function save(statistics, marketing){
    writeChoice(statistics, marketing);
    closePanel();
    showToast();
  }

  function handleClick(e){
    if (e.target.closest("[data-cookie-all]")) return save(true, true);
    if (e.target.closest("[data-cookie-necessary]")) return save(false, false);
    if (e.target.closest("[data-cookie-preferences]")) return openPanel(true);
    if (e.target.closest("[data-cookie-save]")) {
      return save(layer.querySelector("[data-cookie-statistics]").checked, layer.querySelector("[data-cookie-marketing]").checked);
    }
    if (e.target.closest("[data-cookie-close]")) closePanel();
  }

  document.addEventListener("click", function(e){
    if (e.target.closest("[data-cookie-settings]")) {
      e.preventDefault();
      openPanel(true);
    }
  });

  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && layer && !layer.hidden && readChoice()) closePanel();
  });

  window.byteCookieConsent = readChoice() || { version:CONSENT_VERSION, necessary:true, statistics:false, marketing:false };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){ if (!readChoice()) openPanel(false); });
  } else if (!readChoice()) {
    openPanel(false);
  }
})();
