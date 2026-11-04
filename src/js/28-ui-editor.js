/* ================= 画面の編集モード（マスターだけが部品の色・大きさ・位置などを変えられる） =================
   ・マスター（Supabase の app_admins に登録した人）がログインすると「テーマ・背景」に「画面を編集する」が出る（Ctrl+Shift+E でも開く）
   ・編集中の内容は「下書き」としてこのブラウザに保存。「みんなに公開」を押すとサーバー（ui_layout）に送られ、全員の画面に反映される
   ・部品は「CSSセレクター」という住所で覚えておき、CSSを上書きして見た目を変える */
const UE_KEY = 'charasheet-kobo.ui-edit';
const UE_PUB_KEY = UE_KEY + '.pub';
const UE_EMPTY = () => ({ v: 1, items: {} });
const UE = { on: false, pause: false, sel: null, el: null, data: UE_EMPTY(), pub: UE_EMPTY(), admin: false, busy: false, drag: null, noClick: false };
const UE_STATE_CLS = /^(on|off|open|land|listv|slidev|free|warn|pulse|playing|over|out|enter|leave|drag|changed|center|armed|grid|hidden|active|show|in|is-.*|has-.*|sel-has-bg|res-.*|ue-.*)$/;
const UE_SKIP_DATA = /^data-(i|id|uid|fid|u|row|p|del|ch|tk|gjoin|fv|final|max|sum|open|ring|sides|close|close-panel)$/;

const ueRead = k => { try { const s = JSON.parse(localStorage.getItem(k) || 'null'); return s && s.items ? s : null; } catch (e) { return null; } };
const ueWrite = (k, v) => { try { v ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); } catch (e) { toast('編集内容を保存できませんでした。'); } };
const ueSame = (a, b) => JSON.stringify(a.items) === JSON.stringify(b.items);
const ueClone = d => JSON.parse(JSON.stringify(d));
function ueLoad() {
  UE.pub = ueRead(UE_PUB_KEY) || UE_EMPTY();       // 前回サーバーから受け取った公開版（すぐ表示するため）
  UE.data = ueRead(UE_KEY) || ueClone(UE.pub);    // マスターの下書き
}
function ueSave() { ueWrite(UE_KEY, UE.data); ueApply(); }
/* 公開版をサーバーから受け取る（ログインしていなくても読める） */
async function uePull() {
  const c = sbClient(); if (!c) return;
  try {
    const { data, error } = await c.from('ui_layout').select('data').eq('id', 'main').maybeSingle();
    if (error || !data) return;
    const pub = data.data && data.data.items ? data.data : UE_EMPTY();
    const hadDraft = !ueSame(UE.data, UE.pub);
    UE.pub = pub; ueWrite(UE_PUB_KEY, pub);
    if (!hadDraft) UE.data = ueClone(pub);
    ueApply(); if (UE.on) ueRenderBody();
  } catch (e) { /* つながらないときは前回の公開版のまま */ }
}
/* ログインした人がマスターかどうか */
async function ueCheckAdmin() {
  let ok = false;
  if (me && sb) { try { const { data } = await sb.rpc('is_app_admin'); ok = data === true; } catch (e) { ok = false; } }
  UE.admin = ok;
  const b = $('ue-open'); if (b) b.hidden = !ok;
  if (!ok && UE.on) ueStop();
}
async function uePublish() {
  if (!UE.admin || !sb || !me || UE.busy) return;
  UE.busy = true; ueRenderBody();
  try {
    const { error } = await sb.from('ui_layout').upsert({ id: 'main', data: UE.data, updated_at: new Date().toISOString(), updated_by: me.id });
    if (error) throw error;
    UE.pub = ueClone(UE.data); ueWrite(UE_PUB_KEY, UE.pub);
    toast('みんなの画面に公開しました');
  } catch (e) { toast(/row-level security|permission/i.test(String(e && e.message)) ? '公開できませんでした。マスターとして登録されていないようです。' : jaErr(e)); }
  finally { UE.busy = false; ueRenderBody(); }
}

