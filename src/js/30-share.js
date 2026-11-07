/* ================= キャラシをリンクで共有する ================= */
/* 持ち主：ログインしてクラウドに保存されたキャラに「共有リンク」を作る（サーバーの char_shares。supabase/10-share.sql）。
   見る人：リンク（…/?share=合言葉）を開くと、ログインしていなくても読み取り専用で見られる。自分の探索者として取り込むこともできる。
   リンク先はいつも公開サイト（1ファイル版や Claude の公開版から作っても、送った相手が開けるように）。 */
const SHARE_BASE = 'https://kanno-925.github.io/charasheet/';
const shareUrl = token => SHARE_BASE + '?share=' + token;
let shares = null, shareErr = '', shareFor = null, shareBusy = false;   // shares：キャラID → 合言葉（読み込む前は null）

async function loadShares() {
  if (!sb || !me) return;
  const { data, error } = await sb.from('char_shares').select('char_id,token').eq('owner', me.id);
  if (error) {
    shares = {};
    shareErr = /char_shares|relation .* does not exist|Could not find the table/i.test(error.message || '') ? 'サーバーの準備がまだです。Supabase で supabase/10-share.sql を実行してください。' : jaErr(error);
    return;
  }
  shareErr = '';
  shares = {};
  (data || []).forEach(r => { shares[r.char_id] = r.token; });
}
/* 共有リンクを作る前に、そのキャラがクラウドに保存されているか確かめる（まだなら今すぐ送る） */
async function ensureSynced(id) {
  for (let i = 0; i < 40 && !lastSynced.has(id); i++) {
    if (!syncing) { clearTimeout(syncTimer); await flushSync(); }
    else await new Promise(r => setTimeout(r, 250));
    if (syncState === 'error') break;
  }
  return lastSynced.has(id);
}

function openShare(c) {
  if (!c) return;
  if (c.sample) { toast('見本の探索者は共有できません。少し書きかえるか、新しい探索者を作ってから共有してください。'); return; }
  shareFor = c.id;
  $('share-status').textContent = '';
  renderShare();
  openModal('modal-share');
  if (me && shares === null) loadShares().then(renderShare).catch(() => {});
}
function renderShare() {
  const body = $('share-body'), c = state.chars.find(x => x.id === shareFor);
  if (!c) { body.innerHTML = '<p class="empty">探索者が見つかりません。</p>'; return; }
  const name = esc(c.profile.name || '名無し');
  if (!cloudReady()) { body.innerHTML = '<p class="err">いまは共有を使えません。ネットにつながっているか確かめて、ページを読み込み直してください。</p>'; return; }
  if (!me) {
    body.innerHTML = `<p>「${name}」を共有するには、ログインが必要です（キャラシをサーバーに保存して、そこからリンクで見せるため）。</p>
      <p class="share-note">見る人はログインしなくても大丈夫です。</p>
      <div class="modal-actions"><button class="btn primary" type="button" data-share="login">ログイン・新規登録</button></div>`;
    return;
  }
  if (c.owner && c.owner !== me.id) { body.innerHTML = '<p>この探索者はあなたのものではないので、共有できません。</p>'; return; }
  if (shares === null) { body.innerHTML = '<p class="empty">読み込み中…</p>'; return; }
  if (shareErr) { body.innerHTML = `<p class="err">${esc(shareErr)}</p>`; return; }
  const token = shares[c.id];
  if (!token) {
    body.innerHTML = `<p>「${name}」の<b>共有リンク</b>を作ります。リンクを知っている人は、ログインしていなくてもこのキャラシを見られます（書きかえはできません）。</p>
      <ul class="share-list">
        <li>見た人は、ココフォリア用にコピーしたり、自分の探索者として取り込んだりできます。</li>
        <li>あとでキャラシを書きかえると、リンク先にも反映されます。</li>
        <li>「共有をやめる」を押せば、リンクはすぐに使えなくなります。</li>
        <li>フレンドへの公開・非公開（鍵のボタン）とは別の設定です。</li>
      </ul>
      <div class="modal-actions"><button class="btn primary" type="button" data-share="make" ${shareBusy ? 'disabled' : ''}>${shareBusy ? '作成中…' : '共有リンクを作る'}</button></div>`;
    return;
  }
  const url = shareUrl(token);
  body.innerHTML = `<p>「${name}」の共有リンクです。コピーして、見せたい人に送ってください。</p>
    <div class="share-url"><input class="inp" id="share-url" readonly value="${esc(url)}" aria-label="共有リンク"><button class="btn primary" type="button" data-share="copy">コピー</button></div>
    <p class="share-note">リンクを知っている人は誰でも見られます。キャラシを書きかえると、リンク先にも反映されます。</p>
    <div class="share-row">
      ${navigator.share ? '<button class="btn small" type="button" data-share="send">ほかのアプリで送る</button>' : ''}
      <a class="btn small" href="${esc(url)}" target="_blank" rel="noopener">リンク先を開いて確かめる</a>
      <button class="btn small danger" type="button" data-share="stop" ${shareBusy ? 'disabled' : ''}>共有をやめる</button>
    </div>`;
}
$('share-body').addEventListener('click', async e => {
  const b = e.target.closest('[data-share]'); if (!b) return;
  const c = state.chars.find(x => x.id === shareFor); if (!c) return;
  const act = b.dataset.share;
  if (act === 'login') { closeModals(); openAccount(); return; }
  if (act === 'copy') { copyText($('share-url').value, $('share-status'), $('share-url'), 'コピーしました。見せたい人に送ってください。').then(ok => { if (ok) fxAt(b, true); }); return; }
  if (act === 'send') { navigator.share({ title: `${c.profile.name || '探索者'}のキャラシ（ORBiS）`, url: $('share-url').value }).catch(() => {}); return; }
  if (shareBusy) return;
  $('share-status').classList.remove('warn');
  if (act === 'make') {
    shareBusy = true; renderShare();
    try {
      if (!(await ensureSynced(c.id))) throw new Error(syncMsg || 'キャラシをサーバーに保存できませんでした。少し待ってからもう一度押してください。');
      const { data, error } = await sb.from('char_shares').insert({ char_id: c.id }).select('token').single();
      if (error) {
        if (/duplicate key|23505/i.test(error.message || '')) await loadShares();   // ほかの端末ですでに作っていた
        else throw error;
      } else shares[c.id] = data.token;
      shareErr = '';
      $('share-status').textContent = 'リンクを作りました。コピーして送ってください。';
    } catch (er) {
      $('share-status').classList.add('warn');
      $('share-status').textContent = /char_shares|relation .* does not exist|Could not find the table/i.test(er.message || '') ? 'サーバーの準備がまだです。Supabase で supabase/10-share.sql を実行してください。' : jaErr(er);
    } finally { shareBusy = false; renderShare(); }
    return;
  }
  if (act === 'stop') {
    if (!arm(b, 'もう一度押すとやめる')) return;
    shareBusy = true; renderShare();
    try {
      const { error } = await sb.from('char_shares').delete().eq('char_id', c.id);
      if (error) throw error;
      delete shares[c.id];
      $('share-status').textContent = '共有をやめました。前のリンクはもう開けません。';
    } catch (er) { $('share-status').classList.add('warn'); $('share-status').textContent = jaErr(er); }
    finally { shareBusy = false; renderShare(); }
  }
});

