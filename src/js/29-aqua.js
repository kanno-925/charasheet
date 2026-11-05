/* ================= アクアリウムテーマ（look: aqua）：水底の遺跡、光の帯、くらげ、ガラスの泡のような画面 =================
   ・背景は見本の絵から文字を消した assets/aqua/scene.webp（少し暗め）。canvas はその上で動く光・粒・泡だけ
   ・画面の切りかえは aquaWave：ぼやけた水の中（assets/aqua/bokeh.webp）にガラスの札と光の輪、泡がのぼる
   ・キャラシは aquaHtml（ガラスの水槽のようなパネル） */
const isAqua = () => (presetOf().look || '').split(' ').includes('aqua');
const AQ = { on: false, raf: 0, last: 0, W: 0, H: 0, k: 1, bub: [], dust: [] };

function aquaScene() {
  const on = isAqua();
  let el = $('aq-bg');
  if (on && !el) {
    el = document.createElement('div'); el.id = 'aq-bg'; el.className = 'aq-bg'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<canvas id="aq-cv"></canvas>';
    document.body.prepend(el);
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (AQ.on) aquaBuild(); }, 200); });
  }
  if (el) el.hidden = !on;
  if (on) aquaMenuSetup();
  if (on === AQ.on) return;
  AQ.on = on;
  cancelAnimationFrame(AQ.raf);
  if (on) { aquaBuild(); AQ.raf = requestAnimationFrame(aquaTick); }
}

/* 上の帯：画像のように「ホーム・バックアップ・テーマ」と歯車だけ見せ、残りは ☰ の中へ。一覧の「＋ 新規作成」もここでつなぐ */
function aquaMenuSetup() {
  if ($('aq-menu')) return;
  const bar = document.querySelector('.bar'); if (!bar) return;
  const b = document.createElement('button');
  b.className = 'aq-menu-btn'; b.id = 'aq-menu'; b.type = 'button'; b.setAttribute('aria-label', 'メニュー'); b.setAttribute('aria-expanded', 'false');
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14"/></svg>';
  bar.appendChild(b);
  const set = open => { bar.classList.toggle('aq-open', open); b.setAttribute('aria-expanded', String(open)); };
  b.addEventListener('click', e => { e.stopPropagation(); set(!bar.classList.contains('aq-open')); });
  document.addEventListener('click', e => { if (bar.classList.contains('aq-open') && !e.target.closest('.bar-actions')) set(false); });
  bar.querySelector('.bar-actions')?.addEventListener('click', e => { if (e.target.closest('.btn')) set(false); });
  $('shelf-new')?.addEventListener('click', () => $('btn-new').click());
}