/* 部品の住所（セレクター）を作る */
function ueSelector(el) {
  const parts = [];
  while (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
    if (el.id && !/^ue-/.test(el.id)) { parts.unshift('#' + CSS.escape(el.id)); break; }
    let s = el.tagName.toLowerCase();
    const cls = [...el.classList].filter(c => !UE_STATE_CLS.test(c)).slice(0, 2);
    if (cls.length) s += '.' + cls.map(c => CSS.escape(c)).join('.');
    const da = [...el.attributes].find(a => /^data-[\w-]+$/.test(a.name) && !UE_SKIP_DATA.test(a.name) && a.value && a.value.length < 30 && !/^\d+$/.test(a.value) && !/^[a-z0-9]{10,}$/i.test(a.value));
    if (da) s += `[${da.name}="${CSS.escape(da.value)}"]`;
    const p = el.parentElement;
    if (p) {
      let same = [];
      try { same = [...p.children].filter(x => x.matches(s)); } catch (e) { same = []; }
      if (same.length > 1) s += `:nth-child(${[...p.children].indexOf(el) + 1})`;
    }
    parts.unshift(s);
    el = p;
  }
  return parts.join(' > ');
}
function ueFind(sel) { try { return document.querySelector(sel); } catch (e) { return null; } }
function ueLabel(el) {
  if (!el) return '';
  const t = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 18);
  return t || el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
}

/* 上書き用のCSSを作って反映 */
function ueCss() {
  let css = '';
  Object.entries(ueShown().items).forEach(([sel, o]) => {
    const d = [];
    if (o.color) d.push(`color:${o.color}`);
    if (o.bg) d.push(`background:${o.bg}`);
    if (o.fs) d.push(`font-size:${o.fs}px`);
    if (o.pad != null && o.pad !== '') d.push(`padding:${o.pad}px`);
    if (o.mar != null && o.mar !== '') d.push(`margin:${o.mar}px`);
    if (o.rad != null && o.rad !== '') d.push(`border-radius:${o.rad}px`);
    if (o.op != null && o.op !== '') d.push(`opacity:${o.op / 100}`);
    if (o.x || o.y) {
      const [tx, ty] = (o.tb && o.tb !== 'none' ? o.tb : '0px 0px').split(' ');
      d.push(`translate:calc(${tx} + ${o.x || 0}px) calc(${ty || '0px'} + ${o.y || 0}px)`);
    }
    if (d.length) css += `${sel}{${d.map(x => x + ' !important').join(';')}}\n`;
    if (o.hide) css += `body:not(.ue-on) ${sel}{display:none !important}\nbody.ue-on ${sel}{opacity:.3 !important;outline:2px dashed #e2483d !important}\n`;
  });
  return css;
}
let ueObs = null, ueRaf = 0;
const ueShown = () => UE.on ? UE.data : UE.pub;   // 編集中は下書き、それ以外は公開版を表示
function ueTexts() {
  ueRaf = 0;
  Object.entries(ueShown().items).forEach(([sel, o]) => {
    if (o.text == null) return;
    let els = [];
    try { els = document.querySelectorAll(sel); } catch (e) { return; }
    els.forEach(e => { if (!e.children.length && e.textContent !== o.text) e.textContent = o.text; });
  });
}
function ueApply() {
  let st = $('ue-style');
  if (!st) { st = document.createElement('style'); st.id = 'ue-style'; document.head.appendChild(st); }
  st.textContent = ueCss();
  const hasText = Object.values(ueShown().items).some(o => o.text != null);
  if (hasText && !ueObs) {
    // 画面が描き直されても文言の変更を保つ
    ueObs = new MutationObserver(() => { if (!ueRaf) ueRaf = requestAnimationFrame(ueTexts); });
    ueObs.observe(document.body, { childList: true, subtree: true, characterData: true });
  } else if (!hasText && ueObs) { ueObs.disconnect(); ueObs = null; }
  ueTexts();
  if (UE.on) uePlaceBox();
}

/* 色を #rrggbb にそろえる（color-mix などもブラウザに変換してもらう） */
const ueCtx = document.createElement('canvas').getContext('2d');
function ueHex(c) {
  if (!c || c === 'transparent' || /rgba\(.*,\s*0\)$/.test(c)) return '';
  ueCtx.fillStyle = '#000'; ueCtx.fillStyle = c;
  const v = ueCtx.fillStyle;
  return /^#[0-9a-f]{6}$/i.test(v) ? v : '';
}

