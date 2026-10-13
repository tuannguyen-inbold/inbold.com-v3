// Breakpoints: mobile <768, tablet 768–1199, desktop ≥1200.
// Every [data-g] grid gets an explicit column count chosen from its breakpoint, size class (s/m/l) and child count, so rows are never ragged.
(function () {
  if (window.__inboldBP) return; window.__inboldBP = true;
  function bp() { var w = window.innerWidth; return w < 768 ? 'mobile' : w < 1200 ? 'tablet' : 'desktop'; }
  function fit(n, max) { // largest column count ≤ max that divides n evenly (falls back to max when nothing divides)
    if (n <= max) return n;
    for (var c = max; c >= 2; c--) if (n % c === 0) return c;
    return max;
  }
  function cols(k, n, b) {
    if (n < 1) return 1;
    if (b === 'desktop') return k === 's' ? fit(n, 6) : k === 'm' ? fit(n, n === 5 ? 5 : 4) : fit(n, 3);
    if (b === 'tablet') return k === 's' ? fit(n, 4) : k === 'm' ? (n === 3 ? 3 : fit(n, 2) === 2 || n % 2 === 0 ? 2 : (n % 3 === 0 ? 3 : 2)) : (n % 2 === 0 ? 2 : 1);
    return k === 's' ? (n % 2 === 0 ? 2 : 1) : 1;
  }
  function apply() {
    var b = bp();
    document.querySelectorAll('[data-g]').forEach(function (el) {
      var n = 0; for (var i = 0; i < el.children.length; i++) { var c = el.children[i]; if (c.tagName !== 'TEMPLATE' && getComputedStyle(c).display !== 'none') n++; }
      n = Math.max(n, +el.getAttribute('data-slots') || 0); // data-slots: size as if the grid held this many items
      var c2 = cols(el.getAttribute('data-g'), n, b);
      el.style.setProperty('grid-template-columns', 'repeat(' + c2 + ',minmax(0,1fr))', 'important');
    });
    document.querySelectorAll('[data-pad]').forEach(function (el) {
      if (el.dataset.pl === undefined) { el.dataset.pl = el.style.paddingLeft; el.dataset.pr = el.style.paddingRight; }
      if (b === 'mobile') { el.style.setProperty('padding-left', '20px', 'important'); el.style.setProperty('padding-right', '20px', 'important'); }
      else { el.style.setProperty('padding-left', el.dataset.pl); el.style.setProperty('padding-right', el.dataset.pr); }
    });
  }
  var t; function schedule() { clearTimeout(t); t = setTimeout(apply, 30); }
  window.addEventListener('resize', schedule);
  new MutationObserver(function (m) { for (var i = 0; i < m.length; i++) { if (m[i].type === 'childList') { schedule(); return; } } }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState !== 'loading') schedule(); else document.addEventListener('DOMContentLoaded', schedule);
})();
