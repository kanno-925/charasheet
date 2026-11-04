/* ================= オープニング ================= */
(function intro() {
  const el = $('intro'); if (!el) return;
  document.documentElement.style.overflow = 'hidden';
  // 魔法陣：七芒星・六角形・ルーン
  const pt = (r, deg) => [300 + r * Math.cos(deg * Math.PI / 180), 300 + r * Math.sin(deg * Math.PI / 180)];
  $('intro-star').setAttribute('points', Array.from({ length: 7 }, (_, i) => pt(232, -90 + (i * 3 % 7) * 360 / 7).map(v => v.toFixed(1)).join(',')).join(' '));
  $('intro-hex').setAttribute('points', Array.from({ length: 6 }, (_, i) => pt(122, -90 + i * 60).map(v => v.toFixed(1)).join(',')).join(' '));
  const runes = 'ᚠᚢᚦᚨᚱᚲᚷ';
  $('intro-runes').innerHTML = [...runes].map((ch, i) => { const [x, y] = pt(205, -90 + (i + .5) * 360 / 7); return `<text class="rune" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${ch}</text>`; }).join('');

  // 火の粉
  const cv = $('intro-dust'), ctx = cv.getContext('2d');
  let W = 0, H = 0, raf = 0, parts = [];
  const resize = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const spawn = init => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: .6 + Math.random() * 1.8, v: .15 + Math.random() * .55, drift: (Math.random() - .5) * .3, ph: Math.random() * 6.28, gold: Math.random() < .55 });
  resize(); addEventListener('resize', resize);
  parts = Array.from({ length: Math.round(Math.min(90, W * H / 14000)) }, () => spawn(true));
  const tick = t => {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y -= p.v; p.x += p.drift + Math.sin(t / 1400 + p.ph) * .15;
      if (p.y < -10) Object.assign(p, spawn(false));
      const a = .35 + .45 * Math.sin(t / 500 + p.ph) ** 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = p.gold ? `rgba(226,186,110,${a})` : `rgba(120,215,225,${a * .8})`;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  if (!reduceMotion.matches) raf = requestAnimationFrame(tick);

  let entered = false;
  const finish = () => {
    cancelAnimationFrame(raf); removeEventListener('resize', resize); document.removeEventListener('keydown', onKey, true);
    el.remove(); document.documentElement.style.overflow = $('select').hidden ? '' : 'hidden';
  };
  function enter() {
    if (entered) return; entered = true;
    const app = document.querySelector('.app');
    if (reduceMotion.matches) { finish(); return; }
    const b = $('intro-enter').getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const reach = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 2 / 40 * 1.25;
    const flash = document.createElement('div');
    flash.className = 'intro-flash'; flash.style.left = cx + 'px'; flash.style.top = cy + 'px';
    el.appendChild(flash);
    const ease = 'cubic-bezier(.55, 0, .2, 1)';
    el.querySelector('.intro-body').animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.06)', filter: 'blur(8px)' }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
    $('intro-circle').animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 1.7 }], { duration: 1100, easing: ease, fill: 'forwards' });
    flash.animate([{ transform: 'scale(0)', opacity: .95 }, { transform: 'scale(1.4)', opacity: 1, offset: .12 }, { transform: `scale(${reach})`, opacity: 1 }], { duration: 1100, easing: ease, fill: 'forwards' })
      .finished.then(() => {
        el.style.background = 'transparent';
        el.style.pointerEvents = 'none';
        el.querySelectorAll('canvas, .intro-fog, svg, .intro-body').forEach(n => { n.style.display = 'none'; });
        popSelect();
        return flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).finished;
      })
      .then(finish);
  }
  $('intro-enter').addEventListener('click', enter);
  const onKey = e => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); enter(); } };
  document.addEventListener('keydown', onKey, true);
  setTimeout(() => $('intro-enter')?.focus({ preventScroll: true }), 50);
})();