/* ===== パネル ===== */
const UE_NUM = [
  ['fs', '文字サイズ', 6, 72, 'font-size'],
  ['pad', '内側の余白', 0, 80, 'padding-top'],
  ['mar', '外側の余白', -40, 80, 'margin-top'],
  ['rad', '角の丸み', 0, 100, 'border-top-left-radius'],
  ['op', '透明度（%）', 0, 100, null],
];
function uePanelHtml() {
  return `<div class="ue-head"><b>画面の編集</b>
      <button type="button" class="ue-b" id="ue-pause"></button>
      <button type="button" class="ue-b" id="ue-exit" aria-label="編集モードを終える">終了</button></div>
    <div class="ue-body" id="ue-body"></div>
    <div class="ue-foot">
      <details id="ue-list-wrap"><summary>変更した部品 <span id="ue-count"></span></summary><div id="ue-list"></div></details>
      <div class="ue-pub" id="ue-pub"></div>
      <div class="ue-row">
        <button type="button" class="ue-b" id="ue-export">書き出し</button>
        <button type="button" class="ue-b" id="ue-import">読み込み</button>
        <button type="button" class="ue-b danger" id="ue-reset-all">すべて元に戻す</button>
      </div>
      <textarea id="ue-io" hidden placeholder="書き出した内容をここに貼り付けて「読み込む」を押してください"></textarea>
      <button type="button" class="ue-b" id="ue-io-go" hidden>読み込む</button>
    </div>`;
}
function ueRenderFoot() {
  if (!$('ue-pub')) return;
  $('ue-pause').textContent = UE.pause ? '部品を選ぶ' : 'アプリを操作する';
  $('ue-pause').classList.toggle('on', UE.pause);
  const n = Object.keys(UE.data.items).length;
  $('ue-count').textContent = n ? `（${n}）` : '';
  const dirty = !ueSame(UE.data, UE.pub);
  $('ue-pub').innerHTML = `<p class="ue-hint">${dirty ? '<b class="ue-dirty">● まだ公開していない変更があります</b>（みんなの画面はまだ前のまま）' : 'みんなの画面と同じです'}</p>
    <div class="ue-row"><button type="button" class="ue-b on" id="ue-publish" ${dirty && !UE.busy ? '' : 'disabled'}>${UE.busy ? '公開中…' : 'みんなに公開'}</button>
    <button type="button" class="ue-b" id="ue-discard" ${dirty && !UE.busy ? '' : 'disabled'}>公開中の状態に戻す</button></div>`;
  $('ue-list').innerHTML = n ? Object.entries(UE.data.items).map(([sel, o]) =>
    `<button type="button" class="ue-li" data-ue-sel="${esc(sel)}">${esc(o.label || sel)}</button>`).join('') : '<p class="ue-hint">まだありません</p>';
}
function ueRenderBody() {
  const body = $('ue-body'); if (!body) return;
  ueRenderFoot();
  if (UE.pause) { body.innerHTML = '<p class="ue-hint">いまはアプリを普通に操作できます。編集したい画面（ウィンドウなど）を開いてから「部品を選ぶ」を押してください。</p>'; return; }
  const el = UE.el;
  if (!el || !el.isConnected) {
    body.innerHTML = '<p class="ue-hint">画面の中の部品を押すと、ここで色や大きさを変えられます。<br>選んだ部品はドラッグで動かせます。<br>Escキーで選ぶのをやめます。</p>';
    return;
  }
  const o = UE.data.items[UE.sel] || {}, cs = getComputedStyle(el), leaf = !el.children.length && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA';
  const colorRow = (k, label, cur) => `<label class="ue-f"><span>${label}</span>
      <input type="color" data-ue-k="${k}" value="${esc(o[k] || ueHex(cur) || '#000000')}">
      <button type="button" class="ue-x" data-ue-clear="${k}" ${o[k] ? '' : 'disabled'} aria-label="${label}を元に戻す">↺</button></label>`;
  body.innerHTML = `
    <div class="ue-sel"><b>${esc(ueLabel(el))}</b><small>${esc(el.tagName.toLowerCase())}</small>
      <button type="button" class="ue-b" id="ue-parent" ${el.parentElement && el.parentElement !== document.body ? '' : 'disabled'}>ひとつ外側を選ぶ</button></div>
    ${leaf ? `<label class="ue-f ue-col"><span>文言</span><textarea data-ue-k="text" rows="2">${esc(o.text != null ? o.text : el.textContent)}</textarea></label>` : '<p class="ue-hint">文言は、中に別の部品がない一番内側の部品で変えられます。</p>'}
    ${colorRow('color', '文字色', cs.color)}
    ${colorRow('bg', '背景色', cs.backgroundColor)}
    ${UE_NUM.map(([k, label, min, max, prop]) => {
      const cur = o[k] != null && o[k] !== '' ? o[k] : prop ? Math.round(parseFloat(cs.getPropertyValue(prop)) || 0) : Math.round(parseFloat(cs.opacity) * 100);
      return `<label class="ue-f"><span>${label}</span>
        <input type="range" min="${min}" max="${max}" value="${cur}" data-ue-k="${k}">
        <input type="number" min="${min}" max="${max}" value="${cur}" data-ue-k="${k}">
        <button type="button" class="ue-x" data-ue-clear="${k}" ${o[k] != null && o[k] !== '' ? '' : 'disabled'} aria-label="${label}を元に戻す">↺</button></label>`;
    }).join('')}
    <label class="ue-f ue-pos"><span>位置（横・縦）</span>
      <input type="number" data-ue-k="x" value="${o.x || 0}"><input type="number" data-ue-k="y" value="${o.y || 0}">
      <button type="button" class="ue-x" data-ue-clear="x,y,tb" ${o.x || o.y ? '' : 'disabled'} aria-label="位置を元に戻す">↺</button></label>
    <label class="ue-f ue-chk"><input type="checkbox" data-ue-k="hide" ${o.hide ? 'checked' : ''}> この部品を隠す</label>
    <button type="button" class="ue-b danger wide" id="ue-reset" ${UE.data.items[UE.sel] ? '' : 'disabled'}>この部品を元に戻す</button>`;
}
function ueSet(k, v) {
  if (!UE.sel) return;
  const o = UE.data.items[UE.sel] = UE.data.items[UE.sel] || {};
  o.label = o.label || ueLabel(UE.el);
  if (v === '' || v == null || v === false) delete o[k]; else o[k] = v;
  if (Object.keys(o).every(x => x === 'label')) delete UE.data.items[UE.sel];
  ueSave();  ueRenderFoot();
}
function ueSelect(el) {
  if (!el || el === document.body || el === document.documentElement) return;
  UE.el?.classList.remove('ue-picked');
  UE.el = el; UE.sel = ueSelector(el);
  el.classList.add('ue-picked');
  ueRenderBody(); uePlaceBox();
}
function uePlaceBox() {
  const box = $('ue-box'); if (!box) return;
  const el = UE.el;
  if (!UE.on || UE.pause || !el || !el.isConnected) { box.hidden = true; return; }
  const r = el.getBoundingClientRect();
  box.hidden = false;
  Object.assign(box.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
}
function ueHover(el) {
  const h = $('ue-hover'); if (!h) return;
  if (!el || UE.pause) { h.hidden = true; return; }
  const r = el.getBoundingClientRect();
  h.hidden = false;
  Object.assign(h.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
}

const ueInPanel = t => t && t.closest && t.closest('#ue-panel');
function ueOnPointerDown(e) {
  if (!UE.on || UE.pause || ueInPanel(e.target)) return;
  e.preventDefault(); e.stopPropagation();
  if (UE.el && UE.el.contains(e.target) && e.button === 0) {
    const o = UE.data.items[UE.sel] || {};
    UE.drag = { sx: e.clientX, sy: e.clientY, x0: o.x || 0, y0: o.y || 0, moved: false };
  }
}
function ueOnPointerMove(e) {
  if (!UE.on || UE.pause) return;
  if (UE.drag) {
    const d = UE.drag, dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    if (!d.moved) {
      d.moved = true;
      const o = UE.data.items[UE.sel] = UE.data.items[UE.sel] || { label: ueLabel(UE.el) };
      if (o.tb == null) { const st = $('ue-style'); st.disabled = true; o.tb = getComputedStyle(UE.el).translate || 'none'; st.disabled = false; }
    }
    const o = UE.data.items[UE.sel];
    o.x = Math.round(d.x0 + dx); o.y = Math.round(d.y0 + dy);
    $('ue-style').textContent = ueCss(); uePlaceBox();
    return;
  }
  if (!ueInPanel(e.target)) ueHover(e.target); else ueHover(null);
}
function ueOnPointerUp(e) {
  if (!UE.drag) return;
  const moved = UE.drag.moved; UE.drag = null;
  if (moved) { UE.noClick = true; ueSave(); ueRenderBody(); e.stopPropagation(); }
}
function ueOnClick(e) {
  if (!UE.on || UE.pause || ueInPanel(e.target)) return;
  e.preventDefault(); e.stopPropagation();
  if (UE.noClick) { UE.noClick = false; return; }
  let t = e.target;
  if (t.closest('#toast')) { $('toast').hidden = true; t = document.elementFromPoint(e.clientX, e.clientY) || t; }
  ueSelect(t.ownerSVGElement ? t.closest('svg') : t);
}
const ueBlock = e => { if (UE.on && !UE.pause && !ueInPanel(e.target)) { e.preventDefault(); e.stopPropagation(); } };

function ueStart() {
  if (UE.on) return;
  if (!UE.admin) { toast('画面の編集は、マスターとしてログインしているときだけ使えます'); return; }
  closeModals();
  UE.on = true; UE.pause = false;
  document.body.classList.add('ue-on');
  const p = document.createElement('aside');
  p.id = 'ue-panel'; p.className = 'ue-panel'; p.setAttribute('aria-label', '画面の編集');
  p.innerHTML = uePanelHtml();
  document.body.appendChild(p);
  ['ue-box', 'ue-hover'].forEach(id => { const b = document.createElement('div'); b.id = id; b.className = id; b.hidden = true; document.body.appendChild(b); });
  ueRenderBody(); ueApply();
}
function ueStop() {
  UE.el?.classList.remove('ue-picked');
  UE.on = false; UE.el = null; UE.sel = null; UE.drag = null;
  document.body.classList.remove('ue-on');
  ['ue-panel', 'ue-box', 'ue-hover'].forEach(id => $(id)?.remove());
  ueApply();
  if (!ueSame(UE.data, UE.pub)) toast('未公開の変更は下書きとして残っています。みんなの画面には公開した分だけが出ます。');
}

document.addEventListener('pointerdown', ueOnPointerDown, true);
document.addEventListener('pointermove', ueOnPointerMove, true);
document.addEventListener('pointerup', ueOnPointerUp, true);
document.addEventListener('click', ueOnClick, true);
['mousedown', 'mouseup', 'dblclick', 'contextmenu', 'submit'].forEach(t => document.addEventListener(t, ueBlock, true));
addEventListener('scroll', () => { if (UE.on) uePlaceBox(); }, true);
addEventListener('resize', () => { if (UE.on) uePlaceBox(); });
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e') && UE.admin) { e.preventDefault(); UE.on ? ueStop() : ueStart(); return; }
  if (UE.on && e.key === 'Escape' && !ueInPanel(e.target)) {
    e.stopPropagation();
    if (UE.el) { UE.el = null; UE.sel = null; ueRenderBody(); uePlaceBox(); } else ueStop();
  }
}, true);

