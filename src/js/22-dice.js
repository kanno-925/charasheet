/* ================= ダイスの結果表示 ================= */
const diceTray = (() => { const t = document.createElement('div'); t.className = 'dice-tray'; t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); return t; })();
function judge(v, target, sys) {
  if (sys === 'coc7') {
    if (v === 1) return ['crit', 'クリティカル'];
    if (v === 100 || (target < 50 && v >= 96)) return ['fumble', 'ファンブル'];
    if (v <= Math.floor(target / 5)) return ['crit', 'イクストリーム成功'];
    if (v <= Math.floor(target / 2)) return ['ok', 'ハード成功'];
    if (v <= target) return ['ok', 'レギュラー成功'];
    return ['fail', '失敗'];
  }
  if (v <= 5 && v <= target) return ['crit', '決定的成功（クリティカル）'];
  if (v >= 96 && v > target) return ['fumble', '致命的失敗（ファンブル）'];
  if (v <= target) return ['ok', '成功'];
  return ['fail', '失敗'];
}
function pushCard(html, cls) {
  const card = document.createElement('div');
  card.className = 'dcard ' + (cls || '');
  card.innerHTML = html + '<button class="dc-x" type="button" aria-label="閉じる">×</button>';
  diceTray.prepend(card);
  [...diceTray.children].slice(innerWidth < 760 ? 1 : 3).forEach(el => el.remove());
  card.querySelector('.dc-x').addEventListener('click', () => card.remove());
  clearTimeout(card._t);
  card._t = setTimeout(() => { card.classList.add('out'); setTimeout(() => card.remove(), 400); }, 9000);
  return card;
}
function tumble(card, done) {
  const faces = card.querySelectorAll('[data-face]');
  const nums = card.querySelectorAll('[data-final]');
  if (reduceMotion.matches) { faces.forEach(f => { f.textContent = f.dataset.face; }); nums.forEach(n => { n.textContent = n.dataset.final; }); done && done(); return; }
  const t0 = performance.now(), dur = 650;
  const step = t => {
    const k = (t - t0) / dur;
    if (k < 1) {
      faces.forEach(f => { f.textContent = 1 + Math.floor(Math.random() * (+f.dataset.sides || 6)); });
      nums.forEach(n => { n.textContent = Math.floor(Math.random() * (+n.dataset.max || 99)) + 1; });
      requestAnimationFrame(step);
    } else {
      faces.forEach(f => { f.textContent = f.dataset.face; f.classList.add('land'); });
      nums.forEach(n => { n.textContent = n.dataset.final; n.classList.add('land'); });
      done && done();
    }
  };
  requestAnimationFrame(step);
}
const facesHtml = r => r.groups.map(g => g.faces.map(f => `<i class="die" data-face="${f}" data-sides="${g.s}">?</i>`).join('')).join('<span class="dplus">＋</span>');
function diceCardOne(name, r) {
  const card = pushCard(`<div class="dc-head"><b>${esc(name)}</b><small>${esc(r.expr)}</small></div>
    <div class="dc-body"><span class="dc-faces">${facesHtml(r)}</span><span class="dc-eq">＝</span><b class="dc-total" data-final="${r.total}" data-max="${Math.max(18, r.total)}">?</b></div>`, 'one');
  tumble(card);
}
function diceCardAll(list) {
  const card = pushCard(`<div class="dc-head"><b>能力値をまとめて振りました</b></div>
    <div class="dc-grid">${list.map(r => `<div class="dc-row"><b>${esc(r.k)}</b><span class="dc-faces sm">${facesHtml(r)}</span><small>${esc(r.expr)}</small><b class="dc-total sm" data-final="${r.total}" data-max="${Math.max(18, r.total)}">?</b></div>`).join('')}</div>`, 'all');
  tumble(card);
}
function diceCardCheck(name, target, sys) {
  const v = 1 + Math.floor(Math.random() * 100);
  const [cls, label] = judge(v, target, sys);
  const card = pushCard(`<div class="dc-head"><b>${esc(name)}</b><small>${sys === 'coc7' ? 'CC' : 'CCB'}&lt;=${target}</small></div>
    <div class="dc-body"><b class="dc-total big" data-final="${v}" data-max="100">?</b><span class="dc-vs">/ ${target}</span><span class="dc-verdict" hidden>${label}</span></div>`, 'check');
  tumble(card, () => {
    const vd = card.querySelector('.dc-verdict');
    vd.hidden = false; card.classList.add('res-' + cls);
    if (cls === 'crit' && !reduceMotion.matches) fxAt(vd, true);
  });
}
