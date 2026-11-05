/* ================= 描画 ================= */
const initial = c => (c.profile.name || '？').trim().charAt(0) || '？';
const portraitSrc = c => c.portrait || (/^https?:\/\//.test(c.profile.iconUrl || '') ? c.profile.iconUrl : '');
const iconSrc = c => c.icon || portraitSrc(c);
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
      <span class="ci-lv" title="通過したシナリオの数＋1（0本なら Lv. 1）">Lv. ${c.scenarios.filter(x => String(x.name || '').trim()).length + 1}</span><span class="ci-go" aria-hidden="true">›</span>
    </button>`).join('');
}

const pid = path => 'f-' + path.replace(/\./g, '-');
const inp = (path, value, opts = {}) =>
  `<input class="${opts.cls || 'inp'}" id="${pid(path)}" data-p="${path}" value="${esc(value)}"${opts.ph ? ` placeholder="${esc(opts.ph)}"` : ''}${opts.num ? ' inputmode="numeric"' : ''}${opts.label ? ` aria-label="${esc(opts.label)}"` : ''}>`;
const field = (label, path, value, opts = {}) =>
  `<div class="field ${opts.wrap || ''}"><label for="${pid(path)}">${label}</label>${inp(path, value, opts)}</div>`;
const area = (path, value, label, rows = 3, cls = 'inp') =>
  `<textarea class="${cls}" id="${pid(path)}" data-p="${path}" rows="${rows}" aria-label="${label}"${cls.includes('mono') ? ' spellcheck="false"' : ''}>${esc(value)}</textarea>`;
