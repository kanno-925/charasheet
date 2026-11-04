/* ================= いあきゃら・ココフォリア・テキストからの取り込み ================= */
const ABIL_KEYS = ['STR', 'CON', 'POW', 'DEX', 'APP', 'SIZ', 'INT', 'EDU'];
const SKIP_SKILL = /^(SANチェック|SAN値チェック|正気度ロール|正気度チェック|SAN|アイデア|幸運|知識|.*ダメージ.*|(STR|CON|POW|DEX|APP|SIZ|INT|EDU)([×x*✕]\d*)?)$/i;
const normName = t => String(t || '').replace(/\(/g, '（').replace(/\)/g, '）').replace(/[\s　]+/g, '').trim();
const toHalf = t => String(t || '').replace(/[０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));

function pickField(text, keys) {
  for (const k of keys) {
    const m = text.match(new RegExp(`(?:^|[\\s/／|｜、,【\\[])${k}\\s*[:：]\\s*([^\\n/／|｜,、】\\]]+)`));
    if (m && m[1].trim()) return m[1].split(/[\s　]+[^\s　:：]{1,8}[:：]/)[0].trim();
  }
  return '';
}
function parseProfile(text) {
  return {
    occupation: pickField(text, ['職業']),
    age: pickField(text, ['年齢']).replace(/歳$/, ''),
    birthday: pickField(text, ['誕生日', '生年月日']),
    sex: pickField(text, ['性別']),
    height: pickField(text, ['身長']),
    weight: pickField(text, ['体重']),
    origin: pickField(text, ['出身地', '出身']),
    hair: pickField(text, ['髪の色', '髪色', '髪']),
    eyes: pickField(text, ['瞳の色', '目の色', '瞳色', '瞳']),
    skin: pickField(text, ['肌の色', '肌色', '肌']),
  };
}
function parseSkillLines(text) {
  const out = [];
  const t = toHalf(text);
  const re1 = /(?:CCB?|CC\(-?\d+\)|1D100|1d100)\s*<=\s*(\d+)\s*(?:[【\[「『〈《]([^】\]」』〉》\n]+)[】\]」』〉》]|[ \t]+([^\s【\[]+))/gi;
  for (const m of t.matchAll(re1)) out.push({ name: (m[2] || m[3] || '').trim(), value: +m[1] });
  const re2 = /[《〈]([^》〉\n]+)[》〉]\s*(\d+)\s*[%％]?/g;
  for (const m of t.matchAll(re2)) out.push({ name: m[1].trim(), value: +m[2] });
  return out;
}
function detectSystem(text, params) {
  if (/CCB\s*<=/i.test(text)) return 'coc6';
  if (/\bCC(\(-?\d+\))?\s*<=/i.test(text)) return 'coc7';
  return (params.STR != null && params.STR > 20) || (params.EDU != null && params.EDU > 25) ? 'coc7' : 'coc6';
}