/* パネルの中の操作 */
function ueInput(e) {
  const t = e.target, k = t.dataset && t.dataset.ueK; if (!k || !ueInPanel(t)) return;
  let v;
  if (t.type === 'checkbox') v = t.checked;
  else if (t.type === 'range' || t.type === 'number') {
    v = t.value === '' ? '' : Number(t.value);
    t.closest('.ue-f').querySelectorAll(`[data-ue-k="${k}"]`).forEach(x => { if (x !== t) x.value = t.value; });
    if ((k === 'x' || k === 'y') && UE.data.items[UE.sel]?.tb == null) {
      const st = $('ue-style'); st.disabled = true; const tb = getComputedStyle(UE.el).translate || 'none'; st.disabled = false;
      ueSet('tb', tb);
    }
  } else v = t.value;
  if (k === 'text' && v === UE.el.textContent && UE.data.items[UE.sel]?.text == null) return;
  ueSet(k, v);
  const clr = t.closest('.ue-f')?.querySelector('.ue-x'); if (clr) clr.disabled = false;
  const rs = $('ue-reset'); if (rs) rs.disabled = false;
}
document.addEventListener('input', e => { if (ueInPanel(e.target)) ueInput(e); });
document.addEventListener('change', e => { if (ueInPanel(e.target) && e.target.type === 'checkbox') ueInput(e); });
document.addEventListener('click', e => {
  const t = e.target; if (!ueInPanel(t)) return;
  const b = t.closest('button'); if (!b) return;
  if (b.id === 'ue-exit') return ueStop();
  if (b.id === 'ue-pause') { UE.pause = !UE.pause; ueHover(null); ueRenderBody(); uePlaceBox(); return; }
  if (b.id === 'ue-parent') return ueSelect(UE.el.parentElement);
  if (b.id === 'ue-publish') return uePublish();
  if (b.id === 'ue-discard') {
    if (b.dataset.armed) { UE.data = ueClone(UE.pub); ueSave(); ueRenderBody(); toast('公開中の状態に戻しました（文言は画面を開き直すと戻ります）'); }
    else { b.dataset.armed = '1'; b.textContent = 'もう一度押すと戻します'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = '公開中の状態に戻す'; } }, 3000); }
    return;
  }
  if (b.id === 'ue-reset') {
    const o = UE.data.items[UE.sel];
    if (o && o.text != null && UE.el) toast('文言は、画面を開き直すと元に戻ります');
    delete UE.data.items[UE.sel]; ueSave(); ueRenderBody(); return;
  }
  if (b.dataset.ueClear) {
    const o = UE.data.items[UE.sel]; if (!o) return;
    b.dataset.ueClear.split(',').forEach(k => delete o[k]);
    if (Object.keys(o).every(x => x === 'label')) delete UE.data.items[UE.sel];
    ueSave(); ueRenderBody(); return;
  }
  if (b.dataset.ueSel) {
    const el = ueFind(b.dataset.ueSel);
    if (!el) { UE.el = null; UE.sel = b.dataset.ueSel; toast('その部品はいまの画面にありません（別の画面やウィンドウの中かもしれません）'); return; }
    UE.pause = false; ueSelect(el); el.scrollIntoView({ block: 'nearest' }); return;
  }
  if (b.id === 'ue-reset-all') {
    if (!Object.keys(UE.data.items).length) return;
    if (b.dataset.armed) { UE.data.items = {}; ueSave(); ueRenderBody(); toast('すべて元に戻しました（文言は画面を開き直すと戻ります）'); delete b.dataset.armed; b.textContent = 'すべて元に戻す'; }
    else { b.dataset.armed = '1'; b.textContent = 'もう一度押すと戻します'; setTimeout(() => { if (b.isConnected) { delete b.dataset.armed; b.textContent = 'すべて元に戻す'; } }, 3000); }
    return;
  }
  if (b.id === 'ue-export') {
    const txt = JSON.stringify(UE.data, null, 1);
    navigator.clipboard.writeText(txt).then(() => toast('編集内容をコピーしました（予備の保存や、Claudeにコードへ組み込んでもらうときに使えます）'),
      () => { const io = $('ue-io'); io.hidden = false; io.value = txt; io.select(); toast('自動でコピーできなかったので、下の文字を選んでコピーしてください'); });
    return;
  }
  if (b.id === 'ue-import') { const io = $('ue-io'); io.hidden = !io.hidden; io.value = ''; $('ue-io-go').hidden = io.hidden; io.focus(); return; }
  if (b.id === 'ue-io-go') {
    try {
      const s = JSON.parse($('ue-io').value);
      if (!s || typeof s.items !== 'object') throw 0;
      UE.data = { v: 1, items: s.items }; ueSave(); ueRenderBody();
      $('ue-io').hidden = true; b.hidden = true; toast('読み込みました');
    } catch (err) { toast('読み込めませんでした。書き出した内容をそのまま貼ってください。'); }
  }
});

$('ue-open')?.addEventListener('click', ueStart);
ueLoad();
uePull();
