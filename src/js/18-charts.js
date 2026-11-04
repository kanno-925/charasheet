/* ================= グラフ ================= */
function radarSvg(c, a, size, animate) {
  const keys = SYS[c.system].abil.filter(([k]) => k !== 'LUCK').map(([k]) => k);
  const is7 = c.system === 'coc7';
  const maxV = Math.max(is7 ? 90 : 18, ...keys.map(k => a[k] || 0));
  const pad = 38, cx = size / 2, cy = size / 2, R = size / 2 - pad, n = keys.length;
  const P = (i, r) => { const t = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const poly = r => keys.map((_, i) => P(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
  const pts = keys.map((k, i) => P(i, R * Math.max(0, Math.min(1, (a[k] || 0) / maxV))));
  const grid = [.25, .5, .75, 1].map(f => `<polygon class="rg" points="${poly(R * f)}"/>`).join('');
  const axes = keys.map((_, i) => { const [x, y] = P(i, R); return `<line class="ra" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('');
  const labels = keys.map((k, i) => {
    const [x, y] = P(i, R + 18), anchor = Math.abs(x - cx) < 4 ? 'middle' : x < cx ? 'end' : 'start';
    return `<text class="rl-k" x="${x.toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="${anchor}">${k}</text><text class="rl-v" x="${x.toFixed(1)}" y="${(y + 8).toFixed(1)}" text-anchor="${anchor}">${a[k] || 0}</text>`;
  }).join('');
  const dots = pts.map(([x, y], i) => `<circle class="rd" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"/><circle class="rh" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" data-tip="${keys[i]} ${a[keys[i]] || 0}"/>`).join('');
  return `<svg class="radar-svg${animate ? ' grow' : ''}" viewBox="0 0 ${size} ${size}" role="img" aria-label="能力値チャート：${keys.map(k => `${k} ${a[k] || 0}`).join('、')}" style="--cx:${cx}px;--cy:${cy}px">
    ${grid}${axes}<g class="rshape"><polygon class="rarea" points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}"/>${dots}</g>${labels}</svg>`;
}
function skillBarsHtml(c, a, animate) {
  const list = c.skills.filter(s => s.name && skillTotal(s, a) !== skillInit(s, a))
    .map(s => ({ n: skillLabel(s), t: skillTotal(s, a), i: Math.min(skillInit(s, a), skillTotal(s, a)) }))
    .sort((x, y) => y.t - x.t).slice(0, 16);
  if (!list.length) return '<p class="empty">ポイントを振ると、ここに技能のグラフが出ます。</p>';
  const max = Math.max(100, ...list.map(x => x.t));
  return `<div class="sk-bars${animate ? ' grow' : ''}">${list.map((x, k) => `
    <div class="sk-row" style="--k:${k}" data-tip="${esc(x.n)}　初期値 ${x.i} ＋ 振ったポイント ${x.t - x.i} ＝ ${x.t}">
      <span class="sk-n">${esc(x.n)}</span>
      <span class="sk-tr"><i class="seg-i" style="width:${(x.i / max * 100).toFixed(2)}%"></i><i class="seg-a" style="width:${((x.t - x.i) / max * 100).toFixed(2)}%"></i></span>
      <b class="sk-v">${x.t}</b>
    </div>`).join('')}
    <div class="sk-row sk-axisrow" aria-hidden="true"><span></span><span class="sk-axis">${[0, 25, 50, 75, 100].filter(v => v <= max).map(v => `<span style="left:${(v / max * 100).toFixed(2)}%">${v}</span>`).join('')}</span><span></span></div>
  </div>`;
}
function updateCharts(c, a) {
  const r = $('ab-radar');
  if (r) { r.innerHTML = radarSvg(c, a, 300, !r.dataset.drawn); r.dataset.drawn = '1'; }
  const k = $('sk-chart');
  if (k) { k.innerHTML = skillBarsHtml(c, a, !k.dataset.drawn); k.dataset.drawn = '1'; }
}
/* グラフのツールチップ */
(() => {
  const tip = document.createElement('div');
  tip.className = 'chart-tip'; tip.hidden = true; tip.setAttribute('role', 'status');
  document.body.appendChild(tip);
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-tip]');
    if (!t) { tip.hidden = true; return; }
    tip.textContent = t.dataset.tip; tip.hidden = false;
    const r = t.getBoundingClientRect();
    tip.style.left = Math.min(innerWidth - tip.offsetWidth - 8, Math.max(8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px';
    tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + 'px';
  });
  addEventListener('scroll', () => { tip.hidden = true; }, { passive: true, capture: true });
})();