function buildImported(src) {
  const sys = src.system || detectSystem(src.allText || '', src.params);
  const c = blank(sys);
  Object.assign(c.profile, Object.fromEntries(Object.entries(src.profile || {}).filter(([, v]) => v)));
  if (src.name) c.profile.name = src.name;
  if (src.kana) c.profile.kana = src.kana;
  if (src.color && /^#[0-9a-f]{6}$/i.test(src.color)) c.profile.color = src.color;
  if (src.iconUrl) c.profile.iconUrl = src.iconUrl;
  if (src.externalUrl) c.profile.externalUrl = src.externalUrl;
  ABIL_KEYS.forEach(k => { if (src.params[k] != null) c.abilities[k].base = String(src.params[k]); });
  if (sys === 'coc7' && src.luck != null) c.abilities.LUCK.base = String(src.luck);
  const st = src.status || {};
  if (st.HP != null) c.hp = String(st.HP);
  if (st.MP != null) c.mp = String(st.MP);
  if (st.SAN != null) c.san = String(st.SAN);
  const a = abilities(c);
  let matched = 0, added = 0;
  const seen = new Set();
  (src.skills || []).forEach(({ name, value }) => {
    const n = normName(name);
    if (!n || SKIP_SKILL.test(n) || seen.has(n) || !isFinite(value)) return;
    seen.add(n);
    let t = c.skills.find(s => normName(skillLabel(s)) === n);
    if (!t) {
      const m = n.match(/^(.+?)（(.+)）$/);
      const base = m && c.skills.find(s => s.hasSub && normName(s.name) === m[1]);
      if (base) {
        if (!base.sub) { base.sub = m[2]; t = base; }
        else { t = { ...base, sub: m[2], job: '', hobby: '', grow: '', other: '', isJob: false, dup: true }; c.skills.splice(c.skills.indexOf(base) + 1, 0, t); }
      }
    }
    if (!t) t = c.skills.find(s => !s.hasSub && normName(s.name).replace(/（.*）$/, '') === n);
    if (t) {
      const diff = value - skillInit(t, a);
      t.other = diff ? String(diff) : '';
      matched++;
    } else {
      c.skills.push({ cat: 'k', name: String(name).trim(), hasSub: false, sub: '', init: String(value), job: '', hobby: '', grow: '', other: '', isJob: false, custom: true });
      added++;
    }
  });
  c.memo = src.memo || '';
  c.extra = src.extra || '';
  c.importInfo = { matched, added };
  return c;
}

/* ココフォリアのコマデータ（いあきゃらの「ココフォリア」出力もこの形） */
function fromCcfolia(obj) {
  const d = obj.data || {};
  const params = {}, status = {};
  (d.params || []).forEach(p => { const k = String(p.label || '').toUpperCase(); const v = Number(toHalf(p.value)); if (ABIL_KEYS.includes(k) && isFinite(v)) params[k] = v; });
  let luck = null;
  (d.status || []).forEach(x => {
    const l = String(x.label || '').toUpperCase();
    const v = Number(x.value);
    if (!isFinite(v)) return;
    if (l === 'HP' || l === '耐久力') status.HP = v;
    else if (l === 'MP' || l === 'マジックポイント') status.MP = v;
    else if (l === 'SAN' || l === '正気度') status.SAN = v;
    else if (l === '幸運' || l === 'LUCK' || l === 'LUC') luck = v;
  });
  const commands = String(d.commands || '');
  const memo = String(d.memo || '');
  const extra = commands.split('\n').map(x => x.trim()).filter(x => x && !/<=/.test(x) && !/^[\/／]/.test(x)).join('\n');
  const kana = (memo.match(/^[\s]*([ぁ-んァ-ヶー・\s]+)\s*$/m) || [])[1] || pickField(memo, ['読み', 'ふりがな', 'フリガナ']);
  return buildImported({
    name: d.name || '', kana: kana.trim(), color: d.color, iconUrl: d.iconUrl || '', externalUrl: d.externalUrl || '',
    params, status, luck, skills: parseSkillLines(commands), profile: parseProfile(memo),
    memo, extra, allText: commands + '\n' + d.params?.map(p => `${p.label} ${p.value}`).join('\n'),
  });
}

/* テキスト（いあきゃらのテキスト出力・チャットパレット・キャラクター保管所形式など） */
function fromText(text) {
  const t = toHalf(text);
  const params = {};
  ABIL_KEYS.forEach(k => { const m = t.match(new RegExp(`(?:^|[^A-Z])${k}\\s*[:：=]?\\s*(\\d+)`, 'i')); if (m) params[k] = +m[1]; });
  const num = re => { const m = t.match(re); return m ? +m[1] : null; };
  const status = { HP: num(/(?:HP|耐久力)\s*[:：=]?\s*(\d+)/i), MP: num(/(?:MP|マジック・?ポイント)\s*[:：=]?\s*(\d+)/i), SAN: num(/(?:現在SAN|SAN値?|正気度)\s*[:：=]?\s*(\d+)/i) };
  Object.keys(status).forEach(k => { if (status[k] == null) delete status[k]; });
  const name = pickField(t, ['キャラクター名', '探索者名', 'PC名', '名前']);
  const skills = parseSkillLines(t);
  const extra = t.split('\n').map(x => x.trim()).filter(x => /^\d*[dD]\d+/.test(x) && !/<=/.test(x)).join('\n');
  if (!name && !Object.keys(params).length && !skills.length) return null;
  return buildImported({
    name, kana: pickField(t, ['ふりがな', 'フリガナ', '読み']), params, status, luck: num(/幸運\s*[:：=]?\s*(\d+)/), skills,
    profile: parseProfile(t), memo: '', extra, allText: t,
  });
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); if (Array.isArray(s.chars)) state = Object.assign(state, s); }
    else {
      const old = localStorage.getItem(KEY_V1);
      if (old) { const s = JSON.parse(old); if (Array.isArray(s.chars)) state.chars = s.chars.filter(x => !x.sample).map(migrateV1); }
    }
  } catch (e) { /* storage unavailable */ }
  if (!state.chars.length) state.chars = [sample()];
  if (!state.chars.some(c => c.id === state.activeId)) state.activeId = state.chars[0].id;
}
let saveTimer;
function saveNow() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { if (e && e.name === 'QuotaExceededError') toast('保存容量がいっぱいです。立ち絵を小さい画像に変えるか、使っていない探索者を削除してください。'); }
}
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 250); scheduleSync(); }
addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });
const active = () => state.chars.find(c => c.id === state.activeId);
