/* ================= 本のテーマ（付箋で項目を切り替える） ================= */
const BOOK_LABEL = { profile: '人物', abilities: '能力値', skills: '技能', weapons: '武器', items: '所持品', money: '財産', tomes: '神話', scenarios: '冒険記録', story: '経歴' };
const isBook = () => (presetOf().look || '').split(' ').includes('book');
const KANJI = '一二三四五六七八九十';
const kn = i => i < 10 ? KANJI[i] : '十' + (KANJI[i - 10] || '');
function subsOf(key, c) {
  const t = document.createElement('template');
  t.innerHTML = sectionBody(key, c);
  const q = sel => t.content.querySelector(sel);
  const fieldOf = id => { const el = t.content.getElementById(id); return el ? el.closest('.field').outerHTML : ''; };
  const fields = (...ids) => `<div class="fields">${ids.map(fieldOf).join('')}</div>`;
  const o = x => x ? x.outerHTML : '';
  const entry = (arr, kind, mk, emptyName) => arr.map((row, i) => ({ id: 'e' + i, label: row.name || emptyName, entry: i, html: mk(row, i) }));
  const del = (k, i, word) => `<div class="bk-entry-act"><button class="btn small danger" type="button" data-del="${k}" data-i="${i}">この${word}を消す</button></div>`;
  switch (key) {
    case 'profile': return [
      { id: 'basic', label: '基本の記録', html: fields('f-profile-name', 'f-profile-kana', 'f-profile-occupation', 'f-profile-age', 'f-profile-birthday', 'f-profile-sex', 'f-profile-origin', 'f-profile-player') },
      { id: 'look', label: '容姿', html: fields('f-profile-height', 'f-profile-weight', 'f-profile-hair', 'f-profile-eyes', 'f-profile-skin', 'f-profile-tags') },
      { id: 'image', label: '肖像と画像', html: `<div class="fields">${fieldOf('f-portrait-file')}${fieldOf('f-profile-iconUrl')}${fieldOf('f-profile-externalUrl')}${fieldOf('f-charbg-file')}${fieldOf('f-profile-color')}</div>` },
      { id: 'bgm', label: '旋律（BGM）', html: `<div class="fields">${fieldOf('f-bgm-file')}</div>` },
      { id: 'manage', label: 'この書の取り扱い', html: `<p class="bk-note">この探索者の記録を、フレンドに見せるか隠すか決めたり、写本（複製）を作ったり、破り捨てたり（削除）できます。</p><div class="bk-manage">${toolsHtml(c)}</div>` },
    ];
    case 'abilities': return [
      { id: 'table', label: '能力値表', html: o(q('.sec-title')) + o(q('.ab-tbl')?.closest('.tbl-wrap')) },
      { id: 'derived', label: '体力・正気・副能力値', html: o(q('.derived')) },
      { id: 'chart', label: '能力値の図', html: o(q('.radar-fig')) },
    ];
    case 'skills': return [
      { id: 'points', label: '技能点の配分', html: `<p class="bk-note">左の目次から技能の種類を開くと、ポイントを書き込めます。</p>${o(q('.points'))}${o(q('.sk-fig'))}` },
      ...CATS.map(([cat, label]) => ({ id: 'cat-' + cat, label, html: `${o(q('.points'))}${o(q(`.skill-block[data-cat="${cat}"]`))}` })),
    ];
    case 'weapons': return entry(c.weapons, 'weapon', (w, i) => `<p class="bk-note">ダメージの「DB」はダメージ・ボーナスに置き換えて出力します。</p><div class="fields">
        ${field('名称', `weapons.${i}.name`, w.name, { wrap: 'wide' })}${field('成功率', `weapons.${i}.rate`, w.rate)}${field('ダメージ', `weapons.${i}.damage`, w.damage)}
        ${field('射程', `weapons.${i}.range`, w.range)}${field('攻撃回数', `weapons.${i}.attacks`, w.attacks)}${field('装弾数', `weapons.${i}.ammo`, w.ammo)}${field('耐久力', `weapons.${i}.durability`, w.durability)}
        ${field('その他', `weapons.${i}.note`, w.note, { wrap: 'wide' })}</div>${del('weapons', i, '武器')}`, '名もなき武器');
    case 'items': return entry(c.items, 'item', (it, i) => `<div class="fields">
        ${field('名称', `items.${i}.name`, it.name, { wrap: 'wide' })}${field('個数', `items.${i}.count`, it.count)}${field('価格', `items.${i}.price`, it.price)}
        ${field('効果・備考', `items.${i}.note`, it.note, { wrap: 'wide' })}</div>${del('items', i, '所持品')}`, '名もなき品');
    case 'money': return [{ id: 'all', label: '財産の記録', html: o(q('.fields')) }];
    case 'tomes': return [
      { id: 'tomes', label: '魔導書・呪文・遺物', html: area('tomes', c.tomes, '魔導書・呪文・アーティファクト', 12) },
      { id: 'entities', label: '遭遇した存在', html: area('entities', c.entities, '遭遇した超自然の存在', 12) },
    ];
    case 'scenarios': return [
      { id: 'friends', label: '共に歩んだ仲間', html: o(q('.played-with')) + `<div class="bk-entry-act"><button class="btn small" type="button" data-act="open-friends">フレンドを管理</button></div>` },
      ...entry(c.scenarios, 'scenario', (sc, i) => `<div class="fields">
        ${field('シナリオ名', `scenarios.${i}.name`, sc.name, { wrap: 'wide' })}${field('日付', `scenarios.${i}.date`, sc.date, { ph: '例：2026/10/01' })}
        ${field('メモ（生還・報酬・KPなど）', `scenarios.${i}.note`, sc.note, { wrap: 'wide' })}</div>
        <div class="scn-friends"><span class="lbl">一緒に遊んだフレンド</span>${friendsOf().length ? friendsOf().map(f => fchip(f, `data-act="toggle-friend" data-i="${i}" data-fid="${f.id}" aria-pressed="${(sc.friends || []).includes(f.id)}"`, (sc.friends || []).includes(f.id))).join('') : '<span class="empty">フレンドがまだいません。</span>'}</div>
        ${del('scenarios', i, '記録')}`, '無題の冒険'),
    ];
    case 'story': return [
      { id: 'backstory', label: '経歴', html: area('backstory', c.backstory, '経歴', 14) },
      { id: 'memo', label: '覚え書き（メモ）', html: `<p class="bk-note">ココフォリアのコマのメモ欄に入ります。</p>${area('memo', c.memo, 'メモ', 10)}` },
      { id: 'extra', label: '追加の呪文（コマンド）', html: `<p class="bk-note">1行に1コマンド。チャットパレットの末尾に入ります。</p>${area('extra', c.extra, '追加コマンド', 8, 'inp mono')}` },
    ];
    default: return [{ id: 'all', label: '記録', html: sectionBody(key, c) }];
  }
}
const ADD_FOR = { weapons: ['add-weapon', '新たな武器を書き加える'], items: ['add-item', '新たな品を書き加える'], scenarios: ['add-scenario', '新たな冒険を書き加える'] };
const bookSubMap = () => (state.bookSub = state.bookSub || {});
function bookHtml(c) {
  const p = c.profile;
  const key = SECTIONS.some(x => x.key === state.bookTab) ? state.bookTab : 'profile';
  const sec = SECTIONS.find(x => x.key === key), idx = SECTIONS.indexOf(sec);
  const subs = subsOf(key, c);
  let cur = subs.find(x => x.id === bookSubMap()[key]) || subs[0];
  const src = portraitSrc(c);
  const add = ADD_FOR[key];
  const toc = subs.map((x, i) => `<li><button class="bk-toc ${cur && x.id === cur.id ? 'on' : ''}" type="button" data-booksub="${x.id}" aria-current="${!!(cur && x.id === cur.id)}">
      <span class="bt-n">${kn(i)}</span><span class="bt-l">${esc(x.label)}</span><span class="bt-d" aria-hidden="true"></span><span class="bt-p">${idx * 20 + i * 2 + 13}</span></button></li>`).join('');
  const body = cur ? cur.html : `<p class="bk-empty">まだ何も記されていない頁だ。<br>左の「${add ? add[1] : ''}」から書き始めよう。</p>`;
  const curNo = cur ? subs.indexOf(cur) : 0;
  return `<div class="book" id="book">
    <div class="bk-cover">
      <span class="bk-corners" aria-hidden="true"><svg class="bk-corner" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 56V14C4 8 8 4 14 4h42"/><path d="M10 50V18c0-5 3-8 8-8h32"/><path d="M18 18c8 0 12 4 12 12M18 18c0 8 4 12 12 12"/><circle cx="18" cy="18" r="3"/><path d="M4 34c6 0 9 3 9 9M34 4c0 6 3 9 9 9"/></svg><svg class="bk-corner" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 56V14C4 8 8 4 14 4h42"/><path d="M10 50V18c0-5 3-8 8-8h32"/><path d="M18 18c8 0 12 4 12 12M18 18c0 8 4 12 12 12"/><circle cx="18" cy="18" r="3"/><path d="M4 34c6 0 9 3 9 9M34 4c0 6 3 9 9 9"/></svg><svg class="bk-corner" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 56V14C4 8 8 4 14 4h42"/><path d="M10 50V18c0-5 3-8 8-8h32"/><path d="M18 18c8 0 12 4 12 12M18 18c0 8 4 12 12 12"/><circle cx="18" cy="18" r="3"/><path d="M4 34c6 0 9 3 9 9M34 4c0 6 3 9 9 9"/></svg><svg class="bk-corner" viewBox="0 0 60 60" aria-hidden="true"><path d="M4 56V14C4 8 8 4 14 4h42"/><path d="M10 50V18c0-5 3-8 8-8h32"/><path d="M18 18c8 0 12 4 12 12M18 18c0 8 4 12 12 12"/><circle cx="18" cy="18" r="3"/><path d="M4 34c6 0 9 3 9 9M34 4c0 6 3 9 9 9"/></svg></span>
      <span class="bk-clasp" aria-hidden="true"></span>
      <nav class="bk-tabs" aria-label="章の付箋">${SECTIONS.map((x, i) => `<button class="bk-tab ${x.key === key ? 'on' : ''}" type="button" data-booktab="${x.key}" style="--bc:${x.color};--i:${i}" aria-current="${x.key === key}" aria-label="${x.jp}">${BOOK_LABEL[x.key]}</button>`).join('')}</nav>
      <div class="bk-pages">
        <div class="bk-page bk-left">
          <svg class="bk-circle" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="88" class="d"/><circle cx="100" cy="100" r="62"/><polygon points="100,12 176,144 24,144"/><polygon points="100,188 24,56 176,56"/><circle cx="100" cy="100" r="30" class="d"/><text x="100" y="9" text-anchor="middle">ᚠ</text><text x="191" y="104" text-anchor="middle">ᚱ</text><text x="100" y="199" text-anchor="middle">ᚲ</text><text x="9" y="104" text-anchor="middle">ᚷ</text></svg>
          <span class="bk-stain l" aria-hidden="true"></span>
          <div class="bk-owner">
            <button class="bk-portrait ${src ? 'has' : ''}" type="button" data-stage aria-label="立ち絵を表示">${src ? `<img src="${esc(imgSrc(src))}" alt="" onerror="this.remove()">` : tokenHtml(c)}<span class="tape" aria-hidden="true"></span></button>
            <div class="bk-owner-t">
              <p class="bk-kicker">探索者の記録</p>
              <h2 class="bk-name" data-hub="name">${esc(p.name || '名無し')}</h2>
              <p class="bk-kana" data-hub="kana">${esc(p.kana || '')}</p>
              <p class="bk-sub" data-hub="sub"></p>
            </div>
          </div>
          <div class="pbars bk-bars">${['hp', 'mp', 'san'].map(k => `<div class="pbar"><b>${k.toUpperCase()}</b><span class="tr"><i data-bar="${k}"></i></span><span data-out="${k}Cur"></span></div>`).join('')}</div>
          <div class="bk-chapter"><span class="bk-en">第${kn(idx)}章</span><h3>${sec.jp}</h3></div>
          <ol class="bk-tocs">${toc}</ol>
          ${add ? `<button class="bk-add" type="button" data-act="${add[0]}">＋ ${add[1]}</button>` : ''}
          <p class="bk-folio">${idx * 20 + 12}</p>
        </div>
        <span class="bk-ribbon" aria-hidden="true"></span>
        <div class="bk-page bk-right" id="bk-right">
          <span class="bk-stain" aria-hidden="true"></span>
          <div class="bk-head"><span class="bk-en">第${kn(idx)}章 ・ ${kn(curNo)}</span><h3>${cur ? esc(cur.label) : sec.jp}</h3></div>
          <div class="bk-body">${body}</div>
          <p class="bk-folio">${idx * 20 + curNo * 2 + 13}</p>
        </div>
      </div>
    </div>
  </div>`;
}
function writeIn(pg) {
  if (!pg || reduceMotion.matches) return;
  const els = [...pg.querySelectorAll('.bk-head .bk-en, .bk-head h3, .bk-note, .field, .sec-title, .points .pt, .tbl thead tr, .tbl tbody tr, .dv, .chart-fig, .sub-title, .scn-friends, .played-with, .bk-entry-act, .bk-manage, textarea, .bk-empty')]
    .filter(el => !el.closest('.field') || el.classList.contains('field')).slice(0, 44);
  els.forEach((el, i) => el.animate(
    [{ clipPath: 'inset(0 100% 0 0)', filter: 'blur(1.2px)', opacity: .4 }, { clipPath: 'inset(0 0% 0 0)', filter: 'blur(0)', opacity: 1 }],
    { duration: 520, delay: i * 55, easing: 'cubic-bezier(.4, .1, .3, 1)', fill: 'backwards' }));
}
let bookBusy = false;
function setBookSub(id) {
  const key = state.bookTab || 'profile';
  const subs = subsOf(key, active());
  const prev = subs.findIndex(x => x.id === bookSubMap()[key]);
  const next = subs.findIndex(x => x.id === id);
  if (next < 0 || bookBusy) return;
  const changed = (prev < 0 ? 0 : prev) !== next;
  bookSubMap()[key] = id; save();
  const go = () => {
    renderSheet();
    if (changed) writeIn($('bk-right'));
    if (innerWidth < 900) { const r = $('bk-right'); if (r) scrollTo({ top: r.getBoundingClientRect().top + scrollY - 70, behavior: reduceMotion.matches ? 'auto' : 'smooth' }); }
  };
  const old = document.querySelector('#bk-right .bk-body'), oldHead = document.querySelector('#bk-right .bk-head');
  if (!changed || reduceMotion.matches || !old) { go(); return; }
  bookBusy = true;
  const erase = [{ opacity: 1, filter: 'blur(0) contrast(1)' }, { opacity: 0, filter: 'blur(2.5px) contrast(.6)' }];
  oldHead?.animate(erase, { duration: 320, easing: 'ease-in', fill: 'forwards' });
  old.animate(erase, { duration: 320, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { bookBusy = false; go(); }, () => { bookBusy = false; go(); });
  return;
}
function flipLeaves(fromIdx, toIdx, count) {
  const pg = $('bk-right'), pages = pg && pg.parentElement;
  if (!pg || !pages) return;
  const forward = toIdx > fromIdx, n = count || Math.min(6, Math.abs(toIdx - fromIdx) + 2);
  const narrow = innerWidth < 900;
  const vw = innerHeight, r = pg.getBoundingClientRect();
  const top = Math.max(0, -r.top), h = Math.min(r.height - top, vw + 40);
  const wrap = document.createElement('div');
  wrap.className = 'bk-flip';
  Object.assign(wrap.style, { left: pg.offsetLeft + 'px', top: (pg.offsetTop + top) + 'px', width: pg.offsetWidth + 'px', height: Math.max(120, h) + 'px' });
  pages.appendChild(wrap);
  const dur = count === 1 ? 560 : 950, gap = count === 1 ? 85 : 150;
  const anims = [];
  for (let i = 0; i < n; i++) {
    const leaf = document.createElement('i');
    leaf.className = 'leaf' + (i === n - 1 ? ' last' : '');
    wrap.appendChild(leaf);
    const k = narrow
      ? (forward ? [{ transform: 'rotateY(0deg)', filter: 'brightness(1)' }, { transform: 'rotateY(-100deg)', filter: 'brightness(.55)', opacity: 0 }]
                 : [{ transform: 'rotateY(-100deg)', filter: 'brightness(.55)', opacity: 0 }, { transform: 'rotateY(0deg)', filter: 'brightness(1)', opacity: 1 }])
      : (forward ? [{ transform: 'rotateY(0deg)', filter: 'brightness(1)', opacity: 1 }, { transform: 'rotateY(-90deg)', filter: 'brightness(.5)', opacity: 1, offset: .5 }, { transform: 'rotateY(-180deg)', filter: 'brightness(.85)', opacity: 0 }]
                 : [{ transform: 'rotateY(-180deg)', filter: 'brightness(.85)', opacity: 0 }, { transform: 'rotateY(-90deg)', filter: 'brightness(.5)', opacity: 1, offset: .5 }, { transform: 'rotateY(0deg)', filter: 'brightness(1)', opacity: 1 }]);
    anims.push(leaf.animate(k, { duration: dur, delay: i * gap, easing: 'cubic-bezier(.45, .05, .35, 1)', fill: 'both' }));
  }
  pg.querySelector('.bk-head')?.animate([{ opacity: 0 }, { opacity: 0, offset: .55 }, { opacity: 1 }], { duration: dur + n * gap, easing: 'ease-out' });
  pg.querySelector('.bk-body')?.animate([{ opacity: 0, filter: 'blur(3px)' }, { opacity: 0, offset: .55 }, { opacity: 1, filter: 'blur(0)' }], { duration: dur + n * gap + 120, easing: 'ease-out' });
  setTimeout(() => writeIn(pg), Math.max(0, dur + n * gap - 260));
  Promise.all(anims.map(a => a.finished)).then(() => wrap.remove(), () => wrap.remove());
}
function setBookTab(key) {
  if (!SECTIONS.some(x => x.key === key)) key = 'profile';
  const prev = SECTIONS.findIndex(x => x.key === state.bookTab);
  const changed = state.bookTab !== key;
  state.bookTab = key; save();
  renderSheet();
  if (changed && !reduceMotion.matches) flipLeaves(prev < 0 ? 0 : prev, SECTIONS.findIndex(x => x.key === key));
  if (changed && innerWidth < 900) {
    const nav = document.querySelector('.bk-tabs'), top = $('bk-right');
    if (top && nav) scrollTo({ top: top.getBoundingClientRect().top + scrollY - nav.offsetHeight - 4, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    document.querySelector('.bk-tab.on')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
}

function renderSheet() {
  const c = active();
  const book = isBook();
  $('sheet').classList.toggle('is-book', book);
  $('sheet').innerHTML = book ? bookHtml(c) : hubHtml(c);
  if (panelKey && !$('panel-ov').hidden) {
    const body = $('panel-body'), st = body.scrollTop;
    body.innerHTML = sectionBody(panelKey, c);
    body.scrollTop = st;
  }
  updateComputed();
}

/* ---- SAO風メニューウィンドウ ---- */
const ICONS = {
  profile: '<circle cx="10" cy="6.8" r="3.2"/><path d="M3.8 17c1.1-3 3.5-4.6 6.2-4.6s5.1 1.6 6.2 4.6"/>',
  abilities: '<path d="M4 16.5V11M8 16.5V6.5M12 16.5V9M16 16.5V3.5"/>',
  skills: '<circle cx="10" cy="10" r="6.8"/><circle cx="10" cy="10" r="3.4"/><circle cx="10" cy="10" r=".6" style="fill:currentColor"/>',
  weapons: '<path d="M13.6 3.4h3v3L8.2 14.8l-3-3z"/><path d="M5.2 13.2l1.6 1.6M3.4 16.6l2.4-2.4"/>',
  items: '<rect x="3.8" y="7" width="12.4" height="9.8" rx="2"/><path d="M7.2 7V5.6a2.8 2.8 0 0 1 5.6 0V7"/>',
  money: '<circle cx="10" cy="10" r="6.8"/><path d="M10 5.8v8.4M12.4 7.9c-.6-.6-1.4-.9-2.4-.9-1.3 0-2.3.6-2.3 1.5 0 2.1 4.8 1 4.8 3.1 0 .9-1 1.5-2.4 1.5-1 0-1.9-.3-2.5-.9"/>',
  tomes: '<path d="M10 5.6C8.5 4.5 6.5 4.1 3.8 4.2v11c2.7-.1 4.7.3 6.2 1.4 1.5-1.1 3.5-1.5 6.2-1.4v-11c-2.7-.1-4.7.3-6.2 1.4zM10 5.6v11"/>',
  scenarios: '<path d="M5 17.2V3.4M5 4h9.6l-2.2 3.2 2.2 3.2H5"/>',
  story: '<path d="M13.4 3.6l3 3L8 15H5v-3z"/><path d="M11.6 5.4l3 3"/>',
  close: '<path d="M5 5l10 10M15 5L5 15"/>',
};
const icon = k => `<svg class="ico" viewBox="0 0 20 20" aria-hidden="true">${ICONS[k]}</svg>`;

function setPanelHead(key) {
  const s = SECTIONS.find(x => x.key === key);
  $('panel').style.setProperty('--pc', s.color);
  $('panel-en').textContent = s.en;
  $('panel-title').textContent = s.jp;
  $('sao-hic').innerHTML = icon(key);
  document.querySelectorAll('.sao-item').forEach(el => {
    const on = el.dataset.goto === key;
    el.classList.toggle('on', on); el.setAttribute('aria-current', on ? 'true' : 'false');
  });
  scrollMenu();
}
function scrollMenu(instant) {
  const m = $('sao-menu'), cur = m.querySelector('.sao-item.on');
  if (cur && m.scrollWidth > m.clientWidth) m.scrollTo({ left: cur.offsetLeft - (m.clientWidth - cur.offsetWidth) / 2, behavior: instant || reduceMotion.matches ? 'auto' : 'smooth' });
}
function fillPanel(key) {
  panelKey = key; setPanelHead(key);
  const body = $('panel-body');
  body.innerHTML = sectionBody(key, active());
  body.scrollTop = 0;
  updateComputed();
}
/* 項目が左からスッと並ぶ */
function stagger(delay = 0) {
  if (reduceMotion.matches) return [];
  const els = [...$('panel-body').querySelectorAll('.sec-title, .points, .fields > .field, .derived > .dv, .sub-title, .tbl thead tr, .tbl tbody tr, .sec > textarea, .empty')].slice(0, 56);
  return els.map((el, i) => el.animate(
    [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'translateX(0)' }],
    { duration: 340, delay: delay + i * 16, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' }));
}
function openPanel(key, fromEl) {
  if (isBook()) { setBookTab(key); return; }
  const ov = $('panel-ov');
  fillPanel(key);
  ov.hidden = false;
  scrollMenu(true);
  if (!reduceMotion.matches) {
    ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
    $('sao-win').animate([
      { clipPath: 'inset(49.6% 50% 49.6% 50% round 16px)' },
      { clipPath: 'inset(49.6% 0% 49.6% 0% round 16px)', offset: .42 },
      { clipPath: 'inset(0% 0% 0% 0% round 16px)' },
    ], { duration: 680, easing: 'cubic-bezier(.65, 0, .25, 1)' });
    $('sao-line').animate([
      { transform: 'scaleX(0)', opacity: 1 },
      { transform: 'scaleX(1)', opacity: 1, offset: .42 },
      { transform: 'scaleX(1)', opacity: 0 },
    ], { duration: 680, easing: 'cubic-bezier(.65, 0, .25, 1)' });
    document.querySelectorAll('.sao-item').forEach((el, i) => el.animate(
      [{ opacity: 0, transform: 'translateY(-16px) scale(.85)' }, { opacity: 1 }],
      { duration: 380, delay: 80 + i * 45, easing: 'cubic-bezier(.2, .9, .3, 1.25)', fill: 'backwards' }));
    stagger(420);
  }
  $('panel-title').focus({ preventScroll: true });
}
function closePanel() {
  const ov = $('panel-ov'); if (ov.hidden) return;
  const target = document.querySelector(`#sheet .bubble[data-open="${panelKey}"]`) || document.querySelector('#sheet .hub-core');
  const done = anims => {
    ov.hidden = true; panelKey = null;
    anims.forEach(a => a.cancel());
    if (target) {
      target.focus({ preventScroll: true });
      if (!reduceMotion.matches) { target.classList.remove('land'); void target.offsetWidth; target.classList.add('land'); fxAt(target, false); }
    }
  };
  if (reduceMotion.matches) return done([]);
  const ease = 'cubic-bezier(.6, 0, .4, 1)';
  const items = [...document.querySelectorAll('.sao-item')];
  const anims = [
    $('sao-win').animate([
      { clipPath: 'inset(0% 0% 0% 0% round 16px)' },
      { clipPath: 'inset(49.6% 0% 49.6% 0% round 16px)', offset: .55 },
      { clipPath: 'inset(49.6% 50% 49.6% 50% round 16px)' },
    ], { duration: 480, easing: ease, fill: 'forwards' }),
    $('sao-line').animate([
      { transform: 'scaleX(1)', opacity: 0 },
      { transform: 'scaleX(1)', opacity: 1, offset: .5 },
      { transform: 'scaleX(0)', opacity: 1 },
    ], { duration: 480, easing: ease, fill: 'forwards' }),
    ...items.map((el, i) => el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-12px) scale(.85)' }],
      { duration: 220, delay: (items.length - i) * 22, easing: 'ease-in', fill: 'forwards' })),
    ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, delay: 260, fill: 'forwards' }),
  ];
  Promise.all(anims.map(a => a.finished)).then(() => done(anims));
}
function gotoPanel(key) {
  if (key === panelKey) return;
  fillPanel(key);
  if (!reduceMotion.matches) {
    $('sao-line').animate([{ transform: 'scaleX(0)', opacity: 1 }, { transform: 'scaleX(1)', opacity: 0 }], { duration: 420, easing: 'ease-out' });
    stagger(40);
  }
}

function updateComputed() {
  const c = active(), d = compute(c), a = d.a;
  const o = {
    hpMax: d.hpMax, mpMax: d.mpMax, sanMax: d.sanMax, sanStart: d.sanStart, indef: d.indef,
    idea: d.idea, luck: d.luck, know: d.know, db: d.db, build: d.build, mov: d.mov,
    jobPt: d.jobPt, hobbyPt: d.hobbyPt, jobLeft: d.jobPt - d.jobUsed, hobbyLeft: d.hobbyPt - d.hobbyUsed,
    hpCur: `${d.hp}/${d.hpMax}`, mpCur: `${d.mp}/${d.mpMax}`, sanCur: `${d.san}/${d.sanMax}`,
  };
  Object.entries(a).forEach(([k, v]) => {
    o['ab-' + k] = v; o['ab-' + k + '-x5'] = v * 5;
    o['ab-' + k + '-h'] = Math.floor(v / 2); o['ab-' + k + '-f'] = Math.floor(v / 5);
  });
  c.skills.forEach((s, i) => {
    const t = skillTotal(s, a), init = skillInit(s, a);
    o['sk-i-' + i] = init;
    o['sk-t-' + i] = c.system === 'coc7' ? `${t}<small>${Math.floor(t / 2)}/${Math.floor(t / 5)}</small>` : t;
    const row = document.querySelector(`tr[data-row="${i}"]`);
    if (row) { row.classList.toggle('changed', t !== init); row.classList.toggle('is-job', !!s.isJob); }
  });
  document.querySelectorAll('[data-out]').forEach(el => {
    const v = o[el.dataset.out];
    if (String(v).includes('<small>')) el.innerHTML = v; else el.textContent = v ?? '';
  });
  document.querySelectorAll('[data-ph]').forEach(el => { el.placeholder = o[el.dataset.ph]; });
  document.querySelectorAll('[data-pt]').forEach(el => el.classList.toggle('over', o[el.dataset.pt + 'Left'] < 0));
  document.querySelectorAll('[data-sum]').forEach(el => { el.textContent = sumText(c, d, el.dataset.sum); });
  const hn = document.querySelector('[data-hub="name"]'); if (hn) hn.textContent = c.profile.name || '名無し';
  const hk = document.querySelector('[data-hub="kana"]'); if (hk) hk.textContent = c.profile.kana;
  updateCharts(c, a);
  document.querySelectorAll('[data-bar]').forEach(el => { const k = el.dataset.bar, v = d[k], m = d[k + 'Max']; el.style.width = (m > 0 ? Math.max(0, Math.min(100, v / m * 100)) : 0) + '%'; });
  const hs = document.querySelector('[data-hub="sub"]');
  if (hs) hs.textContent = [c.profile.occupation, c.profile.age && c.profile.age + '歳', c.profile.birthday && '誕生日 ' + c.profile.birthday, c.profile.sex].filter(Boolean).join(' / ') || 'プロフィール未記入';
}

const RING_C = 2 * Math.PI * 34;
const RING_TONE = { HP: ['g-hp', 'var(--hp)'], MP: ['g-mp', 'var(--mp)'], SAN: ['g-san', 'var(--san)'], '幸運': ['g-luck', 'var(--orange)'] };
let ringKey = '', ringPrev = {}, headHtml = '';
function ringHtml(s) {
  const [g, col] = RING_TONE[s.label] || ['g-mp', 'var(--cyan)'];
  return `<div class="ring-g" data-ring="${esc(s.label)}">
    <svg viewBox="0 0 84 84" role="img">
      <circle class="halo" cx="42" cy="42" r="27" style="--glow:${col}"/>
      <circle class="trk" cx="42" cy="42" r="34"/>
      <circle class="val" cx="42" cy="42" r="34" transform="rotate(-90 42 42)" stroke="url(#${g})" stroke-dasharray="${RING_C.toFixed(2)}" style="stroke-dashoffset:${RING_C.toFixed(2)};--glow:${col}"/>
      <text class="num-big" x="42" y="39"></text><text class="num-sm" x="42" y="56"></text>
    </svg>
    <span class="rl" style="color:${col}">${esc(s.label)}</span>
  </div>`;
}
function renderOutput() {
  const c = active(), json = toCcfolia(c), d = json.data;
  const h = `${tokenHtml(c)}<div style="min-width:0"><div class="koma-name">${esc(d.name)}</div><div class="koma-sub">イニシアティブ ${esc(d.initiative)}（DEX）</div></div>`;
  if (h !== headHtml) { $('koma-head').innerHTML = h; headHtml = h; }
  const rings = $('koma-rings');
  const key = c.id + '|' + d.status.map(s => s.label).join(',');
  if (key !== ringKey) { rings.innerHTML = d.status.map(ringHtml).join(''); ringKey = key; ringPrev = {}; }
  d.status.forEach(s => {
    const g = [...rings.children].find(el => el.dataset.ring === s.label); if (!g) return;
    const pct = s.max > 0 ? Math.max(0, Math.min(1, s.value / s.max)) : 0;
    const v = g.querySelector('.val');
    requestAnimationFrame(() => requestAnimationFrame(() => { v.style.strokeDashoffset = (RING_C * (1 - pct)).toFixed(2); }));
    g.querySelector('.num-big').textContent = s.value;
    g.querySelector('.num-sm').textContent = '/ ' + s.max;
    g.querySelector('svg').setAttribute('aria-label', `${s.label} ${s.value} / ${s.max}`);
    const sig = s.value + '/' + s.max;
    if (ringPrev[s.label] !== undefined && ringPrev[s.label] !== sig) { g.classList.remove('pulse'); void g.offsetWidth; g.classList.add('pulse'); }
    ringPrev[s.label] = sig;
  });
  $('koma-chips').innerHTML = d.params.map(p => `<span class="chip"><b>${esc(p.label)}</b>${esc(p.value)}</span>`).join('');
  $('palette-out').textContent = d.commands;
  $('palette-count').textContent = d.commands.split('\n').length + '行';
  $('json-out').textContent = JSON.stringify(json, null, 2);
  $('opt-all').checked = !!state.paletteAll;
  $('orbit-core').textContent = initial(c);
  const st = d.status.map(x => `<i>${esc(x.label)}</i>${x.value}/${x.max}`).join(' ');
  const mh = `${tokenHtml(c)}<div class="mbar-nums"><b>${esc(d.name)}</b><span>${st}</span></div>`;
  if ($('mbar-stats').dataset.h !== mh) { $('mbar-stats').innerHTML = mh; $('mbar-stats').dataset.h = mh; }
}
