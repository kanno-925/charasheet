/* ================= カラー設定 ================= */
const THEME_DEFAULT = { bg: '#dfe6ef', solid: '#f3f6fa', ink: '#10233a', sky: '#1f6fe0', cyan: '#12a6cf', amber: '#f6a623' };
const THEME_ROWS = [
  ['bg', '背景', 'ページ全体の地の色'], ['solid', 'パネル', 'シートやウィンドウの色'], ['ink', '文字', '本文の色'],
  ['sky', 'メインカラー', 'ボタン・見出し'], ['cyan', 'サブカラー', 'グラデーション・光'], ['amber', '選択中の色', 'メニューで選んだ項目'],
];
const hexToRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v) || 0)).toString(16).padStart(2, '0')).join('');
const THEME_PRESETS = {
  sky:    { name: '近未来', sub: '白と空色', look: '', vals: {} },
  abyss:  { name: '深淵', sub: 'ダーク・クトゥルフ', look: 'dark mincho', vals: { bg: '#0a1013', solid: '#141d21', ink: '#dbe7e2', sky: '#3fae94', cyan: '#71cfc0', amber: '#d4ae62' } },
  tome:   { name: '古書', sub: 'セピアの羊皮紙', look: 'mincho', vals: { bg: '#e6dac1', solid: '#f6efdd', ink: '#3a2817', sky: '#8a4a26', cyan: '#b07a3a', amber: '#c0562a' } },
  sakura: { name: '和風', sub: '和紙と墨と金、舞う桜', look: 'mincho wa', vals: { bg: '#ebdfc6', solid: '#f7efdd', ink: '#2e2520', sky: '#5a3c2c', cyan: '#b08d4a', amber: '#b08d4a' } },
  neon:   { name: 'ネオン', sub: '夜のサイバー', look: 'dark', vals: { bg: '#0b0918', solid: '#16122b', ink: '#ece8ff', sky: '#a159f5', cyan: '#22c8e8', amber: '#f2569e' } },
  book:   { name: '魔導書', sub: '古本に万年筆で書きこむ記録', look: 'dark mincho book', vals: { bg: '#140c07', solid: '#22160d', ink: '#efe0c4', sky: '#7a5a8c', cyan: '#c9a04e', amber: '#c9a04e' } },
  forest: { name: '森', sub: '深緑とランタン', look: '', vals: { bg: '#dfe7dc', solid: '#f5f8f1', ink: '#1c2a1f', sky: '#2f7d4f', cyan: '#5aa78a', amber: '#d98a1f' } },
};
const presetOf = () => THEME_PRESETS[state.themePreset] || THEME_PRESETS.sky;
const themeVals = () => ({ ...THEME_DEFAULT, ...presetOf().vals, ...(state.theme || {}) });
function renderPresets() {
  const cur = state.themePreset && THEME_PRESETS[state.themePreset] ? state.themePreset : 'sky';
  $('theme-presets').innerHTML = Object.entries(THEME_PRESETS).map(([k, t]) => {
    const v = { ...THEME_DEFAULT, ...t.vals };
    return `<button type="button" class="tp ${k === cur ? 'on' : ''}" data-preset-theme="${k}" aria-pressed="${k === cur}">
      <span class="tp-sw" style="background:${v.bg}"><i style="background:${v.solid};border-color:${v.sky}"><b style="background:linear-gradient(100deg, ${v.sky}, ${v.cyan})"></b><em style="background:${v.amber}"></em><u style="background:${v.ink}"></u></i></span>
      <span class="tp-n">${t.name}</span><span class="tp-s">${t.sub}</span>
    </button>`;
  }).join('');
}

