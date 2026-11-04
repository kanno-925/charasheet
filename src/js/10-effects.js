/* ================= ふわっとエフェクト ================= */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const SPARK = ['var(--orange)', 'var(--pink)', 'var(--yellow)', 'var(--cyan)', 'var(--lime)', 'var(--sky)'];
function fx(x, y, burst = false) {
  if (reduceMotion.matches) return;
  const make = (cls, vars) => {
    const e = document.createElement('span');
    e.className = 'fx ' + cls; e.style.left = x + 'px'; e.style.top = y + 'px';
    if (vars) Object.entries(vars).forEach(([k, v]) => e.style.setProperty(k, v));
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 1400);
  };
  make('fx-bloom'); make('fx-ring'); make('fx-ring late');
  if (burst) {
    make('fx-ring big');
    for (let i = 0; i < 14; i++) {
      const ang = i / 14 * Math.PI * 2 + Math.random() * .3, dist = 70 + Math.random() * 60;
      make('fx-spark', { '--dx': Math.cos(ang) * dist + 'px', '--dy': Math.sin(ang) * dist + 'px', '--c': SPARK[i % SPARK.length] });
    }
  }
}
function fxAt(el, burst) { const r = el.getBoundingClientRect(); fx(r.left + r.width / 2, r.top + r.height / 2, burst); }
function enter(el) { if (!el || reduceMotion.matches) return; el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); }
document.addEventListener('pointerdown', e => { if (e.button === 0) fx(e.clientX, e.clientY); });

function renderAll() { applyBg(); if (!$('select').hidden) renderSelect(); $('copy-status').textContent = ''; renderShelf(); renderSheet(); renderOutput(); enter($('sheet')); enter(document.querySelector('.koma')); }
function touch() {
  const c = active(); c.updatedAt = Date.now(); delete c.sample;
  save(); renderShelf(); renderOutput(); updateComputed();
  const tk = document.querySelector('.hub-core .token, .bk-portrait .token');
  if (tk) tk.outerHTML = tokenHtml(c);
}