/* 背景の絵（assets/aqua/scene.webp）は CSS で敷く。canvas には、その上で動くもの（光のゆらぎ・ただよう粒・泡）だけを描く */
function aquaBuild() {
  const k = AQ.k = Math.max(.5, Math.min(1, 720 / Math.max(innerWidth, innerHeight * .6)));
  const W = AQ.W = Math.round(innerWidth * k), H = AQ.H = Math.round(innerHeight * k);
  const cv = $('aq-cv'); cv.width = W; cv.height = H; AQ.drawn = false;
  const r = Math.random;
  AQ.dust = Array.from({ length: Math.round(W * H / 5000) }, () => ({ x: r() * W, y: r() * H, r: .5 + r() * 1.3, vx: (r() - .5) * .05, vy: -.02 - r() * .06, ph: r() * 6.3 }));
  AQ.bub = Array.from({ length: 14 }, () => aqBubble(true));
}
function aqBubble(fresh) {
  const r = Math.random;
  return { x: r() * AQ.W, y: fresh ? r() * AQ.H : AQ.H + 10, r: (.8 + r() * 2.8) * Math.max(.7, AQ.k * 1.4), v: .2 + r() * .45, ph: r() * 6.3 };
}
function aquaTick(t) {
  if (!AQ.on) return;
  AQ.raf = requestAnimationFrame(aquaTick);
  const still = reduceMotion.matches;
  if (document.hidden || (!still && t - AQ.last < 33) || (still && AQ.drawn)) return;   // 30コマ/秒で十分
  const dt = Math.min(3, (t - (AQ.last || t)) / 16.7); AQ.last = t; AQ.drawn = true;
  const cv = $('aq-cv'); if (!cv) return;
  const g = cv.getContext('2d'), W = AQ.W, H = AQ.H;
  g.clearRect(0, 0, W, H);
  // 上から差す光が、ゆっくりゆらぐ（絵の光の帯に重ねて、うすく）
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) {
    const cx = W * (.18 + i * .17) + Math.sin(t * .00016 + i * 1.7) * W * .05, wTop = W * (.02 + (i % 3) * .01), len = H * (.55 + (i % 2) * .25);
    const a = .025 + .03 * Math.max(0, Math.sin(t * .00035 + i * 2.1));
    const lg = g.createLinearGradient(0, 0, 0, len); lg.addColorStop(0, `rgba(215,248,255,${a})`); lg.addColorStop(1, 'rgba(215,248,255,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(cx - wTop, -5); g.lineTo(cx + wTop, -5); g.lineTo(cx + wTop * 4 + len * .16, len); g.lineTo(cx - wTop * 4 + len * .16, len); g.closePath(); g.fill();
  }
  g.globalCompositeOperation = 'source-over';
  // ただよう粒
  g.fillStyle = 'rgba(210,240,255,.6)';
  AQ.dust.forEach(p => {
    if (!still) { p.x += p.vx * dt + Math.sin(t * .0005 + p.ph) * .04; p.y += p.vy * dt; if (p.y < -2) { p.y = H + 2; p.x = Math.random() * W; } }
    g.globalAlpha = .25 + .45 * Math.abs(Math.sin(t * .001 + p.ph)); g.fillRect(p.x, p.y, p.r, p.r);
  });
  g.globalAlpha = 1;
  // 泡
  AQ.bub.forEach((b, i) => {
    if (!still) { b.y -= b.v * dt; b.x += Math.sin(t * .003 + b.ph) * .15 * dt; if (b.y < -10) AQ.bub[i] = aqBubble(false); }
    g.strokeStyle = 'rgba(220,250,255,.55)'; g.lineWidth = .8; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.3); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.6)'; g.beginPath(); g.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .28, 0, 6.3); g.fill();
  });
}

