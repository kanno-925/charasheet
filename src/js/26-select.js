/* ================= 探索者をえらぶ画面 ================= */
let selPress = null, selLong = false, selResizeT = null;
function renderSelect() {
  const stage = $('sel-stage');
  $('sel-rest')?.remove();
  document.querySelectorAll('[data-seltab]').forEach(b => { const on = b.dataset.seltab === selTab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  $('sel-eyebrow').textContent = { friends: 'FRIENDS', groups: 'GROUPS' }[selTab] || 'SELECT YOUR INVESTIGATOR';
  $('sel-title').textContent = { friends: 'フレンド一覧', groups: 'グループ' }[selTab] || '探索者をえらぶ';
  $('sel-desc').textContent = { friends: 'フレンドを押すと、その人の公開キャラシが見られます。真ん中からフレンドを追加できます。', groups: '代表者がグループを作ってフレンドを招待し、招待された人はキーパーか探索者かを選んで参加します。キャラ名を押すとキャラシが開きます。' }[selTab] || 'キャラを押すとシートが開きます。真ん中から新しい探索者をつくれます。';
  renderSortBar();
  if (selTab === 'friends') { renderFriendSelect(stage); return; }
  if (selTab === 'groups') { renderGroupSelect(stage); return; }
  if ((state.selView || 'orbit') === 'list') {
    stage.classList.remove('grid'); stage.classList.add('listv'); stage.style.height = '';
    stage.innerHTML = listViewHtml(sortedChars());
    return;
  }
  stage.classList.remove('listv');
  const W = stage.clientWidth || Math.min(1100, innerWidth - 32);
  const small = W < 560;
  const B = small ? 70 : 100;
  const chars = sortedChars();
  const pos = [], radii = [];
  let r = small ? Math.min(150, W / 2 - (B + 44) / 2 - 4) : 210, ring = 0, idx = 0, grid = false;
  const ky = small ? 1.45 : 1;
  if (r < 100) grid = true;
  while (!grid && idx < chars.length) {
    if (r + (B + 44) / 2 > W / 2) break;
    const cap = Math.max(5, Math.floor(2 * Math.PI * r / (B + 54)));
    const n = Math.min(cap, chars.length - idx);
    for (let j = 0; j < n; j++) {
      const ang = -Math.PI / 2 + (j + (ring % 2) * .5) / n * 2 * Math.PI;
      pos.push([r * Math.cos(ang), r * ky * Math.sin(ang)]);
    }
    radii.push(r); idx += n; r += B + 62; ring++;
  }
  const newBtn = `<button class="sel-new" type="button" id="sel-new"><span class="plus">＋</span><b>新しい探索者</b><small>NEW INVESTIGATOR</small></button>`;
  const charBtn = (c, i, xy) => `<button class="sel-char" type="button" data-id="${c.id}" style="--i:${i};--B:${B}px${xy ? `;left:calc(50% + ${xy[0].toFixed(1)}px);top:calc(50% + ${xy[1].toFixed(1)}px)` : ''}" aria-label="${esc(c.profile.name || '名無し')}のシートを開く">
      ${tokenHtml(c)}${c.bgm ? '<span class="sel-bgm" title="BGMあり">♪</span>' : ''}${c.locked ? '<span class="sel-lock" title="フレンドに非公開"><svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg></span>' : ''}<span class="sel-name">${esc(c.profile.name || '名無し')}</span><span class="sel-sys">${esc(sortValueText(c) || (SYS[c.system].short + (c.profile.occupation ? ' ・ ' + c.profile.occupation : '')))}</span>
    </button>`;
  stage.classList.toggle('grid', grid);
  if (grid) idx = chars.length;
  if (grid) {
    stage.style.height = '';
    stage.innerHTML = `${newBtn}<div class="sel-grid">${chars.map((c, i) => charBtn(c, i)).join('')}</div>`;
  } else {
    const maxR = radii.length ? radii[radii.length - 1] : r;
    const H = Math.max(small ? 360 : 480, 2 * (maxR * ky + B / 2 + 46));
    const rest = chars.slice(idx);
    stage.style.height = H + 'px';
    const ringR = radii.length ? radii : [maxR];
    stage.innerHTML = `<svg class="sel-rings" aria-hidden="true">${ringR.map(rr => `<ellipse cx="50%" cy="50%" rx="${rr}" ry="${(rr * ky).toFixed(1)}"/>`).join('')}<circle cx="50%" cy="50%" r="${small ? 80 : 112}"/></svg>
      ${newBtn}${chars.slice(0, idx).map((c, i) => charBtn(c, i, pos[i])).join('')}
      ${chars.length ? '' : '<p class="sel-empty">まだ探索者がいません。真ん中を押して作りましょう。</p>'}`;
    if (rest.length) stage.insertAdjacentHTML('afterend', `<div class="sel-grid sel-rest" id="sel-rest">${rest.map((c, i) => charBtn(c, idx + i)).join('')}</div>`);
  }
}
function popSelect() {
  if (reduceMotion.matches) return;
  const stage = $('sel-stage');
  stage.querySelectorAll('.sel-char, .sel-row').forEach((el, i) => el.animate(
    [{ opacity: 0, transform: 'scale(.3)', filter: 'blur(6px)' }, { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' }],
    { duration: 700, delay: 120 + i * 70, easing: 'cubic-bezier(.2, .9, .3, 1.25)', fill: 'backwards' }));
  $('sel-new')?.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1 }], { duration: 700, easing: 'cubic-bezier(.2, .9, .3, 1.2)' });
  document.querySelector('.sel-head')?.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'ease-out' });
}
function showSelect() {
  hidePeek();
  if (selTab === 'friends') setTimeout(refreshFriendView, 0);
  stopBgm(); $('bgm').hidden = true;
  const sel = $('select'); sel.hidden = false; sel.scrollTop = 0;
  applyBg();
  document.documentElement.style.overflow = 'hidden';
  renderSelect();
  if (!reduceMotion.matches) sel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
  popSelect();
}
function leaveSelect(fromEl, quick) {
  hidePeek();
  const sel = $('select');
  const done = () => { sel.hidden = true; document.documentElement.style.overflow = ''; scrollTo(0, 0); renderPlayer(); };
  if (reduceMotion.matches || quick) { done(); return; }
  if (fromEl) {
    fxAt(fromEl, true);
    fromEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'forwards' });
  }
  const a = sel.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.06)', filter: 'blur(10px)' }], { duration: 560, delay: 140, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'forwards' });
  a.finished.then(() => {
    done(); a.cancel();
    document.querySelector('.app').animate([{ opacity: .2, transform: 'scale(1.03)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 800, easing: 'cubic-bezier(.2, .8, .2, 1)' });
  });
}
$('select').addEventListener('click', e => {
  const tb = e.target.closest('[data-seltab]');
  if (tb) { setSelTab(tb.dataset.seltab); return; }
  if (e.target.closest('#sel-newgroup')) { openGroupEditor(null); return; }
  const ge = e.target.closest('[data-gedit]');
  if (ge) { openGroupEditor(ge.dataset.gedit); return; }
  const gj = e.target.closest('[data-gjoin]');
  if (gj) { openJoin(gj.dataset.gjoin); return; }
  const gd = e.target.closest('[data-gdecline]');
  if (gd) { declineGroup(gd.dataset.gdecline); return; }
  const gm = e.target.closest('[data-gm-user]');
  if (gm) { openMemberChar(gm.dataset.gmUser, gm.dataset.gmChar); return; }
  if (e.target.closest('#sel-addfriend')) { openFriends(); setTimeout(() => $('ol-name')?.focus(), 60); return; }
  if (e.target.closest('#sel-login')) { acctTab = 'login'; openAccount(); return; }
  const fb = e.target.closest('.sel-friend');
  if (fb) { if (selLong) { selLong = false; return; } if (fb.dataset.kind === 'fr') viewFriend(fb.dataset.fuid, fb.dataset.fname); else openFriends(); return; }
  if (e.target.closest('#sel-new')) { openModal('modal-new'); return; }
  if (e.target.closest('#sel-import')) { $('btn-import').click(); return; }
  if (e.target.closest('#sel-theme')) { $('btn-theme').click(); return; }
  const ch = e.target.closest('.sel-char, .sel-row'); if (!ch) return;
  if (selLong) { selLong = false; return; }
  state.activeId = ch.dataset.id; save();
  renderShelf(); renderSheet(); renderOutput();
  leaveSelect(ch);
  playCharBgm(active());
});
$('select').addEventListener('pointerover', e => {
  if (!canHover.matches) return;
  const ch = e.target.closest('.sel-char:not(.sel-friend), .sel-row');
  if (ch && ch.dataset.id !== peekId) showPeek(ch);
  if (!ch && peekId) hidePeek();
});
$('select').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hidePeek(); });
$('select').addEventListener('scroll', hidePeek, { passive: true });
$('select').addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return;
  const ch = e.target.closest('.sel-char'); if (!ch) return;
  selLong = false; clearTimeout(selPress);
  selPress = setTimeout(() => { selLong = true; showPeek(ch); if (navigator.vibrate) navigator.vibrate(10); }, 450);
});
['pointerup', 'pointercancel'].forEach(ev => $('select').addEventListener(ev, () => clearTimeout(selPress)));
$('select').addEventListener('contextmenu', e => { if (e.target.closest('.sel-char')) e.preventDefault(); });
$('btn-select').addEventListener('click', () => { selTab = 'mine'; showSelect(); });
document.querySelector('.brand').addEventListener('click', () => { selTab = 'mine'; showSelect(); });
document.querySelector('.brand').style.cursor = 'pointer';
addEventListener('resize', () => { clearTimeout(selResizeT); selResizeT = setTimeout(() => { if (!$('select').hidden) renderSelect(); }, 150); });
