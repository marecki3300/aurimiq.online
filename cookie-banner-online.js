(function () {
  var COOKIE_KEY = 'aurimiq_cookie_consent';

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function removeBanner() {
    var el = document.getElementById('aurimiq-cookie-banner');
    if (el) el.remove();
  }

  function accept() {
    setCookie(COOKIE_KEY, 'accepted', 365);
    removeBanner();
  }

  function decline() {
    setCookie(COOKIE_KEY, 'declined', 365);
    removeBanner();
  }

  function injectBanner() {
    var style = document.createElement('style');
    style.textContent = [
      '#aurimiq-cookie-banner{',
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;',
      'background:#0d0d0d;border-top:1px solid #c9a84c;',
      'padding:18px 24px;display:flex;align-items:center;',
      'justify-content:space-between;gap:16px;flex-wrap:wrap;',
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'font-size:13px;color:#ccc;box-shadow:0 -4px 24px rgba(0,0,0,0.5);',
      '}',
      '#aurimiq-cookie-banner p{margin:0;flex:1;min-width:220px;line-height:1.5;}',
      '#aurimiq-cookie-banner a{color:#c9a84c;text-decoration:underline;}',
      '#aurimiq-cookie-banner .cb-btns{display:flex;gap:10px;flex-shrink:0;}',
      '#aurimiq-cookie-banner button{',
      'padding:8px 18px;border-radius:4px;font-size:13px;font-weight:500;',
      'cursor:pointer;border:1px solid #c9a84c;transition:opacity .2s;',
      '}',
      '#aurimiq-cookie-banner button:hover{opacity:.8;}',
      '#aurimiq-cookie-accept{background:#c9a84c;color:#000;}',
      '#aurimiq-cookie-decline{background:transparent;color:#c9a84c;}',
    ].join('');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'aurimiq-cookie-banner';
    banner.innerHTML = [
      '<p>This site uses only essential cookies — no tracking, no ads, no third-party profiling.',
      'See our <a href="/privacy-policy.html">Privacy Policy</a> for details.</p>',
      '<div class="cb-btns">',
      '<button id="aurimiq-cookie-decline">Essential only</button>',
      '<button id="aurimiq-cookie-accept">Got it</button>',
      '</div>',
    ].join('');
    document.body.appendChild(banner);

    document.getElementById('aurimiq-cookie-accept').addEventListener('click', accept);
    document.getElementById('aurimiq-cookie-decline').addEventListener('click', decline);
  }

  if (!getCookie(COOKIE_KEY)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
      injectBanner();
    }
  }
})();
