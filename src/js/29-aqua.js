/* ================= アクアリウムテーマ（look: aqua）：水底の遺跡、光の帯、くらげと魚、ガラスの泡のような画面 =================
   ・背景は canvas に描く：動かない部分（水の色・遺跡・岩・さんご）は先に1枚に描いておき、
     毎コマは「光の帯・海藻・魚・くらげ・泡・ただよう粒」だけを重ねる（iPhone でも軽く）
   ・画面の切りかえは aquaWave：下から水が満ちて画面をおおい、泡が立ちのぼってから、水が引いて新しい画面
   ・キャラシは aquaHtml（ガラスの水槽のようなパネル） */
const isAqua = () => (presetOf().look || '').split(' ').includes('aqua');
const AQ = { on: false, raf: 0, last: 0, base: null, W: 0, H: 0, k: 1, fish: [], jelly: [], bub: [], dust: [], weed: [] };

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

/* 決まった並びの乱数（毎回同じ遺跡の形になるように） */
const aqRand = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

function aquaBuild() {
  const cssW = innerWidth, cssH = innerHeight;
  const k = AQ.k = Math.max(.5, Math.min(1, 720 / Math.max(cssW, cssH * .6)));   // 大きい画面は少し小さく描いて拡大（水の中なので少しぼやけるくらいがちょうどいい）
  const W = AQ.W = Math.round(cssW * k), H = AQ.H = Math.round(cssH * k);
  const cv = $('aq-cv'); cv.width = W; cv.height = H; AQ.drawn = false;
  const b = document.createElement('canvas'); b.width = W; b.height = H;
  const g = b.getContext('2d'), R = aqRand(20261105);

  // 水の色：上は光の入る明るい青、下ほど深い藍
  const lg = g.createLinearGradient(0, 0, 0, H);
  lg.addColorStop(0, '#1f74c4'); lg.addColorStop(.14, '#1052a6'); lg.addColorStop(.4, '#0a367f'); lg.addColorStop(.7, '#07245e'); lg.addColorStop(1, '#04163d');
  g.fillStyle = lg; g.fillRect(0, 0, W, H);
  const sg = g.createRadialGradient(W * .42, -H * .08, 0, W * .42, -H * .08, Math.max(W, H) * .8);
  sg.addColorStop(0, 'rgba(225,252,255,.5)'); sg.addColorStop(.35, 'rgba(150,225,255,.14)'); sg.addColorStop(1, 'rgba(140,215,255,0)');
  g.fillStyle = sg; g.fillRect(0, 0, W, H);

  // 水面のゆらぎ（上のほうの明るいもよう）
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 90; i++) {
    const x = R() * W, y = R() * H * .14, w = 10 + R() * 40;
    g.strokeStyle = `rgba(200,245,255,${.05 + R() * .08})`; g.lineWidth = 1 + R() * 1.5;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y + (R() - .5) * 8, x + w, y + (R() - .5) * 4); g.stroke();
  }
  g.restore();

  const s = Math.min(W, H * .75) / 400;   // 遺跡の大きさの目安
  // 遠くの遺跡（霧の向こう）
  aqRuins(g, R, { x: W * .55, base: H * .78, s: s * .8, col: 'rgba(90,165,225,.38)', hi: 'rgba(200,240,255,.18)' });
  aqColumn(g, { x: W * .08, base: H * .74, w: 16 * s, h: 150 * s, broken: 0.7, col: 'rgba(90,165,225,.38)', hi: 'rgba(200,240,255,.16)' }, R);
  // 霧
  const fg = g.createLinearGradient(0, H * .35, 0, H);
  fg.addColorStop(0, 'rgba(40,110,190,0)'); fg.addColorStop(1, 'rgba(20,70,150,.35)');
  g.fillStyle = fg; g.fillRect(0, 0, W, H);
  // 近くの遺跡（右側に大きく）
  aqRuins(g, R, { x: W * .8, base: H * .88, s: s * 1.3, col: 'rgba(30,95,170,.78)', hi: 'rgba(190,240,255,.32)' });
  aqColumn(g, { x: W * .2, base: H * .93, w: 22 * s, h: 190 * s, broken: .55, col: 'rgba(30,95,170,.72)', hi: 'rgba(190,240,255,.28)' }, R);
  aqColumn(g, { x: W * .33, base: H * .95, w: 18 * s, h: 80 * s, broken: .9, col: 'rgba(30,95,170,.68)', hi: 'rgba(190,240,255,.24)' }, R);

  // 海の底：岩
  g.fillStyle = 'rgba(10,40,95,.95)';
  g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += W / 24) g.lineTo(x, H - (14 + R() * 26) * s - Math.max(0, Math.sin(x / W * Math.PI * 2.2)) * 30 * s);
  g.lineTo(W, H); g.closePath(); g.fill();
  for (let i = 0; i < 9; i++) {   // ごろごろした石
    const x = R() * W, r = (8 + R() * 22) * s;
    g.fillStyle = `rgba(${10 + R() * 14},${40 + R() * 20},${90 + R() * 30},.9)`;
    g.beginPath(); g.ellipse(x, H - r * .4, r * 1.4, r, 0, Math.PI, 0); g.fill();
  }
  // さんご（左下と右下に、ピンクと紫）
  [[W * .04, '#ff9fe0'], [W * .13, '#b7a2ff'], [W * .22, '#ff8fd0'], [W * .86, '#ffb0e4'], [W * .95, '#9fc4ff'], [W * .5, '#c9a8ff']].forEach(([x, col], i) => {
    aqCoral(g, R, x, H - 6 * s, (i === 5 ? 28 : 46) * s, col);
  });
  // さんごの近くに小さな光る粒
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 90; i++) { const x = (R() < .5 ? R() * .3 : .7 + R() * .3) * W, y = H - R() * 90 * s; g.fillStyle = `rgba(255,${200 + R() * 55},245,${.2 + R() * .35})`; g.beginPath(); g.arc(x, y, .6 + R() * 1.4, 0, 6.3); g.fill(); }
  g.restore();
  // いちばん下を暗く
  const bg2 = g.createLinearGradient(0, H * .8, 0, H);
  bg2.addColorStop(0, 'rgba(4,20,56,0)'); bg2.addColorStop(1, 'rgba(4,20,56,.4)');
  g.fillStyle = bg2; g.fillRect(0, H * .8, W, H * .2);
  AQ.base = b;

  // 動くものの準備
  const r2 = Math.random;
  AQ.weed = Array.from({ length: 9 }, (_, i) => ({ x: (i < 5 ? r2() * .28 : .72 + r2() * .28) * W, h: (50 + r2() * 90) * s, w: (3 + r2() * 3) * s, ph: r2() * 6.3, sp: .0006 + r2() * .0006 }));
  AQ.dust = Array.from({ length: Math.round(W * H / 6000) }, () => ({ x: r2() * W, y: r2() * H, r: .4 + r2() * 1.2, vx: (r2() - .5) * .05, vy: -.02 - r2() * .05, ph: r2() * 6.3 }));
  AQ.bub = Array.from({ length: 16 }, () => aqBubble(true));
  AQ.fish = [];
  for (let sc = 0; sc < 4; sc++) {   // 魚の群れ 4つ（小さな魚がたくさん）
    const dir = sc % 2 ? -1 : 1, cy = H * (.12 + sc * .15 + r2() * .1), cx = r2() * W, n = 9 + Math.round(r2() * 8), sz = (3.5 + r2() * 3) * s;
    for (let i = 0; i < n; i++) AQ.fish.push({ x: cx + (r2() - .5) * 90 * s, y: cy + (r2() - .5) * 50 * s, dir, v: (.12 + r2() * .05) * s * 2, sz: sz * (.8 + r2() * .4), ph: r2() * 6.3, school: sc });
  }
  AQ.jelly = Array.from({ length: W > 500 ? 3 : 2 }, (_, i) => ({ x: W * (i === 0 ? .84 : i === 1 ? .1 : .55), y: H * (i === 0 ? .1 : .3 + i * .2), sz: (i === 0 ? 38 : 16 + r2() * 8) * s, ph: r2() * 6.3, vy: (.05 + r2() * .04) * s, sway: r2() * 6.3 }));
}
function aqBubble(fresh) {
  const r = Math.random;
  return { x: r() * AQ.W, y: fresh ? r() * AQ.H : AQ.H + 10, r: (.8 + r() * 2.6) * Math.max(.7, AQ.k * 1.4), v: .25 + r() * .5, ph: r() * 6.3 };
}
/* 柱：土台・柱身（縦のみぞ）・柱頭。broken が小さいほど上が欠けている */
function aqColumn(g, o, R) {
  const { x, base, w, h, col, hi } = o, top = base - h * o.broken;
  g.fillStyle = col;
  g.fillRect(x - w * .8, base - w * .35, w * 1.6, w * .35);          // 土台
  g.beginPath(); g.moveTo(x - w / 2, base - w * .35); g.lineTo(x - w / 2, top + w * .2);
  for (let i = 0; i <= 4; i++) g.lineTo(x - w / 2 + w * i / 4, top + (R() - .2) * w * .6);   // 欠けたところ
  g.lineTo(x + w / 2, base - w * .35); g.closePath(); g.fill();
  if (o.broken > .95) { g.fillRect(x - w * .85, top - w * .3, w * 1.7, w * .3); }
  g.strokeStyle = hi; g.lineWidth = Math.max(.6, w * .06);
  for (let i = 1; i < 4; i++) { const xx = x - w / 2 + w * i / 4; g.beginPath(); g.moveTo(xx, base - w * .4); g.lineTo(xx, top + w * .5); g.stroke(); }
}
/* 神殿の跡：アーチの並ぶ2段の回廊と、折れた柱 */
function aqRuins(g, R, o) {
  const { x, base, s, col, hi } = o;
  const bw = 230 * s, h1 = 120 * s, h2 = 85 * s, left = x - bw / 2;
  g.fillStyle = col;
  const arcade = (y0, h, n, w0, l0) => {
    g.beginPath(); g.rect(l0, y0 - h, w0, h);
    const cw = w0 / n;
    for (let i = 0; i < n; i++) {   // アーチの穴（evenodd でくり抜く）
      const ax = l0 + cw * i + cw * .18, aw = cw * .64, ah = h * .72, ay = y0;
      g.moveTo(ax, ay); g.lineTo(ax, ay - ah + aw / 2); g.arc(ax + aw / 2, ay - ah + aw / 2, aw / 2, Math.PI, 0); g.lineTo(ax + aw, ay); g.closePath();
    }
    g.fill('evenodd');
    g.fillRect(l0 - cw * .08, y0 - h - h * .08, w0 + cw * .16, h * .08);   // 上の横木
  };
  arcade(base, h1, 5, bw, left);
  arcade(base - h1 - h1 * .08, h2, 4, bw * .74, left + bw * .06);
  // 崩れた右上のかけら
  g.beginPath(); g.moveTo(left + bw * .8, base - h1 - h1 * .08); g.lineTo(left + bw * .86, base - h1 - h2 * .55); g.lineTo(left + bw * .93, base - h1 - h2 * .3); g.lineTo(left + bw, base - h1 - h1 * .08); g.closePath(); g.fill();
  // ハイライト（上から光が当たる縁）
  g.strokeStyle = hi; g.lineWidth = Math.max(.8, 1.6 * s);
  g.beginPath(); g.moveTo(left, base - h1); g.lineTo(left + bw, base - h1); g.moveTo(left + bw * .06, base - h1 - h2 - h1 * .08); g.lineTo(left + bw * .8, base - h1 - h2 - h1 * .08); g.stroke();
  // そばの柱
  aqColumn(g, { x: left - 26 * s, base, w: 20 * s, h: 200 * s, broken: 1, col, hi }, R);
  aqColumn(g, { x: left + bw + 30 * s, base, w: 20 * s, h: 170 * s, broken: .62, col, hi }, R);
  // 落ちた石
  for (let i = 0; i < 5; i++) { g.fillRect(left + R() * bw, base - 6 * s, (8 + R() * 14) * s, (5 + R() * 6) * s); }
}
/* さんご：枝分かれする線を何本か */
function aqCoral(g, R, x, y, size, col) {
  g.save(); g.strokeStyle = col; g.lineCap = 'round'; g.globalAlpha = .75; g.shadowColor = col; g.shadowBlur = size * .25;
  const br = (x0, y0, len, ang, wdt, depth) => {
    const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
    g.lineWidth = wdt; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + (R() - .5) * len * .4, (y0 + y1) / 2, x1, y1); g.stroke();
    if (depth > 0) { br(x1, y1, len * .72, ang - .35 - R() * .3, wdt * .7, depth - 1); br(x1, y1, len * .7, ang + .35 + R() * .3, wdt * .7, depth - 1); }
  };
  for (let i = 0; i < 3; i++) br(x + (i - 1) * size * .25, y, size * .45, -Math.PI / 2 + (i - 1) * .35, size * .14, 3);
  g.restore();
}