/* ---- キャラシ：ガラスの水槽のようなパネル ---- */
const AQ_ICON = {
  shell: '<path d="M12 20.5c-4.6 0-8.3-3.2-8.3-7.4 0-4.6 3.7-9.1 8.3-9.1s8.3 4.5 8.3 9.1c0 4.2-3.7 7.4-8.3 7.4z"/><path d="M12 20.5V4M12 20.5 6.6 6.6M12 20.5l5.4-13.9M12 20.5 4.3 10.4M12 20.5l7.7-10.1"/><path d="M9.5 20.2 8.8 22h6.4l-.7-1.8"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
  drop: '<path d="M12 3.5s6 6.6 6 10.7a6 6 0 0 1-12 0C6 10.1 12 3.5 12 3.5z"/><path d="M9.2 14.5a3 3 0 0 0 2.6 2.8" class="hl"/>',
  brain: '<path d="M9 5.2a3 3 0 0 0-4.6 2.6 3 3 0 0 0-.9 5 3.2 3.2 0 0 0 2.8 4.8A3 3 0 0 0 12 18.4V6.3A3 3 0 0 0 9 5.2zM15 5.2a3 3 0 0 1 4.6 2.6 3 3 0 0 1 .9 5 3.2 3.2 0 0 1-2.8 4.8A3 3 0 0 1 12 18.4"/><path d="M8 9.5h2M14 9.5h2M8.5 13.5H10M14 13.5h1.5" class="hl"/>',
  job: '<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M9 8V6.2A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V8M4 12.5h16"/>',
  age: '<path d="M7 4h10M7 20h10M8 4c0 4 4 5 4 8s-4 4-4 8M16 4c0 4-4 5-4 8s4 4 4 8"/>',
  sex: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.8-3.6 3.4-5.6 6.5-5.6s5.7 2 6.5 5.6"/>',
  home: '<path d="M4 11.5 12 4.5l8 7M6.5 10v9h11v-9"/>',
  more: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5"/>',
  star: '<path d="M12 3.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 17l-5.3 2.8 1.1-5.9-4.4-4.1 6-.8z"/>',
  atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="8.5" ry="3.4"/><ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="8.5" ry="3.4" transform="rotate(-60 12 12)"/>',
  bag: '<path d="M6 8.5h12l-1 11H7z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/><circle cx="12" cy="13.5" r="1.8"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-10"/>',
};
const aqIcon = (k, cls = '') => `<svg class="aq-ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${AQ_ICON[k] || ''}</svg>`;
function aquaHtml(c) {
  const a = abilities(c), p = c.profile, S = SYS[c.system], src = portraitSrc(c);
  const ab = Object.keys(c.abilities);
  return `
    <div class="hub-top aq-tools">${toolsHtml(c)}</div>
    <div class="aq-sheet">
      <i class="aq-wave-top" aria-hidden="true"></i>
      <div class="aq-title">${aqIcon('shell', 'aq-shell')}<div><b data-hub="name"></b><small>— Character Status —</small></div></div>
      <nav class="aq-tabs" aria-label="項目">${[['abilities', 'star', 'ステータス'], ['skills', 'atom', '技能'], ['items', 'bag', '所持品'], ['story', 'leaf', 'メモ']].map(([k, ic, l], i) => `<button class="aq-tab ${i ? '' : 'on'}" type="button" data-open="${k}">${aqIcon(ic)}<span>${l}</span></button>`).join('')}</nav>
      <div class="aq-main">
        <button class="aq-portrait ${src ? 'has' : ''}" type="button" data-stage aria-label="立ち絵を表示">${src ? `<img src="${esc(imgSrc(src))}" alt="" draggable="false" onerror="this.remove()">` : tokenHtml(c)}<i class="aq-glint" aria-hidden="true"></i></button>
        <div class="aq-bars">${[['hp', 'heart', 'HP'], ['mp', 'drop', 'MP'], ['san', 'brain', 'SAN']].map(([k, ic, l]) => `
          <div class="aq-bar ${k}">${aqIcon(ic)}<span class="aq-bl">${l}</span><b data-out="${k}Cur"></b><span class="aq-tr"><i data-bar="${k}"></i></span></div>`).join('')}
          <p class="aq-kana" data-hub="kana"></p>
        </div>
      </div>
      <div class="aq-lower">
        <button class="aq-abils" type="button" data-open="abilities" aria-label="能力値をひらく">${ab.map(k => `<span class="aq-ab"><i>${k}</i><b>${a[k] || 0}</b></span>`).join('')}</button>
        <button class="aq-prof" type="button" data-open="profile" aria-label="プロフィールをひらく">
          <span class="aq-pf">${aqIcon('job')}<span><i>職業</i><b>${esc(p.occupation || '—')}</b></span></span>
          <span class="aq-pf">${aqIcon('age')}<span><i>年齢</i><b>${esc(p.age ? p.age + '歳' : '—')}</b></span></span>
          <span class="aq-pf">${aqIcon('sex')}<span><i>性別</i><b>${esc(p.sex || '—')}</b></span></span>
        </button>
      </div>
      <button class="aq-more" type="button" data-open="profile">${aqIcon('more')}<span>詳細を見る</span><span class="aq-go" aria-hidden="true">›</span></button>
    </div>`;
}

/* ---- 画面の切りかえ：見本の「編集中…」のように、ぼやけた水の中にガラスの札と、まわりを回る光の輪 ----
   ① ぼやけた水底がふわっと広がり、札が浮かぶ（行き先の名前と Loading…）
   ② 札が出ているあいだに画面を入れかえる（mid）
   ③ 札が泡になって消え、水が晴れて新しい画面 */
