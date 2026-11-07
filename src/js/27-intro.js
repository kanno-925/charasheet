/* ================= オープニング ================= */
(function intro() {
  // 前に使っていたテーマの見た目を、保存データの読み込みを待たずに先に当てる（最初の画面がそのテーマで出るように）
  try { const lk = localStorage.getItem('charasheet-kobo.look'); if (lk != null && !document.documentElement.dataset.look) document.documentElement.dataset.look = lk; } catch (e) { /* */ }
  const el = $('intro'); if (!el) return;
  // 共有リンクから開いたときは、オープニングを飛ばしてすぐにキャラシを見せる
  if (/[?&]share=[0-9a-f]{32}/.test(location.search)) { el.remove(); return; }
  document.documentElement.style.overflow = 'hidden';
  // はじめの画面は2種類：ORBiS（星空と光。ふつうはこちら）と、魔法陣（前からの画面）。テーマ・背景の小窓で切りかえ（localStorage に覚える）
  let style = 'orbis';
  try { style = localStorage.getItem('charasheet-kobo.intro') || 'orbis'; } catch (e) { /* */ }
  const orbis = style !== 'classic';
  if (orbis) {
    const mark = 'assets/brand/mark.webp', logo = 'assets/brand/logo-dark.webp';
    const star = (cx, cy, r) => `<path class="obi-sp" d="M${cx} ${cy - r}Q${cx + r * .16} ${cy - r * .16} ${cx + r} ${cy}Q${cx + r * .16} ${cy + r * .16} ${cx} ${cy + r}Q${cx - r * .16} ${cy + r * .16} ${cx - r} ${cy}Q${cx - r * .16} ${cy - r * .16} ${cx} ${cy - r}Z"/>`;
    el.classList.add('ob-intro');
    el.innerHTML = `<i class="obi-sky" aria-hidden="true"></i><i class="obi-cloud c1" aria-hidden="true"></i><i class="obi-cloud c2" aria-hidden="true"></i>
      <canvas class="intro-dust" id="intro-dust" aria-hidden="true"></canvas>
      <svg class="intro-circle obi-orbits" id="intro-circle" viewBox="0 0 600 600" aria-hidden="true">
        <g class="obi-ring r1"><ellipse cx="300" cy="300" rx="292" ry="104"/></g><g class="obi-ring r2"><ellipse cx="300" cy="300" rx="232" ry="78"/></g><g class="obi-ring r3"><ellipse cx="300" cy="300" rx="270" ry="150"/></g>
        <path id="obi-path" d="M8 300a292 104 0 1 0 584 0a292 104 0 1 0 -584 0" fill="none"/>
        <circle r="5" class="obi-sat"><animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#obi-path"/></animateMotion></circle>
        ${star(84, 160, 14)}${star(520, 120, 10)}${star(470, 470, 16)}${star(130, 450, 8)}${star(300, 40, 9)}
      </svg>
      <div class="intro-body obi-body">
        <img class="obi-mark" src="${mark}" alt="" draggable="false">
        <img class="obi-logo" src="${logo}" alt="ORBiS" draggable="false">
        <p class="obi-tag">Where Stories Intersect.</p>
        <h2 class="obi-title" id="intro-title">物語が交わる、星の記録帳へ。</h2>
        <button class="intro-btn obi-btn" id="intro-enter" type="button"><span>ORBiS をひらく</span></button>
        <p class="obi-foot">CALL OF CTHULHU ・ CHARACTER SHEET ・ for CCFOLIA</p>
      </div>`;
  } else {
    // 魔法陣：七芒星・六角形・ルーン
    const pt = (r, deg) => [300 + r * Math.cos(deg * Math.PI / 180), 300 + r * Math.sin(deg * Math.PI / 180)];
    $('intro-star').setAttribute('points', Array.from({ length: 7 }, (_, i) => pt(232, -90 + (i * 3 % 7) * 360 / 7).map(v => v.toFixed(1)).join(',')).join(' '));
    $('intro-hex').setAttribute('points', Array.from({ length: 6 }, (_, i) => pt(122, -90 + i * 60).map(v => v.toFixed(1)).join(',')).join(' '));
    const runes = 'ᚠᚢᚦᚨᚱᚲᚷ';
    $('intro-runes').innerHTML = [...runes].map((ch, i) => { const [x, y] = pt(205, -90 + (i + .5) * 360 / 7); return `<text class="rune" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${ch}</text>`; }).join('');
  }

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
      ctx.fillStyle = orbis ? (p.gold ? `rgba(255,255,255,${a})` : `rgba(170,160,255,${a * .8})`) : p.gold ? `rgba(226,186,110,${a})` : `rgba(120,215,225,${a * .8})`;
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

/* ---- はじめの画面の切りかえ（テーマ・背景の小窓） ---- */
function renderIntroPick() {
  let cur = 'orbis'; try { cur = localStorage.getItem('charasheet-kobo.intro') || 'orbis'; } catch (e) { /* */ }
  document.querySelectorAll('[data-intro]').forEach(b => { const on = b.dataset.intro === cur; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
}
$('intro-pick')?.addEventListener('click', e => {
  const b = e.target.closest('[data-intro]'); if (!b) return;
  try { localStorage.setItem('charasheet-kobo.intro', b.dataset.intro); } catch (er) { /* */ }
  renderIntroPick();
  toast(b.dataset.intro === 'classic' ? '次に開いたときから、はじめの画面は「魔法陣」になります。' : '次に開いたときから、はじめの画面は「ORBiS」になります。');
});
$('btn-theme').addEventListener('click', renderIntroPick);
