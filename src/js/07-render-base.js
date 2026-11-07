/* ================= 描画 ================= */
const initial = c => (c.profile.name || '？').trim().charAt(0) || '？';
const basePortrait = c => c.portrait || (/^https?:\/\//.test(c.profile.iconUrl || '') ? c.profile.iconUrl : '');
/* 立ち絵の差分（表情など）：c.faces = [{ label, src }]、c.face = いま表示している差分の番号（ない・-1 なら基本の立ち絵） */
const curFace = c => (c.faces && c.face >= 0 && c.faces[c.face] && c.faces[c.face].src) ? c.faces[c.face] : null;
const portraitSrc = c => { const f = curFace(c); return f ? f.src : basePortrait(c); };
const iconSrc = c => c.icon || basePortrait(c);   // アイコンは差分を切りかえても変えない
const MAX_FACES = 20;
const cropStyle = k => { k = k || {}; const x = k.x ?? 50, y = k.y ?? 15, z = k.z ?? 1; return `object-position:${x}% ${y}%;transform:scale(${z});transform-origin:${x}% ${y}%`; };
const tokenHtml = c => {
  const src = c.avatar || iconSrc(c);
  const img = src ? `<img src="${esc(imgSrc(src))}" alt="" ${c.avatar ? '' : `style="${cropStyle(c.iconCrop)}"`} onerror="this.remove()">` : '';
  return `<span class="token" style="--tc:${esc(c.profile.color || '#1f6fe0')}" aria-hidden="true">${esc(initial(c))}${img}</span>`;
};

function renderShelf() {
  $('shelf').innerHTML = sortedChars().map(c => `
    <button class="char-item ${c.id === state.activeId ? 'active' : ''}" type="button" data-id="${c.id}">
      ${tokenHtml(c)}
      <span style="min-width:0"><span class="nm">${esc(c.profile.name || '名無し')}</span><span class="sys">${esc(SYS[c.system].short)}${c.profile.occupation ? ' ・ ' + esc(c.profile.occupation) : ''}</span></span>
      <span class="ci-go" aria-hidden="true">›</span>
    </button>`).join('');
}

const pid = path => 'f-' + path.replace(/\./g, '-');
const inp = (path, value, opts = {}) =>
  `<input class="${opts.cls || 'inp'}" id="${pid(path)}" data-p="${path}" value="${esc(value)}"${opts.ph ? ` placeholder="${esc(opts.ph)}"` : ''}${opts.num ? ' inputmode="numeric"' : ''}${opts.label ? ` aria-label="${esc(opts.label)}"` : ''}>`;
const field = (label, path, value, opts = {}) =>
  `<div class="field ${opts.wrap || ''}"><label for="${pid(path)}">${label}</label>${inp(path, value, opts)}</div>`;
const area = (path, value, label, rows = 3, cls = 'inp') =>
  `<textarea class="${cls}" id="${pid(path)}" data-p="${path}" rows="${rows}" aria-label="${label}"${cls.includes('mono') ? ' spellcheck="false"' : ''}>${esc(value)}</textarea>`;