function applyTheme() {
  const t = themeVals();
  Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
  document.documentElement.dataset.look = presetOf().look;
  applyBg();
  waScene();
}
function applyBg() {
  const ac = state.chars && state.chars.find(c => c.id === state.activeId);
  const sheetImg = (ac && ac.bgImage) || state.bgImage || '';
  const selImg = state.selBgImage || state.bgImage || '';
  const L = $('bg-layer'), R = document.documentElement.style;
  L.classList.toggle('on', !!sheetImg);
  document.documentElement.classList.toggle('has-bg', !!sheetImg);
  document.documentElement.classList.toggle('sel-has-bg', !!selImg);
  L.style.backgroundImage = sheetImg ? `url("${imgSrc(sheetImg)}")` : '';
  L.style.setProperty('--veil', (state.bgVeil ?? 15) / 100);
  L.style.setProperty('--bgblur', (state.bgBlur ?? 0) + 'px');
  R.setProperty('--veil', (state.bgVeil ?? 15) / 100); R.setProperty('--bgblur', (state.bgBlur ?? 0) + 'px');
  R.setProperty('--sel-img', selImg ? `url("${imgSrc(selImg)}")` : 'none');
  R.setProperty('--glass-a', (100 - (state.bgGlass ?? 75)) + '%');
}
let bgSlot = 'all';
const bgGet = slot => slot === 'sel' ? state.selBgImage : slot === 'char' ? (active() || {}).bgImage : state.bgImage;
function bgSet(slot, v) {
  if (slot === 'sel') state.selBgImage = v;
  else if (slot === 'char') { const c = active(); c.bgImage = v; c.updatedAt = Date.now(); }
  else state.bgImage = v;
}
function renderBgControls() {
  const ac = active();
  document.querySelectorAll('[data-bgslot]').forEach(b => { const on = b.dataset.bgslot === bgSlot; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  const cn = $('bgslot-char-name'); if (cn) cn.textContent = (ac && ac.profile.name) || '名無し';
  const img = bgGet(bgSlot);
  $('bg-thumb').style.backgroundImage = img ? `url("${imgSrc(img)}")` : '';
  $('bg-thumb').textContent = img ? '' : (bgSlot === 'all' ? '未設定' : '共通の画像を使用');
  $('bg-remove').hidden = !img;
  $('bg-slot-hint').textContent = { all: '「探索者をえらぶ画面」と各キャラで画像を設定していないときに使われます。', sel: '探索者をえらぶ画面（フレンド一覧も）だけの背景です。未設定なら共通の画像を使います。', char: `「${(ac && ac.profile.name) || '名無し'}」のシートを開いているときだけの背景です。キャラを切り替えると、そのキャラの背景に変わります。` }[bgSlot];
  $('bg-veil').value = state.bgVeil ?? 15; $('bg-veil-v').textContent = (state.bgVeil ?? 15) + '%';
  $('bg-blur').value = state.bgBlur ?? 0; $('bg-blur-v').textContent = (state.bgBlur ?? 0) + 'px';
  $('bg-glass').value = state.bgGlass ?? 75; $('bg-glass-v').textContent = (state.bgGlass ?? 75) + '%';
}
function renderThemeRows() {
  const t = themeVals();
  $('theme-rows').innerHTML = THEME_ROWS.map(([k, name, desc]) => {
    const rgb = hexToRgb(t[k]);
    return `<div class="trow" data-tk="${k}">
      <input type="color" id="tc-${k}" value="${t[k]}" aria-label="${name}の色">
      <div class="tname"><b>${name}</b><span>${desc}</span><code data-hex>${t[k].toUpperCase()}</code></div>
      <div class="tch">${['r', 'g', 'b'].map((ch, i) => `
        <label class="${ch}">${ch.toUpperCase()}
          <input type="range" min="0" max="255" value="${rgb[i]}" data-ch="${i}" id="tr-${k}-${ch}" aria-label="${name} ${ch.toUpperCase()}">
          <input type="number" min="0" max="255" value="${rgb[i]}" data-ch="${i}" id="tn-${k}-${ch}" aria-label="${name} ${ch.toUpperCase()} の数値">
        </label>`).join('')}</div>
    </div>`;
  }).join('');
}
$('theme-rows').addEventListener('input', e => {
  const row = e.target.closest('.trow'); if (!row) return;
  const k = row.dataset.tk;
  let rgb = hexToRgb(themeVals()[k]);
  if (e.target.type === 'color') rgb = hexToRgb(e.target.value);
  else if (e.target.dataset.ch != null) rgb[+e.target.dataset.ch] = Math.max(0, Math.min(255, Number(e.target.value) || 0));
  const hex = rgbToHex(rgb);
  state.theme = { ...(state.theme || {}), [k]: hex };
  applyTheme(); save();
  row.querySelector('input[type="color"]').value = hex;
  row.querySelector('[data-hex]').textContent = hex.toUpperCase();
  row.querySelectorAll('[data-ch]').forEach(el => { if (el !== e.target) el.value = rgb[+el.dataset.ch]; });
});
$('btn-theme').addEventListener('click', () => { bgSlot = $('select').hidden ? 'char' : 'sel'; renderPresets(); renderThemeRows(); renderBgControls(); openModal('modal-theme'); });
$('bg-file').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    bgSet(bgSlot, await loadImageData(f, bgSlot === 'char' ? 1600 : 1920, bgSlot === 'char' ? .78 : .8));
    applyBg(); renderBgControls(); saveNow(); if (bgSlot === 'char') { scheduleSync(); renderSheet(); }
    toast({ all: '共通の背景画像を設定しました。', sel: '探索者をえらぶ画面の背景画像を設定しました。', char: 'このキャラの背景画像を設定しました。' }[bgSlot]);
  } catch (err) { toast(err.message); }
});
$('bg-remove').addEventListener('click', () => { bgSet(bgSlot, ''); applyBg(); renderBgControls(); save(); if (bgSlot === 'char') renderSheet(); });
$('bg-slots').addEventListener('click', e => { const b = e.target.closest('[data-bgslot]'); if (!b) return; bgSlot = b.dataset.bgslot; renderBgControls(); });
$('theme-presets').addEventListener('click', e => {
  const b = e.target.closest('[data-preset-theme]'); if (!b) return;
  state.themePreset = b.dataset.presetTheme; state.theme = {};
  applyTheme(); save(); renderPresets(); renderThemeRows(); renderSheet();
  fxAt(b, true);
});
$('bg-veil').addEventListener('input', e => { state.bgVeil = +e.target.value; applyTheme(); renderBgControls(); save(); });
$('bg-blur').addEventListener('input', e => { state.bgBlur = +e.target.value; applyTheme(); renderBgControls(); save(); });
$('bg-glass').addEventListener('input', e => { state.bgGlass = +e.target.value; applyTheme(); renderBgControls(); save(); });
$('theme-reset').addEventListener('click', e => {
  if (!arm(e.currentTarget, 'もう一度押すと戻します')) return;
  state.theme = {}; applyTheme(); save(); renderThemeRows();
  fxAt(e.currentTarget, true);
});

