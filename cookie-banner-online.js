/* ══════════════════════════════════════════════════════════════════════
   AURIMIQ.ai — zgoda na pomiary
   Przepisane 23.08.2026.

   Co bylo nie tak w poprzedniej wersji:

   1. Baner glosil "This site uses only essential cookies — no tracking,
      no ads, no third-party profiling", podczas gdy strona ladowala DWIE
      wlasnosci Google Analytics i Microsoft Clarity. Clarity nagrywa
      sesje uzytkownika. To zdanie bylo po prostu nieprawdziwe.
   2. Przyciski nie robily nic poza ustawieniem ciasteczka. Skrypty
      pomiarowe startowaly i tak, w <head>, zanim baner sie pokazal.

   Jak dziala teraz: GA i Clarity NIE ladują sie, dopoki uzytkownik nie
   wyrazi zgody. Odmowa jest rownie latwa jak zgoda — oba przyciski maja
   te sama wage wizualna, czego wymaga m.in. niemiecki § 25 TDDDG.
   Decyzje mozna zmienic pozniej linkiem w stopce.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'aurimiq_consent';           // 'granted' | 'denied'
  var GA_IDS = ['G-CNFQN7YZT6', 'G-GRMPYR8YV3'];
  var CLARITY_ID = 'x6guaire2v';

  // ── Tekst w trzech jezykach ──────────────────────────────────────────
  var T = {
    pl: {
      body: 'Używamy Google Analytics i Microsoft Clarity, żeby zobaczyć, jak korzystasz ze strony. Clarity rejestruje ruchy myszy i kliknięcia. Bez Twojej zgody nie uruchamiamy żadnego z tych narzędzi.',
      yes: 'Zgadzam się', no: 'Bez pomiarów', more: 'Prywatność', change: 'Cookies'
    },
    en: {
      body: 'We use Google Analytics and Microsoft Clarity to see how the site is used. Clarity records mouse movement and clicks. Neither runs without your consent.',
      yes: 'Accept', no: 'Decline', more: 'Privacy', change: 'Cookies'
    },
    de: {
      body: 'Wir nutzen Google Analytics und Microsoft Clarity, um zu sehen, wie die Seite verwendet wird. Clarity zeichnet Mausbewegungen und Klicks auf. Ohne Ihre Einwilligung wird keines davon geladen.',
      yes: 'Einverstanden', no: 'Ablehnen', more: 'Datenschutz', change: 'Cookies'
    }
  };

  function lang() {
    var l = window.AURIMIQ_LANG
         || (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase()
         || (navigator.language || 'en').slice(0, 2).toLowerCase();
    return T[l] ? l : 'en';
  }

  // ── Trwalosc decyzji ─────────────────────────────────────────────────
  // localStorage z zapasem na ciasteczko: w trybie prywatnym zapis
  // do localStorage potrafi rzucic wyjatkiem.
  function read() {
    try { var v = localStorage.getItem(KEY); if (v) { return v; } } catch (e) {}
    var m = document.cookie.match(/(?:^|;\s*)aurimiq_consent=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    var exp = new Date(Date.now() + 365 * 864e5).toUTCString();
    document.cookie = 'aurimiq_consent=' + v + ';expires=' + exp + ';path=/;SameSite=Lax';
  }

  // ── Wlaczenie pomiarow. Wolane WYLACZNIE po zgodzie ──────────────────
  var loaded = false;
  function loadAnalytics() {
    if (loaded) { return; }
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_IDS[0];
    document.head.appendChild(g);
    window.gtag('js', new Date());
    GA_IDS.forEach(function (id) { window.gtag('config', id); });

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  // ── Baner ────────────────────────────────────────────────────────────
  function show() {
    if (document.getElementById('aurimiqConsent')) { return; }
    var t = T[lang()];
    var box = document.createElement('div');
    box.id = 'aurimiqConsent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', t.more);
    box.style.cssText =
      'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#0a0e18;' +
      'border-top:1px solid rgba(201,168,76,.35);padding:16px 18px;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;' +
      'font-size:13px;line-height:1.6;color:#c8d0d8;display:flex;flex-wrap:wrap;' +
      'gap:12px;align-items:center;justify-content:center;box-shadow:0 -8px 30px rgba(0,0,0,.5)';

    var btn = 'padding:9px 20px;border-radius:4px;cursor:pointer;font-size:12px;' +
              'font-weight:600;border:1px solid #c9a84c;letter-spacing:.04em';

    box.innerHTML =
      '<span style="max-width:640px">' + t.body + '</span>' +
      '<span style="display:flex;gap:10px;flex-shrink:0">' +
        '<button id="acDeny"  style="' + btn + ';background:transparent;color:#c9a84c">' + t.no + '</button>' +
        '<button id="acAllow" style="' + btn + ';background:#c9a84c;color:#06080e">' + t.yes + '</button>' +
      '</span>';

    document.body.appendChild(box);

    document.getElementById('acAllow').onclick = function () {
      write('granted'); box.remove(); loadAnalytics();
    };
    document.getElementById('acDeny').onclick = function () {
      write('denied'); box.remove();
    };
  }

  // Pozwala zmienic zdanie — wycofanie zgody musi byc tak samo latwe
  // jak jej udzielenie. Podepnij pod link "Cookies" w stopce.
  window.aurimiqCookieSettings = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    document.cookie = 'aurimiq_consent=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    show();
  };

  function start() {
    var c = read();
    if (c === 'granted') { loadAnalytics(); }
    else if (c !== 'denied') { show(); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