/* ---- 共有リンクを開いた人：読み取り専用で見せる ---- */
const sharedToken = (() => { try { const t = new URLSearchParams(location.search).get('share') || ''; return /^[0-9a-f]{32}$/.test(t) ? t : ''; } catch (e) { return ''; } })();
let sharedOwner = '';
async function openSharedView(token) {
  fviewChars = []; fviewCur = null;
  $('fview-title').textContent = '共有されたキャラシ';
  $('fview-body').innerHTML = '<p class="empty">読み込み中…</p>';
  openModal('modal-fview');
  // 一度見たらアドレスから合言葉を外す（読み込み直すたびに出てこないように）
  try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* */ }
  if (!sbClient()) { $('fview-body').innerHTML = '<p class="err">サーバーにつながりませんでした。ネットの接続を確かめて、リンクを開き直してください。</p>'; return; }
  try {
    const { data, error } = await sb.rpc('get_shared_char', { t: token });
    if (error) throw error;
    const c = data && data.data;
    if (!c || c.v !== 2 || !SYS[c.system] || !c.profile) {
      $('fview-body').innerHTML = '<p class="empty">このリンクのキャラシは見つかりませんでした。共有がやめられたか、探索者が削除されたのかもしれません。送ってくれた人に確かめてください。</p>';
      return;
    }
    sharedOwner = data.owner || '';
    fviewCur = c;
    $('fview-title').innerHTML = `<span class="share-from">${sharedOwner ? esc(sharedOwner) + 'さんが共有' : '共有されたキャラシ'}</span> ${esc(c.profile.name || '名無し')}`;
    $('fview-body').innerHTML = sheetViewHtml(c, true);
    $('fview-body').scrollTop = 0;
  } catch (er) { $('fview-body').innerHTML = `<p class="err">${esc(jaErr(er))}</p>`; }
}
/* 共有されたキャラを、自分の探索者として写す（持ち主だけのもの：フレンドの印・BGMファイル・ダイスの回数・鍵は外す） */
function takeShared(btn) {
  const src = fviewCur; if (!src || !canAddChar()) return;
  const c = JSON.parse(JSON.stringify(src));
  c.id = uid(); c.updatedAt = Date.now();
  delete c.sample; delete c.owner; c.locked = false;
  if (c.bgm && c.bgm.src === 'idb') delete c.bgm;
  if (c.dice) c.dice.used = 0;
  (c.scenarios || []).forEach(sc => { sc.friends = []; });
  state.chars = [c, ...state.chars.filter(x => !x.sample)]; state.activeId = c.id;
  save(); fxAt(btn, true); closeModals(); renderAll();
  if (!$('select').hidden) leaveSelect(null, true);
  toast(`「${c.profile.name || '名無し'}」をあなたの探索者に取り込みました。自由に書きかえられます（元のキャラシは変わりません）。`);
}