/* ================= 和風テーマ：和紙の背景・景色・金の霞・青海波・舞い散る桜 ================= */
const WA = { on: false, raf: 0, petals: [], sprites: null, last: 0, w: 0, h: 0, dpr: 1 };
function waScene() {
  const on = (presetOf().look || '').split(' ').includes('wa');
  let el = $('wa-bg');
  if (on && !el) {
    el = document.createElement('div'); el.id = 'wa-bg'; el.className = 'wa-bg'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i class="wa-sun"></i><div class="wa-scene"><i class="wa-branch"></i></div><i class="wa-cloud c1"></i><i class="wa-cloud c2"></i><i class="wa-cloud c3"></i><i class="wa-wave wl"></i><i class="wa-wave wr"></i><i class="wa-wave wg"></i><canvas class="wa-petals" id="wa-petals"></canvas>';
    document.body.prepend(el);
  }
  if (el) el.hidden = !on;
  if (on === WA.on) return;
  WA.on = on;
  if (on) waPetalsStart(); else cancelAnimationFrame(WA.raf);
}
/* 花びらの絵を3色ぶん先に描いておく（毎回描くより軽い） */
function waSprites() {
  const mk = (c1, c2) => {
    const cv = document.createElement('canvas'), w = 28, h = 32; cv.width = w; cv.height = h;
    const g = cv.getContext('2d'); g.translate(w / 2, h / 2);
    const gr = g.createRadialGradient(0, 8, 1, 0, 0, 16); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.beginPath();
    g.moveTo(0, 15); g.bezierCurveTo(13, 7, 13, -10, 4.5, -15); g.lineTo(0, -10.5); g.lineTo(-4.5, -15); g.bezierCurveTo(-13, -10, -13, 7, 0, 15);
    g.fill(); g.strokeStyle = 'rgba(190,110,130,.35)'; g.lineWidth = .8; g.stroke();
    return cv;
  };
  return [mk('#fff6f7', '#f2b8c6'), mk('#fde9ee', '#e89aae'), mk('#fffaf6', '#f6cdd3')];
}
function waPetalsStart() {
  const cv = $('wa-petals'); if (!cv) return;
  const g = cv.getContext('2d');
  WA.sprites = WA.sprites || waSprites();
  const size = () => { WA.dpr = Math.min(2, devicePixelRatio || 1); WA.w = innerWidth; WA.h = innerHeight; cv.width = WA.w * WA.dpr; cv.height = WA.h * WA.dpr; };
  size(); if (!WA.sized) { WA.sized = true; addEventListener('resize', size); }
  const n = reduceMotion.matches ? 0 : innerWidth < 760 ? 14 : 30;
  const make = (fresh) => ({ x: Math.random() * WA.w * 1.2 - WA.w * .1, y: fresh ? Math.random() * WA.h : -30 - Math.random() * 200, s: .45 + Math.random() * .65,
    vy: .35 + Math.random() * .55, vx: -.15 - Math.random() * .35, sw: 18 + Math.random() * 40, sp: .0006 + Math.random() * .0012, ph: Math.random() * 6.3,
    r: Math.random() * 6.3, vr: (Math.random() - .5) * .03, fl: Math.random() * 6.3, vf: .02 + Math.random() * .04, k: Math.floor(Math.random() * 3) });
  WA.petals = Array.from({ length: n }, () => make(true));
  cancelAnimationFrame(WA.raf);
  const tick = t => {
    if (!WA.on) return;
    WA.raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min(50, t - (WA.last || t)) / 16.7; WA.last = t;
    const wind = Math.sin(t * .00025) * .45 + Math.sin(t * .0011) * .15;
    g.setTransform(WA.dpr, 0, 0, WA.dpr, 0, 0); g.clearRect(0, 0, WA.w, WA.h);
    WA.petals.forEach((p, i) => {
      p.y += p.vy * dt * p.s * 1.4; p.x += (p.vx + wind) * dt + Math.cos(t * p.sp + p.ph) * .35 * dt;
      p.r += p.vr * dt; p.fl += p.vf * dt;
      if (p.y > WA.h + 30 || p.x < -60 || p.x > WA.w + 60) WA.petals[i] = make(false);
      const x = p.x + Math.sin(t * p.sp + p.ph) * p.sw;
      g.save(); g.translate(x, p.y); g.rotate(p.r); g.scale(p.s * Math.max(.15, Math.abs(Math.cos(p.fl))), p.s);
      g.globalAlpha = .85; g.drawImage(WA.sprites[p.k], -14, -16); g.restore();
    });
  };
  if (n) WA.raf = requestAnimationFrame(tick); else g.clearRect(0, 0, cv.width, cv.height);
}