function aquaTick(t) {
  if (!AQ.on) return;
  AQ.raf = requestAnimationFrame(aquaTick);
  const still = reduceMotion.matches;
  if (document.hidden || (!still && t - AQ.last < 33) || (still && AQ.drawn)) return;   // 30コマ/秒で十分
  const dt = Math.min(3, (t - (AQ.last || t)) / 16.7); AQ.last = t; AQ.drawn = true;
  const cv = $('aq-cv'); if (!cv || !AQ.base) return;
  const g = cv.getContext('2d'), W = AQ.W, H = AQ.H, s = Math.min(W, H * .75) / 400;
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  g.drawImage(AQ.base, 0, 0);

  // 光の帯（上から斜めに差しこみ、ゆっくりゆれる）
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const cx = W * (.12 + i * .17) + Math.sin(t * .00018 + i * 1.7) * W * .04, wTop = W * (.025 + (i % 3) * .012), wBot = wTop * 4.5, len = H * (.6 + (i % 2) * .25);
    const a = .08 + .05 * Math.sin(t * .0004 + i * 2.1);
    const lg = g.createLinearGradient(0, 0, 0, len); lg.addColorStop(0, `rgba(215,248,255,${a + .05})`); lg.addColorStop(1, 'rgba(215,248,255,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(cx - wTop, -5); g.lineTo(cx + wTop, -5); g.lineTo(cx + wBot + len * .18, len); g.lineTo(cx - wBot + len * .18, len); g.closePath(); g.fill();
  }
  g.globalCompositeOperation = 'source-over';

  // 海藻
  AQ.weed.forEach(w => {
    g.strokeStyle = 'rgba(30,110,120,.7)'; g.lineWidth = w.w; g.lineCap = 'round'; g.beginPath(); g.moveTo(w.x, H);
    const n = 6; for (let j = 1; j <= n; j++) { const yy = H - w.h * j / n, sw = Math.sin(t * w.sp + w.ph + j * .7) * j * 2.2 * s; g.lineTo(w.x + sw, yy); }
    g.stroke();
  });

  // ただよう粒
  g.fillStyle = 'rgba(210,240,255,.55)';
  AQ.dust.forEach(p => {
    if (!still) { p.x += p.vx * dt + Math.sin(t * .0005 + p.ph) * .04; p.y += p.vy * dt; if (p.y < -2) { p.y = H + 2; p.x = Math.random() * W; } }
    g.globalAlpha = .3 + .4 * Math.abs(Math.sin(t * .001 + p.ph)); g.fillRect(p.x, p.y, p.r, p.r);
  });
  g.globalAlpha = 1;

  // 魚の群れ
  AQ.fish.forEach(f => {
    if (!still) { f.x += f.v * f.dir * dt; f.y += Math.sin(t * .001 + f.ph) * .08 * dt; if (f.dir > 0 && f.x > W + 40) f.x = -40 - Math.random() * 60; if (f.dir < 0 && f.x < -40) f.x = W + 40 + Math.random() * 60; }
    const tail = Math.sin(t * .012 + f.ph) * .35;
    g.save(); g.translate(f.x, f.y); g.scale(f.dir, 1);
    g.fillStyle = f.school % 2 ? 'rgba(200,235,255,.6)' : 'rgba(150,205,255,.55)';
    g.beginPath(); g.ellipse(0, 0, f.sz, f.sz * .38, 0, 0, 6.3); g.fill();
    g.beginPath(); g.moveTo(-f.sz * .85, 0); g.lineTo(-f.sz * 1.5, -f.sz * (.42 + tail * .3)); g.lineTo(-f.sz * 1.5, f.sz * (.42 - tail * .3)); g.closePath(); g.fill();
    g.fillStyle = 'rgba(230,250,255,.5)'; g.fillRect(f.sz * .25, -f.sz * .2, f.sz * .5, f.sz * .12);
    g.restore();
  });

  // くらげ（ふくらんでは縮む傘と、ゆれる足）
  AQ.jelly.forEach(j => {
    if (!still) { j.y -= j.vy * dt * (1 + .8 * Math.max(0, Math.sin(t * .0016 + j.ph))); if (j.y < -j.sz * 4) { j.y = H + j.sz * 2; j.x = W * (.1 + Math.random() * .8); } }
    const pulse = Math.sin(t * .0016 + j.ph), bw = j.sz * (1 + pulse * .08), bh = j.sz * (.75 - pulse * .07), x = j.x + Math.sin(t * .0003 + j.sway) * j.sz * .6, y = j.y;
    g.save(); g.globalCompositeOperation = 'lighter';
    const halo = g.createRadialGradient(x, y, 0, x, y, j.sz * 2.4); halo.addColorStop(0, 'rgba(170,220,255,.22)'); halo.addColorStop(1, 'rgba(170,220,255,0)');
    g.fillStyle = halo; g.fillRect(x - j.sz * 2.4, y - j.sz * 2.4, j.sz * 4.8, j.sz * 4.8);
    // 足
    g.strokeStyle = 'rgba(190,225,255,.32)'; g.lineWidth = Math.max(.6, j.sz * .04);
    for (let i = 0; i < 7; i++) {
      const sx = x - bw * .8 + bw * 1.6 * i / 6, L = j.sz * (2.2 + (i % 3) * .5);
      g.beginPath(); g.moveTo(sx, y);
      for (let q = 1; q <= 5; q++) g.lineTo(sx + Math.sin(t * .002 + i + q * .9 + j.ph) * j.sz * .18 * q / 2, y + L * q / 5);
      g.stroke();
    }
    g.strokeStyle = 'rgba(220,200,255,.35)'; g.lineWidth = Math.max(1, j.sz * .09);   // 口のまわりのひらひら
    for (let i = 0; i < 3; i++) { const sx = x + (i - 1) * bw * .25; g.beginPath(); g.moveTo(sx, y); g.quadraticCurveTo(sx + Math.sin(t * .0018 + i) * j.sz * .3, y + j.sz * .8, sx + Math.sin(t * .0014 + i * 2) * j.sz * .2, y + j.sz * 1.5); g.stroke(); }
    // 傘
    const bell = g.createRadialGradient(x, y - bh * .4, bw * .1, x, y - bh * .2, bw * 1.1);
    bell.addColorStop(0, 'rgba(235,245,255,.42)'); bell.addColorStop(.6, 'rgba(160,210,255,.22)'); bell.addColorStop(1, 'rgba(200,170,255,.38)');
    g.fillStyle = bell; g.beginPath(); g.ellipse(x, y, bw, bh, 0, Math.PI, 0);
    g.quadraticCurveTo(x + bw * .5, y + bh * .22, x, y + bh * .1); g.quadraticCurveTo(x - bw * .5, y + bh * .22, x - bw, y); g.fill();
    g.strokeStyle = 'rgba(230,245,255,.45)'; g.lineWidth = Math.max(.6, j.sz * .03); g.beginPath(); g.ellipse(x, y, bw, bh, 0, Math.PI, 0); g.stroke();
    g.restore();
  });

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

/* ---- 画面の切りかえ：下から水が満ちて、泡がのぼり、水が引いて新しい画面 ---- */
let aqWaveBusy = false;
function aquaWave(mid) {
  if (reduceMotion.matches || aqWaveBusy) { mid(); return; }
  aqWaveBusy = true;
  const cv = document.createElement('canvas'); cv.className = 'aq-wave'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  const R = Math.random, bubs = [];
  const addBub = (y0) => bubs.push({ x: R() * W, y: y0 ?? H + 10 + R() * 60, r: 2 + R() * (R() < .15 ? 14 : 6), v: 2.5 + R() * 4.5, ph: R() * 6.3 });
  for (let i = 0; i < 26; i++) addBub(H + R() * 200);
  const RISE = 620, HOLD = 260, FALL = 760, T = RISE + HOLD + FALL;
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  let t0 = 0, switched = false, lastT = 0;
  const surface = (lv, t, amp) => { g.moveTo(-10, lv); for (let x = -10; x <= W + 10; x += 10) g.lineTo(x, lv + Math.sin(x * .012 + t * .006) * amp + Math.sin(x * .027 - t * .009) * amp * .45); };
  const frame = now => {
    if (!t0) t0 = lastT = now;
    const t = now - t0, dt = Math.min(3, (now - lastT) / 16.7); lastT = now;
    let lv, amp;
    if (t < RISE) { const e = ease(t / RISE); lv = H + 40 - (H + 100) * e; amp = 10 + 16 * Math.sin(e * Math.PI); }
    else if (t < RISE + HOLD) { lv = -60; amp = 8; if (!switched) { switched = true; try { mid(); } catch (e) { console.error(e); } } }
    else { const e = ease(Math.min(1, (t - RISE - HOLD) / FALL)); lv = -60 + (H + 120) * e; amp = 10 + 14 * Math.sin(e * Math.PI); }
    g.clearRect(0, 0, W, H);
    // 手前に少し明るい波（奥行き）
    g.beginPath(); surface(lv - 16, t + 400, amp * .8); g.lineTo(W + 10, H + 10); g.lineTo(-10, H + 10); g.closePath();
    g.fillStyle = 'rgba(140,220,255,.32)'; g.fill();
    // 水の本体
    g.beginPath(); surface(lv, t, amp); g.lineTo(W + 10, H + 10); g.lineTo(-10, H + 10); g.closePath();
    const lg = g.createLinearGradient(0, Math.max(-60, lv), 0, Math.max(-60, lv) + H);
    lg.addColorStop(0, 'rgba(70,170,235,.97)'); lg.addColorStop(.35, 'rgba(18,90,170,.98)'); lg.addColorStop(1, 'rgba(5,30,80,1)');
    g.fillStyle = lg; g.fill();
    // 水の中の光の帯
    g.save(); g.clip(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const cx = W * (.15 + i * .25) + Math.sin(t * .002 + i) * 30, w0 = W * .03;
      const rg = g.createLinearGradient(0, lv, 0, lv + H * .7); rg.addColorStop(0, 'rgba(210,248,255,.22)'); rg.addColorStop(1, 'rgba(210,248,255,0)');
      g.fillStyle = rg; g.beginPath(); g.moveTo(cx - w0, lv); g.lineTo(cx + w0, lv); g.lineTo(cx + w0 * 4 + 60, lv + H * .7); g.lineTo(cx - w0 * 4 + 60, lv + H * .7); g.closePath(); g.fill();
    }
    g.restore();
    // 水面の光る線
    g.beginPath(); surface(lv, t, amp); g.strokeStyle = 'rgba(230,252,255,.9)'; g.lineWidth = 2.2; g.stroke();
    g.beginPath(); surface(lv + 7, t + 200, amp * .6); g.strokeStyle = 'rgba(200,245,255,.35)'; g.lineWidth = 1.2; g.stroke();
    // 泡（水の中だけ）
    if (t < RISE + HOLD + FALL * .4 && bubs.length < 70 && R() < .6) addBub();
    bubs.forEach(b => {
      b.y -= b.v * dt; b.x += Math.sin(t * .006 + b.ph) * .6 * dt;
      if (b.y < lv - 4 + Math.sin(b.x * .012 + t * .006) * amp) return;
      g.strokeStyle = 'rgba(230,252,255,.75)'; g.lineWidth = 1.1; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.3); g.stroke();
      g.fillStyle = 'rgba(200,240,255,.12)'; g.fill();
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.arc(b.x - b.r * .35, b.y - b.r * .38, Math.max(.8, b.r * .25), 0, 6.3); g.fill();
    });
    if (t < T) requestAnimationFrame(frame);
    else { cv.remove(); aqWaveBusy = false; }
  };
  requestAnimationFrame(frame);
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