let aqWaveBusy = false;
const AQ_SHELL = '<svg class="av-shell" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5c-4.6 0-8.3-3.2-8.3-7.4 0-4.6 3.7-9.1 8.3-9.1s8.3 4.5 8.3 9.1c0 4.2-3.7 7.4-8.3 7.4z"/><path class="ln" d="M12 20.5V4M12 20.5 6.6 6.6M12 20.5l5.4-13.9M12 20.5 4.3 10.4M12 20.5l7.7-10.1"/><path d="M9.5 20.2 8.8 22h6.4l-.7-1.8"/></svg>';
function aquaWave(mid) {
  if (reduceMotion.matches || aqWaveBusy) { mid(); return; }
  aqWaveBusy = true;
  const toSheet = !$('select').hidden, c = active();
  const title = toSheet ? (c?.profile.name || '名無し') : 'キャラクター一覧';
  const ov = document.createElement('div'); ov.className = 'aq-veil'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = `<i class="av-bg"></i><canvas class="av-bub"></canvas>
    <div class="av-card"><svg class="av-ring" viewBox="0 0 400 140" preserveAspectRatio="none"><ellipse class="r1" cx="200" cy="70" rx="196" ry="44" pathLength="100"/><ellipse class="r2" cx="200" cy="70" rx="196" ry="44" pathLength="100"/></svg>
      ${AQ_SHELL}<b class="av-t"></b><small class="av-s">Loading…</small></div>`;
  ov.querySelector('.av-t').textContent = title;
  document.body.appendChild(ov);
  const bg = ov.querySelector('.av-bg'), card = ov.querySelector('.av-card');
  // 泡（下からのぼる）
  const cv = ov.querySelector('.av-bub'), dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const R = Math.random, bubs = Array.from({ length: 34 }, () => ({ x: R() * W, y: H * (.4 + R() * .8), r: 2 + R() * (R() < .2 ? 12 : 5), v: 1.2 + R() * 2.6, ph: R() * 6.3 }));
  let run = true, t0 = 0;
  const draw = now => {
    if (!run) return; if (!t0) t0 = now; const t = now - t0;
    g.clearRect(0, 0, W, H);
    bubs.forEach(b => {
      b.y -= b.v; b.x += Math.sin(t * .004 + b.ph) * .5; if (b.y < -20) { b.y = H + 20; b.x = R() * W; }
      g.strokeStyle = 'rgba(230,252,255,.7)'; g.lineWidth = 1; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.3); g.stroke();
      g.fillStyle = 'rgba(200,240,255,.1)'; g.fill();
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(b.x - b.r * .35, b.y - b.r * .38, Math.max(.7, b.r * .25), 0, 6.3); g.fill();
    });
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
  const ease = 'cubic-bezier(.3, .7, .3, 1)';
  ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'ease-out', fill: 'forwards' });
  bg.animate([{ transform: 'scale(1.12)' }, { transform: 'scale(1.02)' }], { duration: 1700, easing: ease, fill: 'forwards' });
  card.animate([{ opacity: 0, transform: 'translateY(18px) scale(.92)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 620, delay: 140, easing: ease, fill: 'both' });
  setTimeout(() => { try { mid(); } catch (e) { console.error(e); } }, 470);
  setTimeout(() => {
    card.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-14px) scale(1.06)', filter: 'blur(8px)' }], { duration: 420, easing: 'ease-in', fill: 'forwards' });
    ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 560, delay: 180, easing: 'ease-in-out', fill: 'forwards' })
      .finished.then(() => { run = false; ov.remove(); aqWaveBusy = false; }, () => { run = false; ov.remove(); aqWaveBusy = false; });
  }, 1250);
}

/* ---- 項目の窓：泡がふくらむようにひらき、しぼんではじけるように閉じる ---- */
function aquaPanelOpen(ov) {
  ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
  $('sao-win').animate([
    { clipPath: 'circle(0% at 50% 55%)', transform: 'scale(.9)' },
    { clipPath: 'circle(48% at 50% 52%)', transform: 'scale(1.015)', offset: .6 },
    { clipPath: 'circle(150% at 50% 50%)', transform: 'scale(1)' },
  ], { duration: 720, easing: 'cubic-bezier(.3, .7, .3, 1)' });
  document.querySelectorAll('.sao-item').forEach((el, i) => el.animate(
    [{ opacity: 0, transform: 'translateY(16px) scale(.8)' }, { opacity: 1 }],
    { duration: 520, delay: 120 + i * 45, easing: 'cubic-bezier(.2, .9, .3, 1.3)', fill: 'backwards' }));
  aqRipple($('sao-win'));
}
function aquaPanelClose(ov) {
  return [
    $('sao-win').animate([
      { clipPath: 'circle(150% at 50% 50%)', transform: 'scale(1)' },
      { clipPath: 'circle(30% at 50% 52%)', transform: 'scale(.97)', offset: .7 },
      { clipPath: 'circle(0% at 50% 55%)', transform: 'scale(.9)' },
    ], { duration: 460, easing: 'cubic-bezier(.6, 0, .6, 1)', fill: 'forwards' }),
    ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: 240, fill: 'forwards' }),
  ];
}
/* 水面に石を落としたような波紋を、要素のまん中に */
function aqRipple(el) {
  if (!el || reduceMotion.matches) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const e = document.createElement('i'); e.className = 'aq-ripple'; e.setAttribute('aria-hidden', 'true');
    e.style.left = (r.left + r.width / 2) + 'px'; e.style.top = (r.top + r.height / 2) + 'px';
    document.body.appendChild(e);
    e.animate([{ transform: 'translate(-50%, -50%) scale(.1)', opacity: .9 }, { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }], { duration: 1100, delay: i * 160, easing: 'cubic-bezier(.2, .7, .3, 1)', fill: 'both' })
      .finished.then(() => e.remove(), () => e.remove());
  }
}
