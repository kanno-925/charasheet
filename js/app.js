(() => {
'use strict';

/* ================= ルールデータ ================= */
const CATS = [['b', '戦闘技能'], ['s', '探索技能'], ['a', '行動技能'], ['n', '交渉技能'], ['k', '知識技能']];

const DB6 = s => s <= 12 ? '-1D6' : s <= 16 ? '-1D4' : s <= 24 ? '0' : s <= 32 ? '+1D4' : s <= 40 ? '+1D6'
  : '+' + (2 + Math.floor((s - 41) / 16)) + 'D6';
const DB7 = s => s <= 64 ? ['-2', -2] : s <= 84 ? ['-1', -1] : s <= 124 ? ['0', 0] : s <= 164 ? ['+1D4', 1]
  : s <= 204 ? ['+1D6', 2] : [`+${2 + Math.floor((s - 205) / 80)}D6`, 3 + Math.floor((s - 205) / 80)];

const SYS = {
  coc6: {
    label: 'クトゥルフ神話TRPG（6版）', short: 'CoC 6版', cmd: 'CCB',
    abil: [['STR', '3D6', '3d6'], ['CON', '3D6', '3d6'], ['POW', '3D6', '3d6'], ['DEX', '3D6', '3d6'], ['APP', '3D6', '3d6'], ['SIZ', '2D6+6', '2d6+6'], ['INT', '2D6+6', '2d6+6'], ['EDU', '3D6+3', '3d6+3']],
    skills: [
      ['b', '回避', 'DEX*2'], ['b', 'キック', 25], ['b', '組み付き', 25], ['b', 'こぶし（パンチ）', 50], ['b', '頭突き', 10], ['b', '投擲', 25], ['b', 'マーシャルアーツ', 1], ['b', '拳銃', 20], ['b', 'サブマシンガン', 15], ['b', 'ショットガン', 30], ['b', 'マシンガン', 15], ['b', 'ライフル', 25],
      ['s', '応急手当', 30], ['s', '鍵開け', 1], ['s', '隠す', 15], ['s', '隠れる', 10], ['s', '聞き耳', 25], ['s', '忍び歩き', 10], ['s', '写真術', 10], ['s', '精神分析', 1], ['s', '追跡', 10], ['s', '登攀', 40], ['s', '図書館', 25], ['s', '目星', 25],
      ['a', '運転（）', 20], ['a', '機械修理', 20], ['a', '重機械操作', 1], ['a', '乗馬', 5], ['a', '水泳', 25], ['a', '製作（）', 5], ['a', '操縦（）', 1], ['a', '跳躍', 25], ['a', '電気修理', 10], ['a', 'ナビゲート', 10], ['a', '変装', 1],
      ['n', '言いくるめ', 5], ['n', '信用', 15], ['n', '説得', 15], ['n', '値切り', 5], ['n', '母国語（）', 'EDU*5'], ['n', 'ほかの言語（）', 1],
      ['k', '医学', 5], ['k', 'オカルト', 5], ['k', '化学', 1], ['k', 'クトゥルフ神話', 0], ['k', '芸術（）', 5], ['k', '経理', 10], ['k', '考古学', 1], ['k', 'コンピューター', 1], ['k', '心理学', 5], ['k', '人類学', 1], ['k', '生物学', 1], ['k', '地質学', 1], ['k', '電子工学', 1], ['k', '天文学', 1], ['k', '博物学', 10], ['k', '物理学', 1], ['k', '法律', 5], ['k', '薬学', 1], ['k', '歴史', 20],
    ],
    weapons: [{ name: 'こぶし（パンチ）', rate: '50', damage: '1D3+DB', range: 'タッチ', attacks: '1', ammo: '', durability: '', note: '' }],
    derive(a, mythos) {
      return {
        hpMax: Math.ceil((a.CON + a.SIZ) / 2), mpMax: a.POW, sanStart: a.POW * 5, sanMax: 99 - mythos,
        idea: a.INT * 5, luck: a.POW * 5, know: Math.min(99, a.EDU * 5), db: DB6(a.STR + a.SIZ),
        jobPt: a.EDU * 20, hobbyPt: a.INT * 10,
      };
    },
  },
  coc7: {
    label: 'クトゥルフ神話TRPG（7版）', short: 'CoC 7版', cmd: 'CC',
    abil: [['STR', '3D6×5', '3d6*5'], ['CON', '3D6×5', '3d6*5'], ['POW', '3D6×5', '3d6*5'], ['DEX', '3D6×5', '3d6*5'], ['APP', '3D6×5', '3d6*5'], ['SIZ', '(2D6+6)×5', '(2d6+6)*5'], ['INT', '(2D6+6)×5', '(2d6+6)*5'], ['EDU', '(2D6+6)×5', '(2d6+6)*5'], ['LUCK', '3D6×5', '3d6*5', '幸運']],
    skills: [
      ['b', '回避', 'DEX/2'], ['b', '近接戦闘（格闘）', 25], ['b', '射撃（拳銃）', 20], ['b', '射撃（ライフル／ショットガン）', 25], ['b', '投擲', 20],
      ['s', '鑑定', 5], ['s', '応急手当', 30], ['s', '鍵開け', 1], ['s', '聞き耳', 20], ['s', '隠密', 20], ['s', '手さばき', 10], ['s', '精神分析', 1], ['s', '追跡', 10], ['s', '図書館', 20], ['s', '目星', 25],
      ['a', '運転（自動車）', 20], ['a', '機械修理', 10], ['a', '重機械操作', 1], ['a', '乗馬', 5], ['a', '水泳', 20], ['a', '跳躍', 20], ['a', '登攀', 20], ['a', '電気修理', 10], ['a', 'ナビゲート', 10], ['a', '操縦（）', 1], ['a', '変装', 5], ['a', 'サバイバル（）', 10], ['a', '芸術／製作（）', 5],
      ['n', '威圧', 15], ['n', '言いくるめ', 5], ['n', '魅惑', 15], ['n', '説得', 10], ['n', '信用', 0], ['n', '母国語（）', 'EDU'], ['n', 'ほかの言語（）', 1],
      ['k', '医学', 1], ['k', 'オカルト', 5], ['k', '経理', 5], ['k', '考古学', 1], ['k', 'コンピューター', 5], ['k', '科学（）', 1], ['k', '心理学', 10], ['k', '人類学', 1], ['k', '自然', 10], ['k', '電子工学', 1], ['k', '法律', 5], ['k', '歴史', 5], ['k', 'クトゥルフ神話', 0],
    ],
    weapons: [{ name: '素手', rate: '25', damage: '1D3+DB', range: '—', attacks: '1', ammo: '', durability: '', note: '' }],
    jobFormulas: { EDU4: 'EDU×4', EDU2STR2: 'EDU×2＋STR×2', EDU2DEX2: 'EDU×2＋DEX×2', EDU2POW2: 'EDU×2＋POW×2', EDU2APP2: 'EDU×2＋APP×2', EDU2CON2: 'EDU×2＋CON×2', EDU2SIZ2: 'EDU×2＋SIZ×2' },
    derive(a, mythos, c) {
      const [db, build] = DB7(a.STR + a.SIZ);
      const mov = (a.DEX < a.SIZ && a.STR < a.SIZ) ? 7 : (a.DEX > a.SIZ && a.STR > a.SIZ) ? 9 : 8;
      const f = c.jobFormula || 'EDU4';
      const jobPt = f === 'EDU4' ? a.EDU * 4 : a.EDU * 2 + (a[f.slice(4, 7)] || 0) * 2;
      return {
        hpMax: Math.floor((a.CON + a.SIZ) / 10), mpMax: Math.floor(a.POW / 5), sanStart: a.POW, sanMax: 99 - mythos,
        idea: a.INT, luck: a.LUCK, know: a.EDU, db, build, mov, jobPt, hobbyPt: a.INT * 2,
      };
    },
  },
};
const ALWAYS = ['回避', '目星', '聞き耳', '図書館', '応急手当', '心理学'];

/* ================= ユーティリティ ================= */
const KEY = 'charasheet-kobo.v2';
const KEY_V1 = 'charasheet-kobo.v1';
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = id => document.getElementById(id);
const num = v => { const n = Number(String(v ?? '').trim()); return isFinite(n) ? n : 0; };
const calc = (expr, vars = {}) => {
  const s = String(expr).replace(/[A-Z]+/g, k => vars[k] ?? 0);
  if (!/^[\d+\-*/(). ]+$/.test(s)) return 0;
  try { return Math.floor(Function('"use strict";return (' + s + ')')()); } catch (e) { return 0; }
};
function rollDetail(expr) {
  const groups = [];
  const replaced = String(expr).replace(/(\d+)d(\d+)/gi, (_, n, sd) => {
    const faces = Array.from({ length: +n }, () => 1 + Math.floor(Math.random() * +sd));
    groups.push({ n: +n, s: +sd, faces });
    return faces.reduce((a, b) => a + b, 0);
  });
  return { total: calc(replaced), groups, expr: String(expr).toUpperCase().replace(/\*/g, '×') };
}

/* ================= データ ================= */
let state = { chars: [], activeId: null, paletteAll: false };

function makeSkill(def) {
  const [cat, raw, init] = def;
  const hasSub = raw.endsWith('（）');
  return { cat, name: hasSub ? raw.slice(0, -2) : raw, hasSub, sub: '', init, job: '', hobby: '', grow: '', other: '', isJob: false, custom: false };
}

function blank(system) {
  const S = SYS[system];
  const c = {
    v: 2, id: uid(), system,
    profile: { name: '', kana: '', player: '', occupation: '', age: '', birthday: '', sex: '', height: '', weight: '', origin: '', hair: '', eyes: '', skin: '', tags: '', iconUrl: '', externalUrl: '', color: '#1f7cf2' },
    abilities: {}, hp: '', mp: '', san: '',
    jobFormula: 'EDU4',
    skills: S.skills.map(makeSkill),
    weapons: JSON.parse(JSON.stringify(S.weapons)),
    items: [{ name: '', count: '', price: '', note: '' }],
    money: { cash: '', deposit: '', assets: '', income: '' },
    tomes: '', entities: '',
    backstory: '', memo: '', scenarios: [],
    extra: '', updatedAt: Date.now(),
  };
  S.abil.forEach(([k]) => { c.abilities[k] = { base: '', adj: '', tmp: '' }; });
  return c;
}

function sample() {
  const c = blank('coc6');
  Object.assign(c.profile, {
    name: '久遠寺 灯', kana: 'くおんじ あかり', occupation: '古書店主', age: '28', sex: '女', height: '162cm', weight: '50kg',
    origin: '東京都', hair: '黒', eyes: '茶', skin: '色白', tags: '古書 / 眼鏡', color: '#7b52bd',
  });
  const base = { STR: 10, CON: 11, POW: 12, DEX: 13, APP: 10, SIZ: 11, INT: 13, EDU: 14 };
  Object.entries(base).forEach(([k, v]) => { c.abilities[k].base = String(v); });
  const job = { '図書館': 60, '目星': 45, 'オカルト': 45, 'ほかの言語': 40, '心理学': 40, '歴史': 50 };
  const hobby = { '聞き耳': 30, '応急手当': 30, '隠れる': 30, '写真術': 40 };
  c.skills.forEach(s => {
    if (job[s.name] != null) { s.job = String(job[s.name]); s.isJob = true; }
    if (hobby[s.name] != null) s.hobby = String(hobby[s.name]);
    if (s.name === 'ほかの言語') s.sub = 'ラテン語';
    if (s.name === '母国語') s.sub = '日本語';
  });
  c.items = [{ name: '懐中電灯', count: '1', price: '', note: '' }, { name: 'ルーペ', count: '1', price: '', note: '祖父の形見' }, { name: '手帳と万年筆', count: '1', price: '', note: '' }];
  c.money = { cash: '3万円', deposit: '120万円', assets: '古書店「灯台堂」', income: '月20万円' };
  c.backstory = '古書店「灯台堂」の二代目店主。祖父の遺した蔵書目録に、存在しないはずの一冊が載っていた。';
  c.memo = '※ これはサンプルです。自由に書き換えるか削除してください。';
  c.sample = true;
  return c;
}

/* v1（汎用シート）からの移行 */
function migrateV1(o) {
  const sys = o.preset === 'coc7' ? 'coc7' : 'coc6';
  const c = blank(sys);
  Object.assign(c.profile, { name: o.name || '', kana: o.kana || '', player: o.player || '', iconUrl: o.iconUrl || '', externalUrl: o.externalUrl || '', color: o.color || '#1f7cf2' });
  (o.params || []).forEach(p => { if (c.abilities[p.label]) c.abilities[p.label].base = String(p.value ?? ''); });
  const a = abilities(c);
  (o.skills || []).forEach(s => {
    const t = c.skills.find(x => skillLabel(x) === s.name || x.name === s.name);
    if (t) { const d = num(s.value) - skillInit(t, a); if (d) t.other = String(d); }
    else if (s.name) c.skills.push({ cat: 'k', name: s.name, hasSub: false, sub: '', init: String(num(s.value)), job: '', hobby: '', grow: '', other: '', isJob: false, custom: true });
  });
  c.memo = o.memo || ''; c.extra = o.extra || '';
  return c;
}

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

/* ================= 計算 ================= */
function abilities(c) {
  const a = {};
  Object.entries(c.abilities).forEach(([k, v]) => { a[k] = num(v.base) + num(v.adj) + num(v.tmp); });
  return a;
}
function skillLabel(s) { return s.hasSub ? `${s.name}（${s.sub}）` : s.name; }
function skillInit(s, a) { return typeof s.init === 'number' ? s.init : (s.custom ? num(s.init) : calc(s.init, a)); }
function skillTotal(s, a) { return skillInit(s, a) + num(s.job) + num(s.hobby) + num(s.grow) + num(s.other); }

function compute(c) {
  const S = SYS[c.system], a = abilities(c);
  const mythos = c.skills.filter(s => s.name === 'クトゥルフ神話').reduce((m, s) => Math.max(m, skillTotal(s, a)), 0);
  const d = S.derive(a, mythos, c);
  d.a = a; d.mythos = mythos;
  d.hp = c.hp === '' ? d.hpMax : num(c.hp);
  d.mp = c.mp === '' ? d.mpMax : num(c.mp);
  d.san = c.san === '' ? d.sanStart : num(c.san);
  d.indef = Math.floor(d.san * 4 / 5);
  d.jobUsed = c.skills.reduce((t, s) => t + num(s.job), 0);
  d.hobbyUsed = c.skills.reduce((t, s) => t + num(s.hobby), 0);
  return d;
}

/* ================= ココフォリア出力 ================= */
function damageText(dmg, db) {
  const dbs = db === '0' ? '' : db;
  return String(dmg || '').replace(/\s*\+\s*DB/gi, dbs).replace(/DB/gi, dbs);
}
function buildCommands(c, d) {
  const S = SYS[c.system], cmd = S.cmd, a = d.a, L = [];
  L.push(`${cmd}<={SAN} 【SANチェック】`);
  if (c.system === 'coc6') L.push(`${cmd}<=${d.idea} 【アイデア】`, `${cmd}<=${d.luck} 【幸運】`, `${cmd}<=${d.know} 【知識】`);
  else L.push(`${cmd}<={幸運} 【幸運】`, `${cmd}<=${d.idea} 【アイデア】`, `${cmd}<=${d.know} 【知識】`);
  const skills = c.skills
    .filter(s => s.name && skillTotal(s, a) > 0)
    .filter(s => state.paletteAll || s.isJob || ALWAYS.includes(s.name) || skillTotal(s, a) !== skillInit(s, a));
  CATS.forEach(([cat]) => skills.filter(s => s.cat === cat).forEach(s => L.push(`${cmd}<=${skillTotal(s, a)} 【${skillLabel(s)}】`)));
  c.weapons.filter(w => w.name).forEach(w => {
    if (w.rate) L.push(`${cmd}<=${w.rate} 【${w.name}】`);
    if (w.damage) L.push(`${damageText(w.damage, d.db)} 【${w.name} ダメージ】`);
  });
  if (c.system === 'coc6') S.abil.forEach(([k]) => L.push(`${cmd}<={${k}}*5 【${k} × 5】`));
  else S.abil.filter(([k]) => k !== 'LUCK').forEach(([k]) => L.push(`${cmd}<={${k}} 【${k}】`));
  (c.extra || '').split('\n').map(l => l.trimEnd()).filter(Boolean).forEach(l => L.push(l));
  return L.join('\n');
}
function buildMemo(c, d) {
  const p = c.profile;
  const pair = (k, v) => v ? `${k}：${v}` : '';
  const line = arr => arr.filter(Boolean).join(' / ');
  const lines = [
    p.kana,
    line([pair('職業', p.occupation), pair('年齢', p.age), pair('誕生日', p.birthday), pair('性別', p.sex)]),
    line([pair('身長', p.height), pair('体重', p.weight), pair('出身', p.origin)]),
    line([pair('髪', p.hair), pair('瞳', p.eyes), pair('肌', p.skin)]),
    p.player ? 'PL：' + p.player : '',
    'DB：' + d.db + (c.system === 'coc7' ? ` / ビルド：${d.build} / MOV：${d.mov}` : ''),
  ].filter(Boolean);
  return [lines.join('\n'), c.memo].filter(Boolean).join('\n\n');
}
function toCcfolia(c) {
  const d = compute(c), S = SYS[c.system];
  const status = [{ label: 'HP', value: d.hp, max: d.hpMax }, { label: 'MP', value: d.mp, max: d.mpMax }, { label: 'SAN', value: d.san, max: d.sanMax }];
  if (c.system === 'coc7') status.push({ label: '幸運', value: d.a.LUCK, max: 99 });
  const params = S.abil.filter(([k]) => k !== 'LUCK').map(([k]) => ({ label: k, value: String(d.a[k]) }));
  params.push({ label: 'DB', value: d.db });
  return {
    kind: 'character',
    data: {
      name: c.profile.name || '名無し',
      initiative: d.a.DEX,
      externalUrl: c.profile.externalUrl || '',
      iconUrl: c.profile.iconUrl || null,
      color: c.profile.color || '',
      memo: buildMemo(c, d),
      commands: buildCommands(c, d),
      status, params,
      secret: false, invisible: false, hideStatus: false,
    },
  };
}

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
    </button>`).join('');
}

const pid = path => 'f-' + path.replace(/\./g, '-');
const inp = (path, value, opts = {}) =>
  `<input class="${opts.cls || 'inp'}" id="${pid(path)}" data-p="${path}" value="${esc(value)}"${opts.ph ? ` placeholder="${esc(opts.ph)}"` : ''}${opts.num ? ' inputmode="numeric"' : ''}${opts.label ? ` aria-label="${esc(opts.label)}"` : ''}>`;
const field = (label, path, value, opts = {}) =>
  `<div class="field ${opts.wrap || ''}"><label for="${pid(path)}">${label}</label>${inp(path, value, opts)}</div>`;
const area = (path, value, label, rows = 3, cls = 'inp') =>
  `<textarea class="${cls}" id="${pid(path)}" data-p="${path}" rows="${rows}" aria-label="${label}"${cls.includes('mono') ? ' spellcheck="false"' : ''}>${esc(value)}</textarea>`;

/* ================= ハブ（アイコンの周りに浮かぶ項目） ================= */
const SECTIONS = [
  { key: 'profile', jp: 'プロフィール', en: 'PROFILE', color: 'var(--sky)' },
  { key: 'abilities', jp: '能力値', en: 'ABILITIES', color: 'var(--cyan)' },
  { key: 'skills', jp: '技能', en: 'SKILLS', color: 'var(--pink)' },
  { key: 'weapons', jp: '武器', en: 'WEAPONS', color: 'var(--orange)' },
  { key: 'items', jp: '所持品', en: 'ITEMS', color: 'var(--lime)' },
  { key: 'money', jp: '財産', en: 'ASSETS', color: 'var(--yellow)' },
  { key: 'tomes', jp: '魔導書・遭遇', en: 'MYTHOS', color: 'var(--san)' },
  { key: 'scenarios', jp: '通過シナリオ', en: 'SCENARIOS', color: 'var(--mp)' },
  { key: 'story', jp: '経歴・メモ', en: 'STORY', color: 'var(--hp)' },
];
let panelKey = null;

function sumText(c, d, key) {
  const named = arr => arr.filter(x => String(x.name || '').trim()).length;
  switch (key) {
    case 'profile': return [c.profile.occupation, c.profile.age && c.profile.age + '歳'].filter(Boolean).join(' / ') || '未入力';
    case 'abilities': return `HP ${d.hp}・SAN ${d.san}`;
    case 'skills': return `残り ${d.jobPt - d.jobUsed} / ${d.hobbyPt - d.hobbyUsed}`;
    case 'weapons': return named(c.weapons) + '件';
    case 'items': return named(c.items) + '件';
    case 'money': return c.money.cash || '未入力';
    case 'tomes': return (c.tomes || c.entities) ? '記録あり' : 'なし';
    case 'scenarios': { const fr = playedWith(c).length; return named(c.scenarios) + '本' + (fr ? `・${fr}人と` : ''); }
    case 'story': return c.backstory ? '記入済み' : '未記入';
    default: return '';
  }
}

function toolsHtml(c) {
  const S = SYS[c.system];
  return `${c.sample ? '<span class="sample-tag">サンプル</span>' : ''}
      <span class="sys-badge">${esc(S.label)}</span>
      <button class="btn small lock-btn ${c.locked ? 'on' : ''}" type="button" data-act="lock" aria-pressed="${!!c.locked}" title="${c.locked ? 'フレンドから見えません（押すと公開）' : 'フレンドに公開中（押すと非公開）'}">${c.locked ? '<svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg>非公開' : '<svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 5.8-1"/></svg>フレンドに公開'}</button>
      <button class="btn small" type="button" data-act="dup">複製</button>
      <button class="btn small danger" type="button" data-act="del">削除</button>`;
}
function hubHtml(c) {
  const S = SYS[c.system], n = SECTIONS.length;
  const pos = SECTIONS.map((s, i) => {
    const t = -Math.PI / 2 + i / n * Math.PI * 2;
    return [50 + 41 * Math.cos(t), 50 + 40 * Math.sin(t)];
  });
  return `
    <div class="hub-top">
      ${toolsHtml(c)}
    </div>
    <div class="hub" id="hub">
      <svg class="hub-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse class="orb" cx="50" cy="50" rx="41" ry="40"/>
        <ellipse class="orb inner" cx="50" cy="50" rx="22" ry="22"/>
        ${pos.map(([x, y]) => `<line class="spoke" x1="50" y1="50" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}"/>`).join('')}
      </svg>
      <div class="hub-center">
        <button class="hub-core" type="button" data-stage aria-label="立ち絵を表示">${tokenHtml(c)}</button>
        <div class="hub-name"><b data-hub="name"></b><span class="kana" data-hub="kana"></span></div>
        <div class="hub-stats"><span>HP <b data-out="hpCur"></b></span><span>MP <b data-out="mpCur"></b></span><span>SAN <b data-out="sanCur"></b></span></div>
      </div>
      ${SECTIONS.map((s, i) => `
        <button class="bubble" type="button" data-open="${s.key}" style="--i:${i};--bc:${s.color};left:${pos[i][0].toFixed(2)}%;top:${pos[i][1].toFixed(2)}%">
          <span class="b-ic">${icon(s.key)}</span><span class="b-en">${s.en}</span><span class="b-jp">${s.jp}</span><span class="b-sum" data-sum="${s.key}"></span>
        </button>`).join('')}
    </div>`;
}

function skillTableHtml(c, cat) {
  const rows = c.skills.map((s, i) => [s, i]).filter(([s]) => s.cat === cat).map(([s, i]) => {
    const lbl = esc(skillLabel(s));
    const nameCell = s.custom
      ? inp(`skills.${i}.name`, s.name, { cls: 'c-in', ph: '技能名', label: '技能名' })
      : s.hasSub
        ? `${esc(s.name)}<span class="paren">（</span>${inp(`skills.${i}.sub`, s.sub, { cls: 'c-in', ph: '種類', label: `${s.name}の種類` })}<span class="paren">）</span>`
        : esc(s.name);
    const tail = (s.custom || s.dup)
      ? `<button class="icon-btn" type="button" data-del="skills" data-i="${i}" aria-label="${lbl}を削除">×</button>`
      : s.hasSub ? `<button class="icon-btn" type="button" data-act="dup-skill" data-i="${i}" title="同じ技能をもう1つ追加" aria-label="${esc(s.name)}をもう1つ追加">＋</button>` : '';
    return `<tr data-row="${i}">
      <td><input type="checkbox" class="chk" id="${pid(`skills.${i}.isJob`)}" data-p="skills.${i}.isJob" ${s.isJob ? 'checked' : ''} aria-label="${lbl} を職業技能にする"></td>
      <td><span class="skill-name">${nameCell}<button class="die-btn sk" type="button" data-act="check" data-i="${i}" title="${lbl}で判定（1D100）" aria-label="${lbl}で判定する"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5"/><circle cx="7" cy="7" r="1.2"/><circle cx="13" cy="13" r="1.2"/><circle cx="10" cy="10" r="1.2"/></svg></button></span></td>
      <td class="out-num init" data-l="初期値">${s.custom ? inp(`skills.${i}.init`, s.init, { cls: 'c-in num', num: true, label: '初期値' }) : `<span data-out="sk-i-${i}"></span>`}</td>
      <td data-l="職業P">${inp(`skills.${i}.job`, s.job, { cls: 'c-in num', num: true, label: `${lbl} 職業P` })}</td>
      <td data-l="興味P">${inp(`skills.${i}.hobby`, s.hobby, { cls: 'c-in num', num: true, label: `${lbl} 興味P` })}</td>
      <td data-l="成長">${inp(`skills.${i}.grow`, s.grow, { cls: 'c-in num', num: true, label: `${lbl} 成長` })}</td>
      <td data-l="その他">${inp(`skills.${i}.other`, s.other, { cls: 'c-in num', num: true, label: `${lbl} その他` })}</td>
      <td class="out-num total" data-out="sk-t-${i}"></td>
      <td>${tail}</td>
    </tr>`;
  }).join('');
  return `<div class="tbl-wrap"><table class="tbl sk-tbl">
    <thead><tr><th title="職業技能">職業</th><th style="text-align:left">技能名</th><th>初期値</th><th>職業P</th><th>興味P</th><th>成長</th><th>その他</th><th>合計</th><th></th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

function listTableHtml(c, key, cols, labels, emptyText) {
  if (!c[key].length) return `<p class="empty">${emptyText}</p>`;
  return `<div class="tbl-wrap"><table class="tbl list-tbl">
    <thead><tr>${labels.map(([l, w]) => `<th style="min-width:${w}">${l}</th>`).join('')}<th></th></tr></thead>
    <tbody>${c[key].map((row, i) => `<tr>${cols.map((col, j) => `<td data-l="${labels[j][0]}">${inp(`${key}.${i}.${col}`, row[col], { cls: 'c-in', label: labels[j][0] })}</td>`).join('')}
      <td><button class="icon-btn" type="button" data-del="${key}" data-i="${i}" aria-label="行を削除">×</button></td></tr>`).join('')}</tbody>
  </table></div>`;
}

function sectionBody(key, c) {
  const S = SYS[c.system], p = c.profile, is7 = c.system === 'coc7';
  const out = k => `<span data-out="${k}"></span>`;
  const bar = (hint, tools = '') => `<div class="sec-title">${hint ? `<span class="hint">${hint}</span>` : ''}${tools ? `<div class="tools">${tools}</div>` : ''}</div>`;
  const sub = (t, hint = '') => `<div class="sec-title"><h3>${t}</h3>${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
  switch (key) {
    case 'profile': return `<section class="sec"><div class="fields">
      ${field('名前', 'profile.name', p.name, { wrap: 'half', ph: '探索者の名前' })}
      ${field('ふりがな', 'profile.kana', p.kana, { wrap: 'half' })}
      ${field('職業', 'profile.occupation', p.occupation)}
      ${field('年齢', 'profile.age', p.age)}
      ${field('誕生日', 'profile.birthday', p.birthday || '', { ph: '例：3月14日' })}
      ${field('性別', 'profile.sex', p.sex)}
      ${field('身長', 'profile.height', p.height)}
      ${field('体重', 'profile.weight', p.weight)}
      ${field('出身', 'profile.origin', p.origin)}
      ${field('髪の色', 'profile.hair', p.hair)}
      ${field('瞳の色', 'profile.eyes', p.eyes)}
      ${field('肌の色', 'profile.skin', p.skin)}
      ${field('プレイヤー名', 'profile.player', p.player)}
      <div class="field"><label for="f-profile-color">コマの色</label><input class="inp" id="f-profile-color" type="color" data-p="profile.color" value="${esc(p.color || '#1f7cf2')}"></div>
      ${field('タグ', 'profile.tags', p.tags, { ph: '例：古書 / 眼鏡' })}
      <div class="field wide"><span class="lbl">立ち絵（真ん中のアイコンを押すと表示）</span>
        <div class="portrait-row">
          <div class="portrait-thumb">${portraitSrc(c) ? `<img src="${esc(imgSrc(portraitSrc(c)))}" alt="立ち絵のプレビュー">` : '未設定'}</div>
          <div class="portrait-actions">
            <div class="row"><label class="btn small" for="f-portrait-file">画像を選ぶ</label><button class="btn small" type="button" data-act="icon-edit">アイコンを調整</button><input type="file" id="f-portrait-file" accept="image/*" hidden>${c.portrait ? '<button class="btn small danger" type="button" data-act="portrait-remove">画像を外す</button>' : ''}</div>
            <p>PNG・JPGなど。このブラウザ内に保存されます。画像を選ばない場合は、下の画像URLの画像を使います。</p>
          </div>
        </div>
      </div>
      <div class="field wide"><span class="lbl">BGM（このキャラを開いたときに流れる曲）</span>
        <div class="bgm-set">
          <div class="bgm-now ${c.bgm ? 'on' : ''}"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 15.5V5.2l8-1.7v10"/><circle cx="5.8" cy="15.5" r="2.3"/><circle cx="13.8" cy="13.5" r="2.3"/></svg><span id="bgm-now-name">${c.bgm ? esc(c.bgm.name || 'BGM') : '未設定'}</span>${c.bgm ? `<small class="bgm-kind">${c.bgm.src === 'yt' ? 'YouTube' : c.bgm.src === 'url' ? 'URL' : 'ファイル'}</small>` : ''}</div>
          <div class="row"><label class="btn small" for="f-bgm-file">音楽ファイルを選ぶ</label><input type="file" id="f-bgm-file" accept="audio/*,.mp3,.m4a,.ogg,.wav" hidden>${c.bgm ? '<button class="btn small" type="button" data-act="bgm-play">再生</button><button class="btn small danger" type="button" data-act="bgm-remove">BGMを外す</button>' : ''}</div>
          <div class="row"><input class="inp" id="f-bgm-url" placeholder="YouTubeのURL、または音楽ファイルのURL" value="${(c.bgm?.src === 'url' || c.bgm?.src === 'yt') ? esc(c.bgm.url) : ''}"><button class="btn small" type="button" data-act="bgm-url">URLで設定</button></div>
          ${c.bgm ? `<label class="bg-slider" for="f-bgm-vol">音量<input type="range" id="f-bgm-vol" min="0" max="100" value="${c.bgm.volume ?? 60}"><output id="f-bgm-vol-v">${c.bgm.volume ?? 60}%</output></label>` : ''}
          <p>YouTubeは動画ページのURL（https://www.youtube.com/watch?v=… や https://youtu.be/…）をそのまま貼れます。再生中は左下に小さく動画が出ます。音楽ファイル（mp3・m4a・oggなど）はこのブラウザ内に保存され、バックアップには含まれません。</p>
        </div>
      </div>
      ${field('画像URL（ココフォリアのコマ画像）', 'profile.iconUrl', p.iconUrl, { wrap: 'wide', ph: 'https://…（空欄ならココフォリアで後から設定）' })}
      ${field('参照URL', 'profile.externalUrl', p.externalUrl, { wrap: 'wide', ph: 'https://…' })}
      <div class="field wide"><span class="lbl">このキャラの背景画像（シートを開いているときの背景）</span>
        <div class="portrait-row">
          <div class="bg-thumb sm" style="${c.bgImage ? `background-image:url('${esc(imgSrc(c.bgImage))}')` : ''}">${c.bgImage ? '' : '共通の画像'}</div>
          <div class="portrait-actions"><div class="row"><label class="btn small" for="f-charbg-file">画像を選ぶ</label><input type="file" id="f-charbg-file" accept="image/*" hidden>${c.bgImage ? '<button class="btn small danger" type="button" data-act="charbg-remove">画像を外す</button>' : ''}</div>
          <p>未設定のときは、カラー設定の「共通」の背景が使われます。</p></div>
        </div>
      </div>
    </div></section>`;

    case 'abilities': {
      const rows = S.abil.map(([k, dice, , jp]) => {
        const v = c.abilities[k], nm = jp || k;
        return `<tr>
          <td class="ab-name"><span class="ab-n">${nm}<button class="die-btn" type="button" data-act="roll-one" data-k="${k}" title="${nm}だけ振る（${dice}）" aria-label="${nm}をダイスで振る"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5"/><circle cx="7" cy="7" r="1.2"/><circle cx="13" cy="13" r="1.2"/><circle cx="10" cy="10" r="1.2"/></svg></button></span></td><td class="dice">${dice}</td>
          <td data-l="初期値">${inp(`abilities.${k}.base`, v.base, { cls: 'c-in num', num: true, label: `${nm} 初期値` })}</td>
          <td data-l="増減">${inp(`abilities.${k}.adj`, v.adj, { cls: 'c-in num', num: true, label: `${nm} 増減` })}</td>
          <td data-l="一時的増減">${inp(`abilities.${k}.tmp`, v.tmp, { cls: 'c-in num', num: true, label: `${nm} 一時的増減` })}</td>
          <td class="out-num total" data-l="現在値" data-out="ab-${k}"></td>
          ${is7 ? `<td class="out-num init" data-l="½" data-out="ab-${k}-h"></td><td class="out-num init" data-l="⅕" data-out="ab-${k}-f"></td>` : `<td class="out-num init" data-l="×5" data-out="ab-${k}-x5"></td>`}
        </tr>`;
      }).join('');
      return `<section class="sec">
        ${bar('現在値 ＝ 初期値 ＋ 増減 ＋ 一時的増減。各行のサイコロで1つずつ振れます', '<button class="btn small die-all" type="button" data-act="roll"><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="3.5"/><circle cx="7" cy="7" r="1.2"/><circle cx="13" cy="13" r="1.2"/><circle cx="10" cy="10" r="1.2"/></svg>全部まとめて振る</button>')}
        <div class="ab-viz">
          <figure class="chart-fig radar-fig"><figcaption>能力値チャート <span>現在値</span></figcaption><div class="radar" id="ab-radar"></div></figure>
          <div class="derived">
          <div class="dv hp"><span class="lbl">HP（耐久力）</span><span class="val"><input id="f-hp" data-p="hp" value="${esc(c.hp)}" class="num" inputmode="numeric" aria-label="現在HP" data-ph="hpMax"><small>/ ${out('hpMax')}</small></span></div>
          <div class="dv mp"><span class="lbl">MP</span><span class="val"><input id="f-mp" data-p="mp" value="${esc(c.mp)}" class="num" inputmode="numeric" aria-label="現在MP" data-ph="mpMax"><small>/ ${out('mpMax')}</small></span></div>
          <div class="dv san"><span class="lbl">SAN（正気度）</span><span class="val"><input id="f-san" data-p="san" value="${esc(c.san)}" class="num" inputmode="numeric" aria-label="現在SAN" data-ph="sanStart"><small>/ ${out('sanMax')}</small></span></div>
          <div class="dv"><span class="lbl">初期SAN</span><span class="val">${out('sanStart')}</span></div>
          <div class="dv"><span class="lbl">不定の狂気</span><span class="val">${out('indef')}<small>以下で</small></span></div>
          <div class="dv"><span class="lbl">アイデア</span><span class="val">${out('idea')}</span></div>
          <div class="dv"><span class="lbl">幸運</span><span class="val">${out('luck')}</span></div>
          <div class="dv"><span class="lbl">知識</span><span class="val">${out('know')}</span></div>
          <div class="dv"><span class="lbl">ダメージ・ボーナス</span><span class="val">${out('db')}</span></div>
          ${is7 ? `<div class="dv"><span class="lbl">ビルド</span><span class="val">${out('build')}</span></div><div class="dv"><span class="lbl">MOV</span><span class="val">${out('mov')}</span></div>` : ''}
        </div>
        </div>
        <div class="tbl-wrap"><table class="tbl ab-tbl">
          <thead><tr><th style="text-align:left">能力値</th><th>ダイス</th><th>初期値</th><th>増減</th><th>一時的増減</th><th>現在値</th>${is7 ? '<th>ハード（½）</th><th>イクストリーム（⅕）</th>' : '<th>×5</th>'}</tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </section>`;
    }

    case 'skills': {
      const jobFormula = is7
        ? `<select id="f-jobFormula" data-p="jobFormula" aria-label="職業技能ポイントの計算式">${Object.entries(S.jobFormulas).map(([k, v]) => `<option value="${k}" ${k === c.jobFormula ? 'selected' : ''}>${v}</option>`).join('')}</select>`
        : 'EDU×20';
      return `<section class="sec">
        ${bar('左のチェックを入れた技能が職業技能です')}
        <figure class="chart-fig sk-fig"><figcaption>技能グラフ <span class="legend"><i class="sw sw-init"></i>初期値<i class="sw sw-add"></i>振ったポイント</span></figcaption><div id="sk-chart"></div></figure>
        <div class="points">
          <span class="pt" data-pt="job">職業P（${jobFormula}） 残り <b data-out="jobLeft"></b> / <span data-out="jobPt"></span></span>
          <span class="pt" data-pt="hobby">興味P（INT×${is7 ? 2 : 10}） 残り <b data-out="hobbyLeft"></b> / <span data-out="hobbyPt"></span></span>
        </div>
        <div class="skill-tables">
          ${CATS.map(([cat, label]) => `
            <div class="skill-block" data-cat="${cat}">
              <div class="sub-title">${label}<button class="btn small" type="button" data-act="add-skill" data-cat="${cat}">＋ 技能を追加</button></div>
              ${skillTableHtml(c, cat)}
            </div>`).join('')}
        </div>
      </section>`;
    }

    case 'weapons': return `<section class="sec">
      ${bar('ダメージの「DB」はダメージ・ボーナスに置き換えて出力します', '<button class="btn small" type="button" data-act="add-weapon">＋ 追加</button>')}
      ${listTableHtml(c, 'weapons', ['name', 'rate', 'damage', 'range', 'attacks', 'ammo', 'durability', 'note'],
        [['名称', '9em'], ['成功率', '4em'], ['ダメージ', '6em'], ['射程', '4em'], ['攻撃回数', '4em'], ['装弾数', '4em'], ['耐久力', '4em'], ['その他', '8em']], '武器はありません。')}
    </section>`;

    case 'items': return `<section class="sec">
      ${bar('', '<button class="btn small" type="button" data-act="add-item">＋ 追加</button>')}
      ${listTableHtml(c, 'items', ['name', 'count', 'price', 'note'], [['名称', '10em'], ['個数', '3em'], ['価格', '5em'], ['効果・備考', '12em']], '所持品はありません。')}
    </section>`;

    case 'money': return `<section class="sec"><div class="fields">
      ${field('収入', 'money.income', c.money.income)}
      ${field('現金', 'money.cash', c.money.cash)}
      ${field('預金・借金', 'money.deposit', c.money.deposit)}
      ${field('個人資産・不動産', 'money.assets', c.money.assets)}
    </div></section>`;

    case 'tomes': return `<section class="sec">
      ${sub('魔導書・呪文・アーティファクト')}
      ${area('tomes', c.tomes, '魔導書・呪文・アーティファクト', 5)}
      ${sub('遭遇した超自然の存在')}
      ${area('entities', c.entities, '遭遇した超自然の存在', 5)}
    </section>`;

    case 'scenarios': return scenariosHtml(c);

    case 'story': return `<section class="sec">
      ${sub('経歴')}
      ${area('backstory', c.backstory, '経歴', 6)}
      ${sub('メモ', 'プロフィールと一緒にコマのメモ欄に入ります')}
      ${area('memo', c.memo, 'メモ', 4)}
      ${sub('追加コマンド', '1行に1コマンド。チャットパレットの末尾に入ります')}
      ${area('extra', c.extra, '追加コマンド', 3, 'inp mono')}
    </section>`;
    default: return '';
  }
}

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

/* ================= ふわっとエフェクト ================= */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const SPARK = ['var(--orange)', 'var(--pink)', 'var(--yellow)', 'var(--cyan)', 'var(--lime)', 'var(--sky)'];
function fx(x, y, burst = false) {
  if (reduceMotion.matches) return;
  const make = (cls, vars) => {
    const e = document.createElement('span');
    e.className = 'fx ' + cls; e.style.left = x + 'px'; e.style.top = y + 'px';
    if (vars) Object.entries(vars).forEach(([k, v]) => e.style.setProperty(k, v));
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 1400);
  };
  make('fx-bloom'); make('fx-ring'); make('fx-ring late');
  if (burst) {
    make('fx-ring big');
    for (let i = 0; i < 14; i++) {
      const ang = i / 14 * Math.PI * 2 + Math.random() * .3, dist = 70 + Math.random() * 60;
      make('fx-spark', { '--dx': Math.cos(ang) * dist + 'px', '--dy': Math.sin(ang) * dist + 'px', '--c': SPARK[i % SPARK.length] });
    }
  }
}
function fxAt(el, burst) { const r = el.getBoundingClientRect(); fx(r.left + r.width / 2, r.top + r.height / 2, burst); }
function enter(el) { if (!el || reduceMotion.matches) return; el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); }
document.addEventListener('pointerdown', e => { if (e.button === 0) fx(e.clientX, e.clientY); });

function renderAll() { applyBg(); if (!$('select').hidden) renderSelect(); $('copy-status').textContent = ''; renderShelf(); renderSheet(); renderOutput(); enter($('sheet')); enter(document.querySelector('.koma')); }
function touch() {
  const c = active(); c.updatedAt = Date.now(); delete c.sample;
  save(); renderShelf(); renderOutput(); updateComputed();
  const tk = document.querySelector('.hub-core .token, .bk-portrait .token');
  if (tk) tk.outerHTML = tokenHtml(c);
}

/* ================= 編集 ================= */
function setPath(obj, path, val) {
  const ks = path.split('.'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  o[ks[ks.length - 1]] = val;
}
function onEdit(e) {
  const t = e.target; if (!t.dataset.p) return;
  setPath(active(), t.dataset.p, t.type === 'checkbox' ? t.checked : t.value);
  touch();
}
const onBoth = (ev, fn) => [$('sheet'), $('panel')].forEach(el => el.addEventListener(ev, fn));
onBoth('input', e => { if (e.target.type !== 'checkbox' && e.target.tagName !== 'SELECT') onEdit(e); });
onBoth('change', e => { if (e.target.type === 'checkbox' || e.target.tagName === 'SELECT') { onEdit(e); if (e.target.tagName === 'SELECT') updateComputed(); } });

function arm(b, label) {
  if (b.classList.contains('armed')) return true;
  const orig = b.textContent;
  b.classList.add('armed'); b.textContent = label;
  setTimeout(() => { b.classList.remove('armed'); b.textContent = orig; }, 3000);
  return false;
}

onBoth('click', e => {
  const bt = e.target.closest('[data-booktab]');
  if (bt) { setBookTab(bt.dataset.booktab); return; }
  const bs = e.target.closest('[data-booksub]');
  if (bs) { setBookSub(bs.dataset.booksub); return; }
  const stg = e.target.closest('[data-stage]');
  if (stg) { openStage(stg); return; }
  const op = e.target.closest('[data-open]');
  if (op) { openPanel(op.dataset.open, op); return; }
  const b = e.target.closest('button'); if (!b) return;
  const c = active();
  if (b.dataset.del) { c[b.dataset.del].splice(+b.dataset.i, 1); touch(); renderSheet(); return; }
  let focus = null;
  switch (b.dataset.act) {
    case 'add-skill': {
      const i = c.skills.map(s => s.cat).lastIndexOf(b.dataset.cat) + 1;
      c.skills.splice(i, 0, { cat: b.dataset.cat, name: '', hasSub: false, sub: '', init: '1', job: '', hobby: '', grow: '', other: '', isJob: false, custom: true });
      focus = pid(`skills.${i}.name`); break;
    }
    case 'dup-skill': {
      const i = +b.dataset.i, s = c.skills[i];
      c.skills.splice(i + 1, 0, { ...s, sub: '', job: '', hobby: '', grow: '', other: '', isJob: false, dup: true });
      focus = pid(`skills.${i + 1}.sub`); break;
    }
    case 'icon-edit': openIconEditor(); return;
    case 'portrait-remove': c.portrait = ''; c.avatar = ''; break;
    case 'charbg-remove': c.bgImage = ''; applyBg(); break;
    case 'lock':
      c.locked = !c.locked;
      toast(c.locked ? 'このキャラシは非公開になりました。フレンドからは見えません。' : 'このキャラシはフレンドに公開されます。');
      break;
    case 'toggle-friend': {
      const sc = c.scenarios[+b.dataset.i]; if (!sc) return;
      sc.friends = sc.friends || [];
      const k = sc.friends.indexOf(b.dataset.fid);
      if (k < 0) sc.friends.push(b.dataset.fid); else sc.friends.splice(k, 1);
      break;
    }
    case 'open-friends': openFriends(); return;
    case 'bgm-play': playCharBgm(c, true); return;
    case 'bgm-remove': if (c.bgm?.src === 'idb') AudioDB.del(c.id).catch(() => {}); delete c.bgm; if (bgmFor === c.id) stopBgm(); break;
    case 'bgm-url': {
      const u = ($('f-bgm-url').value || '').trim();
      if (!/^https?:\/\/\S+$/.test(u)) { toast('https:// で始まるYouTubeか音楽ファイルのURLを入れてください。'); return; }
      const yt = parseYouTube(u);
      if (yt) {
        if (c.bgm?.src === 'idb') AudioDB.del(c.id).catch(() => {});
        c.bgm = { src: 'yt', vid: yt.id, start: yt.start, url: u, name: 'YouTube', volume: c.bgm?.volume ?? 60 };
        touch(); renderSheet(); playCharBgm(c, true); return;
      }
      if (/youtube\.com|youtu\.be/i.test(u)) { toast('YouTubeの動画URLを読み取れませんでした。動画ページのURL（https://www.youtube.com/watch?v=… や https://youtu.be/…）を入れてください。'); return; }
      if (/nicovideo|soundcloud\.com|spotify\.com/i.test(u)) { toast('このサイトのURLは使えません。YouTubeか、mp3などの音楽ファイルを直接開けるURLを入れてください。'); return; }
      if (c.bgm?.src === 'idb') AudioDB.del(c.id).catch(() => {});
      c.bgm = { src: 'url', url: u, name: decodeURIComponent(u.split('/').pop().split('?')[0]).replace(/\.[^.]+$/, '') || 'BGM', volume: c.bgm?.volume ?? 60 };
      touch(); renderSheet(); playCharBgm(c, true); return;
    }
    case 'add-weapon': c.weapons.push({ name: '', rate: '', damage: '', range: '', attacks: '1', ammo: '', durability: '', note: '' }); focus = pid(`weapons.${c.weapons.length - 1}.name`); break;
    case 'add-item': c.items.push({ name: '', count: '', price: '', note: '' }); focus = pid(`items.${c.items.length - 1}.name`); break;
    case 'add-scenario': c.scenarios.push({ name: '', date: '', note: '', friends: [] }); focus = pid(`scenarios.${c.scenarios.length - 1}.name`); break;
    case 'roll': {
      const filled = Object.values(c.abilities).some(v => v.base !== '');
      if (filled && !arm(b, 'もう一度押すと全部振り直し')) return;
      const res = SYS[c.system].abil.map(([k, dice, expr, jp]) => { const r = rollDetail(expr); c.abilities[k].base = String(r.total); return { k: jp || k, ...r }; });
      c.hp = ''; c.mp = ''; c.san = '';
      fxAt(b, true);
      diceCardAll(res);
      break;
    }
    case 'roll-one': {
      const def = SYS[c.system].abil.find(([k]) => k === b.dataset.k); if (!def) return;
      const r = rollDetail(def[2]);
      c.abilities[def[0]].base = String(r.total);
      if (['CON', 'SIZ'].includes(def[0])) c.hp = '';
      if (def[0] === 'POW') { c.mp = ''; c.san = ''; }
      fxAt(b, false);
      diceCardOne(def[3] || def[0], r);
      break;
    }
    case 'check': {
      const sk = c.skills[+b.dataset.i]; if (!sk) return;
      const a = abilities(c), target = skillTotal(sk, a);
      fxAt(b, false);
      diceCardCheck(skillLabel(sk) || '技能', target, c.system);
      return;
    }
    case 'dup': {
      const copy = JSON.parse(JSON.stringify(c));
      copy.id = uid(); copy.profile.name = (c.profile.name || '名無し') + '（コピー）'; delete copy.sample;
      if (c.bgm?.src === 'idb') AudioDB.get(c.id).then(bl => bl && AudioDB.put(copy.id, bl)).catch(() => {});
      state.chars.splice(state.chars.indexOf(c) + 1, 0, copy); state.activeId = copy.id;
      save(); renderAll(); return;
    }
    case 'del': {
      if (!arm(b, '本当に削除する')) return;
      if (c.bgm?.src === 'idb') AudioDB.del(c.id).catch(() => {});
      if (bgmFor === c.id) stopBgm();
      state.chars = state.chars.filter(x => x.id !== c.id);
      if (!state.chars.length) state.chars.push(blank('coc6'));
      state.activeId = state.chars[0].id;
      save(); renderAll(); return;
    }
    default: return;
  }
  if (isBook()) {
    const listKey = { 'add-weapon': 'weapons', 'add-item': 'items', 'add-scenario': 'scenarios' }[b.dataset.act];
    if (listKey) { bookSubMap()[listKey] = 'e' + (c[listKey].length - 1); state.bookTab = listKey; }
  }
  touch(); renderSheet();
  if (focus) $(focus)?.focus();
});

let pressTimer = null, longPressed = false;
$('shelf').addEventListener('click', e => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  if (longPressed) { longPressed = false; e.preventDefault(); return; }
  state.activeId = b.dataset.id; save(); renderAll();
  playCharBgm(active());
});
$('shelf').addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') return;
  const it = e.target.closest('.char-item'); if (!it) return;
  longPressed = false;
  clearTimeout(pressTimer);
  pressTimer = setTimeout(() => { longPressed = true; showPeek(it); if (navigator.vibrate) navigator.vibrate(10); }, 450);
});
['pointerup', 'pointercancel', 'pointermove'].forEach(ev => $('shelf').addEventListener(ev, e => {
  if (ev === 'pointermove' && Math.abs(e.movementX) + Math.abs(e.movementY) < 4) return;
  clearTimeout(pressTimer);
}));
$('shelf').addEventListener('contextmenu', e => { if (e.target.closest('.char-item')) e.preventDefault(); });
document.addEventListener('pointerdown', e => { if (!$('peek').hidden && e.pointerType !== 'mouse' && !e.target.closest('.char-item')) hidePeek(); });
$('opt-all').addEventListener('change', e => { state.paletteAll = e.target.checked; save(); renderOutput(); });

/* ================= コピー ================= */
async function copyText(text, statusEl, fallbackEl, okMsg = 'コピーしました。ココフォリアの盤面に貼り付けてください。') {
  statusEl.classList.remove('warn');
  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = okMsg;
    return true;
  } catch (err) {
    let ok = false;
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    ta.remove();
    if (ok) { statusEl.textContent = okMsg; return true; }
    statusEl.classList.add('warn');
    statusEl.textContent = '自動コピーできませんでした。選択された文字を Ctrl+C（⌘+C）でコピーしてください。';
    if (fallbackEl) {
      if (fallbackEl.closest('details')) fallbackEl.closest('details').open = true;
      if (fallbackEl.select) fallbackEl.select();
      else { const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    }
    return false;
  }
}
$('btn-copy').addEventListener('click', e => {
  const btn = e.currentTarget;
  copyText(JSON.stringify(toCcfolia(active())), $('copy-status'), $('json-out')).then(ok => { if (ok) { fxAt(btn, true); enter(document.querySelector('.koma')); } });
});
$('mbar-copy').addEventListener('click', e => {
  const btn = e.currentTarget;
  copyText(JSON.stringify(toCcfolia(active())), $('copy-status'), $('json-out')).then(ok => {
    if (ok) { fxAt(btn, true); toast('コピーしました。ココフォリアの盤面に貼り付けてください。'); }
    else { toast('自動でコピーできませんでした。下の「出力の中身を確認」のJSONを長押ししてコピーしてください。'); $('json-out').scrollIntoView({ block: 'center' }); }
  });
});

/* ================= モーダル ================= */
function openModal(id) { $(id).hidden = false; const f = $(id).querySelector('button, textarea, input'); f && f.focus(); }
function closeModals() { document.querySelectorAll('.overlay').forEach(o => { o.hidden = true; }); }
document.querySelectorAll('.overlay').forEach(o => {
  o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-close]')) closeModals(); });
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if ([...document.querySelectorAll('.overlay')].some(o => !o.hidden)) closeModals();
  else if (!$('stage-ov').hidden) closeStage();
  else closePanel();
});
$('panel-ov').addEventListener('click', e => { if (e.target === e.currentTarget) closePanel(); });
$('panel').addEventListener('click', e => {
  const g = e.target.closest('[data-goto]');
  if (g) { gotoPanel(g.dataset.goto); return; }
  if (e.target.closest('[data-close-panel]')) closePanel();
});
$('sao-menu').innerHTML = SECTIONS.map(s => `<button class="sao-item" type="button" data-goto="${s.key}"><span class="sao-ic">${icon(s.key)}</span><span class="sao-lb"><small>${s.en}</small>${s.jp}</span></button>`).join('');
$('sao-close').innerHTML = icon('close');

$('preset-list').innerHTML = Object.entries(SYS).map(([k, v]) =>
  `<button class="preset" type="button" data-sys="${k}"><b>${esc(v.label)}</b><span>判定 ${esc(v.cmd)}&lt;=○○ ・ 技能${v.skills.length}種</span></button>`).join('');
$('preset-list').addEventListener('click', e => {
  const b = e.target.closest('[data-sys]'); if (!b) return;
  const c = blank(b.dataset.sys);
  state.chars.unshift(c); state.activeId = c.id; save(); closeModals(); stopBgm();
  if (!$('select').hidden) leaveSelect(null, true);
  renderAll();
  openPanel('profile', document.querySelector('#sheet .hub-core'));
  $('f-profile-name')?.focus({ preventScroll: true });
});
$('btn-new').addEventListener('click', () => openModal('modal-new'));

$('btn-import').addEventListener('click', () => { $('import-err').textContent = ''; $('import-text').value = ''; openModal('modal-import'); });
$('import-file').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { $('import-text').value = r.result; };
  r.readAsText(f);
});
$('import-run').addEventListener('click', () => {
  const err = $('import-err');
  const raw = $('import-text').value.trim();
  if (!raw) { err.textContent = '貼り付ける欄が空です。いあきゃらやココフォリアでコピーしたデータを貼り付けてください。'; return; }
  let obj = null;
  try { obj = JSON.parse(raw); } catch (e) { obj = null; }
  if (obj === null) {
    const c = fromText(raw);
    if (!c) { err.textContent = '探索者のデータが見つかりませんでした。いあきゃらの「ココフォリア」出力でコピーしたデータを、途中で切らずにそのまま貼り付けてください。'; return; }
    obj = [c];
  }
  let list = [];
  if (obj && obj.kind === 'character') list = [obj];
  else if (obj && Array.isArray(obj.chars)) list = obj.chars;
  else if (Array.isArray(obj)) list = obj;
  else if (obj && (obj.abilities || obj.params)) list = [obj];
  list = list.map(c => (c && c.v === 2 && SYS[c.system] && c.profile) ? c
    : (c && c.v === 2 && c.importInfo) ? c
    : (c && c.kind === 'character') ? fromCcfolia(c)
    : (c && Array.isArray(c.params)) ? migrateV1(c) : null).filter(Boolean);
  if (!list.length) { err.textContent = '探索者のデータが見つかりませんでした。このアプリのバックアップか、ココフォリアのコマデータを貼り付けてください。'; return; }
  list.forEach(c => { c.id = uid(); delete c.sample; });
  if (obj && Array.isArray(obj.friends)) {
    state.friends = state.friends || [];
    obj.friends.forEach(f => { if (f && f.id && f.name && !state.friends.some(x => x.id === f.id)) state.friends.push({ id: f.id, name: String(f.name), color: f.color || '#1f6fe0', note: f.note || '' }); });
  }
  state.chars = [...list, ...state.chars]; state.activeId = list[0].id;
  save(); closeModals(); renderAll();
  const info = list[0].importInfo;
  list.forEach(c => { delete c.importInfo; });
  if (info) toast(`「${list[0].profile.name || '名無し'}」を読み込みました。技能${info.matched}個を反映${info.added ? `、${info.added}個を新しく追加` : ''}しました。技能の値は「その他」欄に入っています。`);
  else toast(`${list.length}人の探索者を読み込みました。`);
});

$('btn-export').addEventListener('click', () => {
  $('export-text').value = JSON.stringify({ app: 'charasheet-kobo', version: 2, chars: state.chars, friends: state.friends || [] }, null, 2);
  $('export-status').textContent = '';
  openModal('modal-export');
});
$('export-copy').addEventListener('click', () => copyText($('export-text').value, $('export-status'), $('export-text'), 'コピーしました。メモ帳などに保存してください。').then(ok => { if (ok) fxAt($('export-copy'), true); }));

/* ================= トースト ================= */
let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
}

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
  sakura: { name: '和風', sub: '桜と墨', look: 'mincho', vals: { bg: '#efe3e4', solid: '#fcf7f6', ink: '#2a1c22', sky: '#b23f68', cyan: '#d98aa6', amber: '#c08a2a' } },
  neon:   { name: 'ネオン', sub: '夜のサイバー', look: 'dark', vals: { bg: '#0b0918', solid: '#16122b', ink: '#ece8ff', sky: '#a159f5', cyan: '#22c8e8', amber: '#f2569e' } },
  book:   { name: '魔導書', sub: '古本に万年筆で書きこむ記録', look: 'dark mincho book', vals: { bg: '#0b0b0c', solid: '#19181a', ink: '#e4e1db', sky: '#5d5468', cyan: '#a9a49b', amber: '#9a8c6e' } },
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

/* ================= 立ち絵 ================= */
const blobUrls = new Map();
function imgSrc(u) {
  if (!u || !u.startsWith('data:')) return u;
  let b = blobUrls.get(u);
  if (!b) {
    try {
      const [head, data] = u.split(',');
      const bin = atob(data), arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      b = URL.createObjectURL(new Blob([arr], { type: head.slice(5).split(';')[0] }));
    } catch (e) { b = u; }
    blobUrls.set(u, b);
  }
  return b;
}
function loadPortrait(file) { return loadImageData(file, 1200, .86); }
function loadImageData(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('画像ファイル（PNG・JPGなど）を選んでください。')); return; }
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('画像を読み込めませんでした。別の画像で試してください。'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('画像を読み込めませんでした。別の画像で試してください。'));
      img.onload = () => {
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        let url = cv.toDataURL('image/webp', quality);
        if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/png');
        resolve(url);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function renderStage() {
  const c = active(), p = c.profile, src = portraitSrc(c);
  $('stage-figure').innerHTML = src
    ? `<img src="${esc(imgSrc(src))}" alt="${esc(p.name || '探索者')}の立ち絵" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'stage-empty',innerHTML:'<span><b>画像を表示できません</b>URLが正しいか確認するか、画像ファイルを選んでください。</span>'}))">`
    : `<div class="stage-empty"><span><b>立ち絵が未設定です</b>右上の「画像を選ぶ」から、PNGやJPGの画像を設定できます。</span></div>`;
  $('stage-name').textContent = p.name || '名無し';
  $('stage-kana').textContent = p.kana;
  $('stage-sub').textContent = [p.occupation, p.age && p.age + '歳', p.birthday && '誕生日 ' + p.birthday, p.sex].filter(Boolean).join(' / ');
  $('stage-remove').hidden = !c.portrait;
}
function openStage(fromEl) {
  renderStage();
  const ov = $('stage-ov'); ov.hidden = false;
  if (!reduceMotion.matches) {
    if (fromEl) fxAt(fromEl, true);
    ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
    $('stage-figure').animate([
      { opacity: 0, transform: 'translateY(48px) scale(.9)', filter: 'blur(12px) brightness(1.8)' },
      { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0) brightness(1)' },
    ], { duration: 900, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    document.querySelectorAll('.stage-ring, .stage-rays').forEach((el, i) => el.animate(
      [{ opacity: 0, scale: .4 }, { opacity: 1, scale: 1 }], { duration: 900, delay: i * 90, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: 'backwards' }));
    $('stage-plate').animate([{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'translateX(0)' }],
      { duration: 520, delay: 380, easing: 'cubic-bezier(.2, .9, .3, 1.15)', fill: 'backwards' });
  }
  $('stage-close').focus({ preventScroll: true });
}
function closeStage() {
  const ov = $('stage-ov'); if (ov.hidden) return;
  const done = a => { ov.hidden = true; a?.cancel(); document.querySelector('#sheet .hub-core')?.focus({ preventScroll: true }); };
  if (reduceMotion.matches) return done();
  const a = ov.animate([{ opacity: 1 }, { opacity: 0, transform: 'scale(1.03)' }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
  a.onfinish = () => done(a);
}
$('stage-ov').addEventListener('click', e => {
  if (e.target.closest('#stage-close')) { closeStage(); return; }
  if (e.target.closest('#stage-profile')) { closeStage(); openPanel('profile', document.querySelector('#sheet .bubble[data-open="profile"]')); return; }
  if (e.target.closest('#stage-remove')) { const c = active(); c.portrait = ''; touch(); renderSheet(); renderStage(); return; }
  if (!e.target.closest('.stage-tools, .stage-plate, .stage-empty')) closeStage();
});
document.addEventListener('change', async e => {
  if (e.target.id === 'f-charbg-file') {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    try { const c = active(); c.bgImage = await loadImageData(f, 1600, .78); touch(); renderSheet(); applyBg(); toast('このキャラの背景画像を設定しました。'); }
    catch (err) { toast(err.message); }
    return;
  }
  if (e.target.id !== 'f-portrait-file' && e.target.id !== 'stage-file') return;
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const url = await loadPortrait(f);
    const c = active(); c.portrait = url;
    if (!c.icon) c.avatar = await renderAvatar(url, Object.assign({ x: 50, y: 15, z: 1 }, c.iconCrop || {}));
    touch(); renderSheet();
    if (!$('stage-ov').hidden) renderStage();
    toast('立ち絵を設定しました。');
  } catch (err) { toast(err.message); }
});

/* ================= 探索者カードのチラ見せ ================= */
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
let peekId = null;
function peekHtml(c) {
  const d = compute(c), S = SYS[c.system], p = c.profile, src = portraitSrc(c), a = d.a;
  const bars = [['HP', d.hp, d.hpMax, 'var(--hp), var(--orange)'], ['MP', d.mp, d.mpMax, 'var(--mp), var(--cyan)'], ['SAN', d.san, d.sanMax, 'var(--san), var(--pink)']];
  if (c.system === 'coc7') bars.push(['幸運', a.LUCK, 99, 'var(--yellow), var(--orange)']);
  const skills = c.skills.filter(s => s.name && skillTotal(s, a) !== skillInit(s, a))
    .map(s => [skillLabel(s), skillTotal(s, a)]).sort((x, y) => y[1] - x[1]).slice(0, 12);
  return `
    <div class="peek-art">${src ? `<img src="${esc(imgSrc(src))}" alt="" onerror="this.remove()">` : tokenHtml(c)}</div>
    <div class="peek-info">
      <div class="peek-head">
        <span class="peek-sys">${esc(S.short)}${c.locked ? ' ・ 非公開' : ''}</span>
        <span class="peek-name">${esc(p.name || '名無し')}</span>
        ${p.kana ? `<span class="peek-kana">${esc(p.kana)}</span>` : ''}
        <span class="peek-sub">${esc([p.occupation, p.age && p.age + '歳', p.birthday && '誕生日 ' + p.birthday, p.sex].filter(Boolean).join(' / ') || 'プロフィール未入力')}</span>
      </div>
      <div class="pbars">${bars.map(([l, v, m, g]) => `<div class="pbar"><b>${l}</b><span class="tr"><i style="width:${m > 0 ? Math.max(0, Math.min(100, v / m * 100)) : 0}%;background:linear-gradient(90deg, ${g})"></i></span><span>${v}/${m}</span></div>`).join('')}</div>
      <div class="peek-radar">${radarSvg(c, a, 230, false)}</div>
      <div class="peek-der"><span>アイデア <b>${d.idea}</b></span><span>幸運 <b>${d.luck}</b></span><span>知識 <b>${d.know}</b></span><span>DB <b>${esc(d.db)}</b></span>${c.system === 'coc7' ? `<span>MOV <b>${d.mov}</b></span>` : ''}</div>
      ${playedWith(c).length ? `<div class="peek-friends"><small>一緒に遊んだ</small>${playedWith(c).map(({ f, n }) => `<span class="fchip on static" style="--fc:${esc(f.color)}"><span class="fdot">${esc((f.name || '？').charAt(0))}</span>${esc(f.name)}${n > 1 ? `<b>×${n}</b>` : ''}</span>`).join('')}</div>` : ''}
      <div class="peek-skills">${skills.length ? skills.map(([n, v]) => `<span>${esc(n)}<b>${v}</b></span>`).join('') : '<span class="none">ポイントを振った技能はまだありません</span>'}</div>
    </div>`;
}
function showPeek(item) {
  const c = state.chars.find(x => x.id === item.dataset.id); if (!c) return;
  const pk = $('peek'), wasHidden = pk.hidden;
  pk.innerHTML = peekHtml(c); pk.hidden = false; peekId = c.id;
  const r = item.getBoundingClientRect(), pw = pk.offsetWidth, ph = pk.offsetHeight;
  let left = r.right + 16;
  if (left + pw > innerWidth - 12) left = Math.max(12, innerWidth - pw - 12);
  let top = Math.min(Math.max(12, r.top + r.height / 2 - ph / 2), Math.max(12, innerHeight - ph - 12));
  if (innerWidth < 760) { left = Math.max(12, (innerWidth - pw) / 2); top = Math.max(12, (innerHeight - ph) / 2 - 30); }
  pk.style.left = left + 'px'; pk.style.top = top + 'px';
  pk.style.setProperty('--ay', Math.min(ph - 20, Math.max(20, r.top + r.height / 2 - top)) + 'px');
  if (!reduceMotion.matches) {
    pk.animate(wasHidden
      ? [{ opacity: 0, transform: 'translateX(-14px) scale(.96)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'none' }]
      : [{ opacity: .6 }, { opacity: 1 }], { duration: wasHidden ? 340 : 160, easing: 'cubic-bezier(.2, .9, .3, 1.1)' });
  }
}
function hidePeek() { $('peek').hidden = true; peekId = null; }
$('shelf').addEventListener('pointerover', e => {
  if (!canHover.matches) return;
  const it = e.target.closest('.char-item');
  if (it && it.dataset.id !== peekId) showPeek(it);
});
$('shelf').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hidePeek(); });
$('shelf').addEventListener('focusin', e => { const it = e.target.closest('.char-item'); if (it) showPeek(it); });
$('shelf').addEventListener('focusout', hidePeek);
addEventListener('scroll', hidePeek, { passive: true });

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

/* ================= キャラごとのBGM（音楽ファイル・URL・YouTube） ================= */
const AudioDB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('charasheet-kobo', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('bgm');
      r.onsuccess = () => { this.db = r.result; res(this.db); };
      r.onerror = () => rej(r.error);
    });
  },
  async tx(mode, fn) {
    const db = await this.open();
    return new Promise((res, rej) => { const t = db.transaction('bgm', mode); const out = fn(t.objectStore('bgm')); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); });
  },
  put(id, blob) { return this.tx('readwrite', st => st.put(blob, id)); },
  get(id) { return this.tx('readonly', st => st.get(id)); },
  del(id) { return this.tx('readwrite', st => st.delete(id)); },
};
function parseYouTube(u) {
  let url; try { url = new URL(u); } catch (e) { return null; }
  const h = url.hostname.replace(/^www\.|^m\.|^music\./, '');
  let id = null;
  if (h === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
    id = url.searchParams.get('v');
    const m = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/);
    if (!id && m) id = m[1];
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  const t = url.searchParams.get('t') || url.searchParams.get('start') || '';
  let start = 0;
  if (/^\d+$/.test(t)) start = +t;
  else { const mm = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/); if (mm) start = (+mm[1] || 0) * 3600 + (+mm[2] || 0) * 60 + (+mm[3] || 0); }
  return { id, start };
}
const bgmAudio = new Audio();
bgmAudio.preload = 'auto';
let bgmFor = null, bgmUrl = null, bgmFade = 0, bgmMode = null, bgmCur = 0, bgmPlaying = false;
let ytApi = null, ytReady = null, ytPlayer = null;
const bgmVol = c => Math.max(0, Math.min(1, (c?.bgm?.volume ?? 60) / 100));
const masterVol = () => state.bgmMuted ? 0 : (state.masterVol ?? 100) / 100;
function applyVol() {
  const v = Math.max(0, Math.min(1, bgmCur * masterVol()));
  if (bgmMode === 'audio') bgmAudio.volume = v;
  else if (bgmMode === 'yt' && ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(Math.round(v * 100));
}
function fadeTo(target, ms) {
  const my = ++bgmFade;
  return new Promise(res => {
    const start = bgmCur, t0 = performance.now();
    const step = t => {
      if (my !== bgmFade) return res();
      const k = Math.min(1, (t - t0) / ms);
      bgmCur = start + (target - start) * k; applyVol();
      k < 1 ? requestAnimationFrame(step) : res();
    };
    requestAnimationFrame(step);
  });
}
function setNowVol(c) { if (bgmFor === c.id) { bgmFade++; bgmCur = bgmVol(c); applyVol(); } }
function loadYTApi() {
  if (ytApi) return ytApi;
  ytApi = new Promise((res, rej) => {
    if (window.YT && window.YT.Player) { res(window.YT); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); res(window.YT); };
    const sc = document.createElement('script');
    sc.src = 'https://www.youtube.com/iframe_api';
    sc.onerror = () => rej(new Error('yt-load'));
    document.head.appendChild(sc);
    setTimeout(() => { if (!(window.YT && window.YT.Player)) rej(new Error('yt-timeout')); }, 12000);
  });
  ytApi.catch(() => { ytApi = null; });
  return ytApi;
}
function ensureYT() {
  if (ytReady) return ytReady;
  ytReady = loadYTApi().then(YT => new Promise(res => {
    $('yt-wrap').hidden = false;
    ytPlayer = new YT.Player('yt-frame', {
      width: 240, height: 200,
      playerVars: { autoplay: 1, playsinline: 1, rel: 0, controls: 1, disablekb: 1 },
      events: {
        onReady: () => res(ytPlayer),
        onStateChange: e => {
          const c = state.chars.find(x => x.id === bgmFor);
          if (e.data === 0) { ytPlayer.seekTo(c?.bgm?.start || 0, true); ytPlayer.playVideo(); return; }
          if (bgmMode === 'yt') bgmPlaying = e.data === 1 || e.data === 3;
          if (e.data === 1 && c?.bgm?.src === 'yt') {
            const vd = ytPlayer.getVideoData ? ytPlayer.getVideoData() : null;
            if (vd && vd.title && vd.video_id === c.bgm.vid && c.bgm.name !== vd.title) {
              c.bgm.name = vd.title; save();
              const nm = $('bgm-now-name'); if (nm && active().id === c.id) nm.textContent = vd.title;
            }
          }
          renderPlayer();
        },
        onError: () => toast('このYouTube動画は、ほかのサイトでの再生が許可されていないため流せませんでした。別の動画を選んでください。'),
      },
    });
  }));
  ytReady.catch(() => { ytReady = null; });
  return ytReady;
}
async function bgmSource(c) {
  if (!c?.bgm) return null;
  if (c.bgm.src === 'url') return c.bgm.url || null;
  try { const blob = await AudioDB.get(c.id); return blob ? URL.createObjectURL(blob) : null; } catch (e) { return null; }
}
function pauseRaw() {
  if (bgmMode === 'audio') bgmAudio.pause();
  else if (bgmMode === 'yt' && ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  bgmPlaying = false;
}
async function playCharBgm(c, force) {
  if (!c || !c.bgm) { stopBgm(); return; }
  if (!force && bgmFor === c.id && bgmPlaying) { renderPlayer(); return; }
  if (bgmPlaying) await fadeTo(0, 300);
  pauseRaw();
  bgmFor = c.id; bgmCur = 0;
  if (c.bgm.src === 'yt') {
    bgmMode = 'yt'; renderPlayer();
    try { await ensureYT(); }
    catch (e) { toast('YouTubeを読み込めませんでした。ネットにつながっているか確認してください。Claude上の公開版ではYouTubeは使えないので、GitHubのURLで開いてください。'); bgmMode = null; renderPlayer(); return; }
    if (bgmFor !== c.id) return;
    applyVol();
    ytPlayer.loadVideoById({ videoId: c.bgm.vid, startSeconds: c.bgm.start || 0 });
    bgmPlaying = true;
    fadeTo(bgmVol(c), 1200);
  } else {
    if (ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
    bgmMode = 'audio';
    const url = await bgmSource(c);
    if (!url) { toast('BGMの音楽ファイルが見つかりませんでした。もう一度設定してください。'); renderPlayer(); return; }
    if (bgmUrl && bgmUrl.startsWith('blob:')) URL.revokeObjectURL(bgmUrl);
    bgmUrl = url; bgmAudio.src = url; bgmAudio.loop = true; applyVol();
    try { await bgmAudio.play(); bgmPlaying = true; fadeTo(bgmVol(c), 900); }
    catch (e) { if (e && e.name === 'NotSupportedError') toast('このBGMは再生できませんでした。mp3などの音楽ファイルか、音楽ファイルの直接URLを設定してください。'); }
  }
  renderPlayer();
}
function stopBgm() {
  if (!bgmPlaying) { pauseRaw(); renderPlayer(); return; }
  fadeTo(0, 500).then(() => { pauseRaw(); renderPlayer(); });
}
function resumeBgm(c) {
  if (bgmFor !== c.id || !bgmMode) { playCharBgm(c, true); return; }
  if (bgmMode === 'audio') bgmAudio.play().then(() => { bgmPlaying = true; fadeTo(bgmVol(c), 600); renderPlayer(); }).catch(() => playCharBgm(c, true));
  else if (ytPlayer && ytPlayer.playVideo) { ytPlayer.playVideo(); bgmPlaying = true; fadeTo(bgmVol(c), 600); renderPlayer(); }
}
const ICON_PLAY = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4.2v11.6c0 .6.7 1 1.2.6l9-5.8c.5-.3.5-1 0-1.3l-9-5.8C6.7 3.2 6 3.6 6 4.2z"/></svg>';
const ICON_PAUSE = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="4" width="3.4" height="12" rx="1"/><rect x="11.6" y="4" width="3.4" height="12" rx="1"/></svg>';
const ICON_SPK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z"/><path class="w" d="M13.5 7a4 4 0 0 1 0 6M15.6 5a7 7 0 0 1 0 10"/></svg>';
const ICON_MUTE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z"/><path class="w" d="M13.5 7.5l5 5M18.5 7.5l-5 5"/></svg>';
function renderPlayer() {
  const c = active(), el = $('bgm');
  const show = !!(c && c.bgm) && $('select').hidden;
  el.hidden = !show;
  $('yt-wrap').hidden = !(show && bgmMode === 'yt' && bgmFor === c.id && c.bgm.src === 'yt');
  el.classList.toggle('has-yt', !$('yt-wrap').hidden);
  if (!show) return;
  const playing = bgmPlaying && bgmFor === c.id;
  el.classList.toggle('playing', playing);
  $('bgm-title').textContent = c.bgm.name || 'BGM';
  $('bgm-src').textContent = c.bgm.src === 'yt' ? 'YouTube' : c.bgm.src === 'url' ? 'URL' : 'ファイル';
  $('bgm-play').setAttribute('aria-label', playing ? '一時停止' : '再生');
  $('bgm-play').innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
  $('bgm-mute').innerHTML = state.bgmMuted ? ICON_MUTE : ICON_SPK;
  $('bgm-mute').setAttribute('aria-label', state.bgmMuted ? 'ミュートを解除' : 'ミュート');
  $('bgm-mute').classList.toggle('on', !!state.bgmMuted);
  $('bgm-vol').value = c.bgm.volume ?? 60;
  $('bgm-vol-v').textContent = c.bgm.volume ?? 60;
}
$('bgm-play').addEventListener('click', () => {
  const c = active(); if (!c?.bgm) return;
  if (bgmPlaying && bgmFor === c.id) stopBgm(); else resumeBgm(c);
});
$('bgm-mute').addEventListener('click', () => { state.bgmMuted = !state.bgmMuted; save(); applyVol(); renderPlayer(); });
$('bgm-vol').addEventListener('input', e => {
  const c = active(); if (!c?.bgm) return;
  c.bgm.volume = +e.target.value; save(); setNowVol(c);
  $('bgm-vol-v').textContent = c.bgm.volume;
  const f = $('f-bgm-vol'); if (f) { f.value = c.bgm.volume; $('f-bgm-vol-v').textContent = c.bgm.volume + '%'; }
});
document.addEventListener('input', e => {
  if (e.target.id !== 'f-bgm-vol') return;
  const c = active(); if (!c?.bgm) return;
  c.bgm.volume = +e.target.value; save(); setNowVol(c);
  $('f-bgm-vol-v').textContent = c.bgm.volume + '%';
  renderPlayer();
});
bgmAudio.addEventListener('play', () => { if (bgmMode === 'audio') { bgmPlaying = true; renderPlayer(); } });
bgmAudio.addEventListener('pause', () => { if (bgmMode === 'audio') { bgmPlaying = false; renderPlayer(); } });
document.addEventListener('change', async e => {
  if (e.target.id !== 'f-bgm-file') return;
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (!/^audio\//.test(f.type) && !/\.(mp3|m4a|aac|ogg|oga|wav|flac|opus|webm)$/i.test(f.name)) { toast('音楽ファイル（mp3・m4a・ogg・wav など）を選んでください。'); return; }
  if (f.size > 40 * 1024 * 1024) { toast('ファイルが大きすぎます。40MBまでの音楽ファイルを選んでください。'); return; }
  const c = active();
  try { await AudioDB.put(c.id, f); }
  catch (err) { toast('BGMを保存できませんでした。ブラウザの保存容量がいっぱいかもしれません。'); return; }
  c.bgm = { src: 'idb', name: f.name.replace(/\.[^.]+$/, ''), volume: c.bgm?.volume ?? 60 };
  touch(); renderSheet();
  toast(`BGM「${c.bgm.name}」を設定しました。`);
  playCharBgm(c, true);
});

/* ================= フレンド ================= */
const friendsOf = () => (state.friends = state.friends || []);
function playedWith(c) {
  const count = new Map();
  (c.scenarios || []).forEach(sc => (sc.friends || []).forEach(id => count.set(id, (count.get(id) || 0) + 1)));
  return friendsOf().filter(f => count.has(f.id)).map(f => ({ f, n: count.get(f.id) })).sort((x, y) => y.n - x.n);
}
const fchip = (f, attrs, on) => `<button type="button" class="fchip ${on ? 'on' : ''}" style="--fc:${esc(f.color)}" ${attrs}><span class="fdot">${esc((f.name || '？').charAt(0))}</span>${esc(f.name)}</button>`;
function scenariosHtml(c) {
  const fr = friendsOf(), pw = playedWith(c);
  return `<section class="sec">
    <div class="played-with">
      <span class="lbl">この探索者と冒険したフレンド</span>
      <div class="pw-chips">${pw.length ? pw.map(({ f, n }) => `<span class="fchip on static" style="--fc:${esc(f.color)}"><span class="fdot">${esc((f.name || '？').charAt(0))}</span>${esc(f.name)}<b>×${n}</b></span>`).join('') : '<span class="empty">シナリオに「一緒に遊んだフレンド」を付けると、ここに並びます。</span>'}</div>
    </div>
    <div class="sec-title"><span class="hint">シナリオごとに、一緒に遊んだフレンドを押して選べます</span><div class="tools"><button class="btn small" type="button" data-act="open-friends">フレンドを管理</button><button class="btn small" type="button" data-act="add-scenario">＋ シナリオを追加</button></div></div>
    ${c.scenarios.length ? `<div class="scn-list">${c.scenarios.map((sc, i) => `
      <div class="scn">
        <div class="scn-top">
          ${inp(`scenarios.${i}.name`, sc.name, { cls: 'inp scn-name', ph: 'シナリオ名', label: 'シナリオ名' })}
          ${inp(`scenarios.${i}.date`, sc.date, { cls: 'inp scn-date', ph: '日付（例：2026/10/01）', label: '日付' })}
          <button class="icon-btn" type="button" data-del="scenarios" data-i="${i}" aria-label="このシナリオを削除">×</button>
        </div>
        ${inp(`scenarios.${i}.note`, sc.note, { cls: 'inp', ph: 'メモ（生還・報酬・KPなど）', label: 'メモ' })}
        <div class="scn-friends"><span class="lbl">一緒に遊んだフレンド</span>
          ${fr.length ? fr.map(f => fchip(f, `data-act="toggle-friend" data-i="${i}" data-fid="${f.id}" aria-pressed="${(sc.friends || []).includes(f.id)}"`, (sc.friends || []).includes(f.id))).join('') : '<span class="empty">フレンドがまだいません。</span>'}
          <button class="btn small ghost" type="button" data-act="open-friends">＋ フレンドを追加</button>
        </div>
      </div>`).join('')}</div>` : '<p class="empty">まだありません。「＋ シナリオを追加」から記録できます。</p>'}
  </section>`;
}
function friendStats(fid) {
  const out = [];
  state.chars.forEach(c => (c.scenarios || []).forEach(sc => { if ((sc.friends || []).includes(fid)) out.push({ c, sc }); }));
  return out;
}
function renderFriends() {
  const list = friendsOf();
  $('friend-list').innerHTML = list.length ? list.map(f => {
    const st = friendStats(f.id);
    return `<div class="friend" data-fid="${f.id}">
      <span class="fav" style="--fc:${esc(f.color)}">${esc((f.name || '？').charAt(0))}${f.uid ? '<i class="ol-badge" title="キャラシ工房のフレンド"></i>' : ''}</span>
      <div class="fbody">
        <div class="frow">
          <input class="inp" id="fr-name-${f.id}" data-fp="name" value="${esc(f.name)}" aria-label="フレンドの名前">
          <input type="color" class="fcolor" id="fr-color-${f.id}" data-fp="color" value="${esc(f.color)}" aria-label="${esc(f.name)}の色">
          <button class="btn small danger" type="button" data-fdel>削除</button>
        </div>
        <input class="inp fnote" id="fr-note-${f.id}" data-fp="note" value="${esc(f.note || '')}" placeholder="メモ（Discord・Xのアカウントなど）" aria-label="${esc(f.name)}のメモ">
        <div class="fplayed">${st.length
          ? `<b>冒険 ${st.length}回</b>${st.map(({ c, sc }) => `<span class="fp-item">${esc(c.profile.name || '名無し')}「${esc(sc.name || '無題')}」${sc.date ? `<small>${esc(sc.date)}</small>` : ''}</span>`).join('')}`
          : '<span class="empty">まだ一緒に遊んだ記録はありません。通過シナリオで選ぶと、ここに記録されます。</span>'}</div>
      </div>
    </div>`;
  }).join('') : '<p class="empty">まだフレンドがいません。上の欄に名前を入れて「追加」を押してください。</p>';
}
function openFriends() { renderOnline(); renderFriends(); openModal('modal-friends'); if (me) loadFriendships().catch(() => {}); }
$('friend-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('friend-name').value.trim();
  if (!name) { $('friend-name').focus(); return; }
  friendsOf().push({ id: uid(), name, color: $('friend-color').value || '#1f6fe0', note: $('friend-note').value.trim() });
  $('friend-name').value = ''; $('friend-note').value = '';
  const FC = ['#1f6fe0', '#e0457a', '#2f9e57', '#7b52bd', '#e08a1f', '#12a6cf', '#c0392b', '#8e6e1f'];
  $('friend-color').value = FC[friendsOf().length % FC.length];
  save(); renderFriends(); renderSheet();
  toast(`フレンド「${name}」を追加しました。`);
});
$('friend-list').addEventListener('input', e => {
  const row = e.target.closest('.friend'), key = e.target.dataset.fp; if (!row || !key) return;
  const f = friendsOf().find(x => x.id === row.dataset.fid); if (!f) return;
  f[key] = e.target.value; save();
  const av = row.querySelector('.fav');
  if (key === 'color') av.style.setProperty('--fc', f.color);
  if (key === 'name') av.textContent = (f.name || '？').charAt(0);
});
$('friend-list').addEventListener('change', () => renderSheet());
$('friend-list').addEventListener('click', e => {
  const b = e.target.closest('[data-fdel]'); if (!b) return;
  if (!arm(b, '本当に削除')) return;
  const id = b.closest('.friend').dataset.fid;
  state.friends = friendsOf().filter(f => f.id !== id);
  state.chars.forEach(c => (c.scenarios || []).forEach(sc => { if (sc.friends) sc.friends = sc.friends.filter(x => x !== id); }));
  save(); renderFriends(); renderSheet();
});
$('btn-friends').addEventListener('click', () => { selTab = 'friends'; showSelect(); });
$('sel-friends').addEventListener('click', openFriends);

/* ================= アカウント・クラウド同期（Supabase） ================= */
const CLOUD = Object.assign({
  url: 'https://umrouqvbmnttirdzixvc.supabase.co',
  key: 'sb_publishable_9GwpXgDVVrzCeWjihR6yzQ_uKQsxbia',
}, window.CHARASHEET_CLOUD || {});
const cloudReady = () => /^https:\/\/[\w-]+\.supabase\.co\/?$/.test(CLOUD.url) && CLOUD.key.length > 20 && !!(window.supabase && window.supabase.createClient);
let sb = null, me = null, online = null, syncTimer = null, syncing = false, syncAgain = false, syncState = 'off', syncMsg = '', acctTab = 'login';
const lastSynced = new Map();
function sbClient() {
  if (!sb && cloudReady()) sb = window.supabase.createClient(CLOUD.url.replace(/\/$/, ''), CLOUD.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  return sb;
}
const jaErr = e => {
  const m = String((e && (e.message || e.error_description)) || e || '');
  if (/Invalid login credentials/i.test(m)) return 'ログインできませんでした。このメールアドレスのアカウントがないか、パスワードが違います。アカウントがない場合は、下の「新規アカウント作成へ」から作ってください。';
  if (/Email not confirmed/i.test(m)) return 'メールアドレスの確認がまだです。届いたメールのリンクを押してからログインしてください。';
  if (/already registered|already been registered/i.test(m)) return 'このメールアドレスはすでに登録されています。ログインしてください。';
  if (/duplicate key|profiles_username_lower|23505/i.test(m)) return 'そのユーザー名はすでに使われています。別のユーザー名にしてください。';
  if (/Database error saving new user/i.test(m)) return 'そのユーザー名はすでに使われています。別のユーザー名にしてください。';
  if (/rate limit|too many/i.test(m)) return '短い時間に何度も送信されました。しばらく待ってからもう一度試してください。';
  if (/Password should be/i.test(m)) return 'パスワードが短すぎます。8文字以上にしてください。';
  if (/valid email|invalid email|Unable to validate email/i.test(m)) return 'メールアドレスの形が正しくありません。';
  if (/relation .* does not exist|Could not find the (table|function)/i.test(m)) return 'サーバーの準備（SQLの実行）がまだ終わっていないようです。管理者に伝えてください。';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return 'サーバーにつながりませんでした。ネットの接続を確認してください。';
  return 'うまくいきませんでした：' + m;
};
function setSync(st, msg) { syncState = st; syncMsg = msg || ''; renderAccountBtn(); if (!$('modal-account').hidden) renderAccount(); }
function scheduleSync() { if (!me) return; clearTimeout(syncTimer); syncTimer = setTimeout(flushSync, 1500); if (syncState !== 'pending') setSync('pending'); }
const myChars = () => state.chars.filter(c => !c.sample && (!c.owner || c.owner === me.id));
async function flushSync() {
  if (!sb || !me) return;
  if (syncing) { syncAgain = true; return; }
  syncing = true;
  try {
    const mine = myChars();
    const rows = [];
    mine.forEach(c => { c.owner = me.id; const js = JSON.stringify(c); if (lastSynced.get(c.id) !== js) rows.push([c, js]); });
    if (rows.length) {
      const { error } = await sb.from('characters').upsert(rows.map(([c]) => ({ id: c.id, owner: me.id, name: c.profile.name || '', locked: !!c.locked, data: c, updated_at: new Date(c.updatedAt || Date.now()).toISOString() })));
      if (error) throw error;
      rows.forEach(([c, js]) => lastSynced.set(c.id, js));
    }
    const live = new Set(mine.map(c => c.id));
    const gone = [...lastSynced.keys()].filter(id => !live.has(id));
    if (gone.length) {
      const { error } = await sb.from('characters').delete().in('id', gone);
      if (error) throw error;
      gone.forEach(id => lastSynced.delete(id));
    }
    setSync('ok');
  } catch (e) { setSync('error', jaErr(e)); }
  finally { syncing = false; if (syncAgain) { syncAgain = false; scheduleSync(); } }
}
async function pullAndMerge() {
  setSync('pending');
  const { data, error } = await sb.from('characters').select('id,data,locked,updated_at').eq('owner', me.id);
  if (error) throw error;
  lastSynced.clear();
  (data || []).forEach(r => {
    const sc = Object.assign({}, r.data, { locked: !!r.locked, owner: me.id });
    const i = state.chars.findIndex(c => c.id === r.id);
    if (i < 0) { state.chars.push(sc); lastSynced.set(sc.id, JSON.stringify(sc)); }
    else if ((sc.updatedAt || 0) >= (state.chars[i].updatedAt || 0)) { state.chars[i] = sc; lastSynced.set(sc.id, JSON.stringify(sc)); }
  });
  const real = state.chars.filter(c => !c.sample);
  if (real.length && state.chars.some(c => c.sample)) state.chars = real;
  if (!state.chars.some(c => c.id === state.activeId)) state.activeId = state.chars[0].id;
  saveNow();
  renderAll();
  await flushSync();
}
async function loadFriendships() {
  if (!sb || !me) return;
  const { data, error } = await sb.from('friendships').select('requester,addressee,status');
  if (error) throw error;
  const ids = [...new Set((data || []).flatMap(r => [r.requester, r.addressee]).filter(id => id !== me.id))];
  let profs = [];
  if (ids.length) { const r = await sb.from('profiles').select('id,username').in('id', ids); if (r.error) throw r.error; profs = r.data || []; }
  const nm = id => (profs.find(p => p.id === id) || {}).username || '（退会したユーザー）';
  online = { friends: [], incoming: [], outgoing: [], chars: (online && online.chars) || {}, groups: (online && online.groups) || [] };
  (data || []).forEach(r => {
    const other = r.requester === me.id ? r.addressee : r.requester;
    const u = { id: other, username: nm(other) };
    if (r.status === 'accepted') online.friends.push(u);
    else if (r.addressee === me.id) online.incoming.push(u);
    else online.outgoing.push(u);
  });
  const FC = ['#1f6fe0', '#e0457a', '#2f9e57', '#7b52bd', '#e08a1f', '#12a6cf', '#c0392b', '#8e6e1f'];
  let added = false;
  online.friends.forEach(u => {
    const ex = friendsOf().find(f => f.uid === u.id);
    if (ex) { if (ex.name !== u.username && u.username !== '（退会したユーザー）') { ex.name = u.username; added = true; } }
    else { friendsOf().push({ id: 'u-' + u.id, uid: u.id, name: u.username, color: FC[friendsOf().length % FC.length], note: 'キャラシ工房のフレンド' }); added = true; }
  });
  if (added) { save(); renderSheet(); }
  renderAccountBtn(); renderGroupBadge();
  if (!$('modal-friends').hidden) { renderOnline(); renderFriends(); }
  if (!$('select').hidden && selTab === 'friends') renderSelect();
}
async function handleSession(session) {
  const uid = session && session.user ? session.user.id : null;
  if ((me ? me.id : null) === uid) return;
  if (!uid) { me = null; online = null; lastSynced.clear(); setSync('off'); renderAccount(); renderOnline(); if (!$('select').hidden && selTab === 'friends') renderSelect(); return; }
  me = { id: uid, email: session.user.email, username: (session.user.user_metadata || {}).username || '' };
  renderAccountBtn(); renderAccount();
  try {
    const { data: prof } = await sb.from('profiles').select('username').eq('id', uid).maybeSingle();
    if (prof && prof.username) me.username = prof.username;
    renderAccountBtn(); renderAccount();
    await pullAndMerge();
    await loadFriendships();
    await loadFriendChars();
    await loadGroups();
    if (!$('select').hidden && (selTab === 'friends' || selTab === 'groups')) renderSelect();
  } catch (e) { setSync('error', jaErr(e)); }
}
async function initCloud() {
  renderAccountBtn();
  if (!sbClient()) return;
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') { acctTab = 'recover'; openAccount(); }
    setTimeout(() => handleSession(session), 0);
  });
  try { const { data } = await sb.auth.getSession(); handleSession(data.session); } catch (e) { /* offline */ }
}
async function logout() {
  if (!sb) return;
  await flushSync();
  const uid = me && me.id;
  await sb.auth.signOut();
  if (uid) {
    state.chars = state.chars.filter(c => c.owner !== uid);
    state.friends = friendsOf().filter(f => !f.uid);
    if (!state.chars.length) state.chars = [sample()];
    state.activeId = state.chars[0].id;
  }
  me = null; online = null; lastSynced.clear(); G.list = []; G.err = ''; acctTab = 'login';
  saveNow(); setSync('off'); renderAll(); renderAccount();
  if (!$('select').hidden) renderSelect();
  stopBgm();
  toast('ログアウトしました。この端末からアカウントのキャラシを片付けました（サーバーには残っています）。');
}
function renderAccountBtn() {
  const label = me ? (me.username || 'アカウント') : 'ログイン';
  const dot = me ? `<i class="sync-dot ${syncState}" title="${syncState === 'ok' ? '同期済み' : syncState === 'pending' ? '同期中' : syncState === 'error' ? '同期エラー' : ''}"></i>` : '';
  const req = me && online && online.incoming.length ? `<b class="req-badge">${online.incoming.length}</b>` : '';
  ['btn-account', 'sel-account'].forEach(id => { const b = $(id); if (b) b.innerHTML = `${dot}${esc(label)}${req}`; });
  $('btn-friends').innerHTML = `フレンド${req}`;
  $('sel-friends').innerHTML = `フレンド管理${req}`;
  $('sel-req').innerHTML = req;
}
function renderAccount() {
  const el = $('acct-body'); if (!el) return;
  if (!cloudReady()) {
    el.innerHTML = `<p>アカウント機能はまだ準備中です。サーバー（Supabase）の設定が終わると、ここから登録・ログインできるようになります。</p><p class="empty">それまでは、これまでどおりこのブラウザの中にキャラシが保存されます。</p>`;
    return;
  }
  if (me && acctTab !== 'recover') {
    const st = { ok: '同期済み', pending: '同期中…', error: '同期できませんでした', off: '—' }[syncState];
    el.innerHTML = `<div class="acct-card">
        <span class="fav" style="--fc:var(--sky)">${esc((me.username || '？').charAt(0))}</span>
        <div><b class="acct-name">${esc(me.username)}</b><span class="acct-mail">${esc(me.email || '')}</span></div>
      </div>
      <form class="acct-rename" data-form="rename">
        <label for="ac-newname">ユーザー名（フレンドに見える名前・2〜20文字）</label>
        <div class="row"><input class="inp" id="ac-newname" maxlength="20" autocomplete="username" value="${esc(me.username)}"><button class="btn" type="submit">変更する</button></div>
        <p class="err" id="ac-err" role="alert"></p><p class="ok-msg" id="ac-ok" role="status"></p>
      </form>
      <div class="acct-sync ${syncState}"><i class="sync-dot ${syncState}"></i>${st}${syncMsg ? `<small>${esc(syncMsg)}</small>` : ''}</div>
      <p>キャラシは自動でサーバーに保存され、ほかの端末でログインしても同じキャラが使えます。フレンドには、<b>非公開（ロック）にしていないキャラシ</b>だけが見えます。ロックはシート上部の「フレンドに公開／非公開」ボタンで切り替えます。</p>
      <div class="acct-actions"><button class="btn" type="button" data-acct="sync">今すぐ同期</button><button class="btn" type="button" data-acct="friends">フレンド</button><button class="btn danger" type="button" data-acct="logout">ログアウト</button></div>`;
    return;
  }

  const f = {
    login: `<div class="acct-mode"><b>ログイン</b><span>登録済みのアカウントで入ります</span></div>
      <form class="acct-form" data-form="login">
        <label>ログインID（メールアドレス）<input class="inp" type="email" id="ac-email" autocomplete="email" required></label>
        <label>パスワード<input class="inp" type="password" id="ac-pass" autocomplete="current-password" required></label>
        <button class="btn primary" type="submit">ログイン</button>
        <p class="err" id="ac-err" role="alert"></p>
        <button class="linkish" type="button" data-tab="reset">パスワードを忘れたとき</button>
      </form>
      <div class="acct-switch">アカウントをお持ちでない方は<button class="btn small" type="button" data-tab="signup">新規アカウント作成へ</button></div>`,
    signup: `<div class="acct-mode signup"><b>新規アカウント作成</b><span>はじめての方はこちら。ログインではありません</span></div>
      <form class="acct-form" data-form="signup">
        <label>ユーザー名（フレンドに見える名前・2〜20文字）<input class="inp" id="ac-user" autocomplete="username" maxlength="20" required></label>
        <label>ログインID（メールアドレス）<input class="inp" type="email" id="ac-email" autocomplete="email" required></label>
        <label>パスワード（8文字以上）<input class="inp" type="password" id="ac-pass" autocomplete="new-password" minlength="8" required></label>
        <label>パスワード（確認のため、もう一度）<input class="inp" type="password" id="ac-pass2" autocomplete="new-password" minlength="8" required></label>
        <button class="btn primary" type="submit">この内容でアカウントを作る</button>
        <p class="err" id="ac-err" role="alert"></p>
        <p class="empty">登録すると、このブラウザにあるキャラシもアカウントに保存されます。</p>
      </form>
      <div class="acct-switch">すでにアカウントをお持ちの方は<button class="btn small" type="button" data-tab="login">ログインへ戻る</button></div>`,
    reset: `<form class="acct-form" data-form="reset">
        <p>登録したメールアドレスに、パスワードを変えるためのリンクを送ります。</p>
        <label>ログインID（メールアドレス）<input class="inp" type="email" id="ac-email" autocomplete="email" required></label>
        <button class="btn primary" type="submit">リンクを送る</button>
        <button class="linkish" type="button" data-tab="login">ログインに戻る</button>
      </form>`,
    recover: `<form class="acct-form" data-form="recover">
        <p>新しいパスワードを決めてください。</p>
        <label>新しいパスワード（8文字以上）<input class="inp" type="password" id="ac-pass" autocomplete="new-password" minlength="8" required></label>
        <button class="btn primary" type="submit">パスワードを変える</button>
      </form>`,
  };
  el.innerHTML = f[acctTab] + (/id="ac-err"/.test(f[acctTab]) ? '' : '<p class="err" id="ac-err" role="alert"></p>') + '<p class="ok-msg" id="ac-ok" role="status"></p>';
}
function openAccount() { if (acctTab !== 'recover') acctTab = 'login'; renderAccount(); openModal('modal-account'); }
$('acct-body').addEventListener('click', async e => {
  const t = e.target.closest('[data-tab]');
  if (t) { acctTab = t.dataset.tab; renderAccount(); $('ac-email')?.focus(); return; }
  const a = e.target.closest('[data-acct]'); if (!a) return;
  if (a.dataset.acct === 'sync') { try { await pullAndMerge(); await loadFriendships(); toast('同期しました。'); } catch (er) { setSync('error', jaErr(er)); } }
  if (a.dataset.acct === 'friends') { closeModals(); openFriends(); }
  if (a.dataset.acct === 'logout') { if (!arm(a, 'もう一度押すとログアウト')) return; closeModals(); logout(); }
});
$('acct-body').addEventListener('submit', async e => {
  e.preventDefault();
  if (!sbClient()) return;
  const form = e.target, kind = form.dataset.form, err = $('ac-err'), ok = $('ac-ok');
  const btn = form.querySelector('button[type=submit]');
  if (kind === 'rename') {
    err.textContent = ''; ok.textContent = '';
    const name = ($('ac-newname').value || '').trim();
    if (!me) return;
    if (!/^[^\s]{2,20}$/.test(name)) { err.textContent = 'ユーザー名は空白なしの2〜20文字にしてください。'; return; }
    if (name === me.username) { err.textContent = '今のユーザー名と同じです。'; return; }
    btn.disabled = true;
    try {
      if (name.toLowerCase() !== (me.username || '').toLowerCase()) {
        const av = await sb.rpc('username_available', { name });
        if (av.error) throw av.error;
        if (av.data === false) { err.textContent = 'そのユーザー名はすでに使われています。別のユーザー名にしてください。'; return; }
      }
      const { error } = await sb.from('profiles').update({ username: name }).eq('id', me.id);
      if (error) throw error;
      sb.auth.updateUser({ data: { username: name } }).catch(() => {});
      const old = me.username;
      me.username = name;
      renderAccountBtn(); renderAccount();
      if (!$('modal-friends').hidden) renderOnline();
      $('ac-ok').textContent = `ユーザー名を「${old}」から「${name}」に変更しました。フレンドにも新しい名前で表示されます。`;
      fxAt($('ac-newname'), true);
    } catch (er) { err.textContent = jaErr(er); }
    finally { btn.disabled = false; }
    return;
  }
  err.textContent = ''; ok.textContent = '';
  const email = ($('ac-email')?.value || '').trim(), pass = $('ac-pass')?.value || '';
  btn.disabled = true;
  try {
    if (kind === 'login') {
      const { error } = await sb.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      closeModals(); toast('ログインしました。');
    } else if (kind === 'signup') {
      const username = ($('ac-user').value || '').trim();
      if (!/^[^\s]{2,20}$/.test(username)) { err.textContent = 'ユーザー名は空白なしの2〜20文字にしてください。'; return; }
      if (pass.length < 8) { err.textContent = 'パスワードは8文字以上にしてください。'; return; }
      if (pass !== ($('ac-pass2').value || '')) { err.textContent = '確認用のパスワードが一致しません。同じパスワードを2回入れてください。'; return; }
      const av = await sb.rpc('username_available', { name: username });
      if (av.error) throw av.error;
      if (av.data === false) { err.textContent = 'そのユーザー名はすでに使われています。別のユーザー名にしてください。'; return; }
      const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { username }, emailRedirectTo: location.origin + location.pathname } });
      if (error) {
        if (/already registered|already been registered|already exists/i.test(error.message || '')) {
          acctTab = 'login'; renderAccount(); $('ac-email').value = email;
          $('ac-err').textContent = 'このメールアドレスはすでに登録されています。新しいアカウントは作らずに、ログインしてください。';
          return;
        }
        throw error;
      }
      if (data && data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        acctTab = 'login'; renderAccount(); $('ac-email').value = email;
        $('ac-err').textContent = 'このメールアドレスはすでに登録されています。新しいアカウントは作らずに、ログインしてください。';
        return;
      }
      if (data && data.session) { acctTab = 'login'; closeModals(); toast(`ようこそ、${username}さん。登録できました。`); }
      else { acctTab = 'login'; renderAccount(); $('ac-ok').textContent = '確認メールを送りました。メールのリンクを押してから、ここでログインしてください。'; }
    } else if (kind === 'reset') {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
      if (error) throw error;
      ok.textContent = 'メールを送りました。届いたリンクから新しいパスワードを決めてください。';
    } else if (kind === 'recover') {
      if (pass.length < 8) { err.textContent = 'パスワードは8文字以上にしてください。'; return; }
      const { error } = await sb.auth.updateUser({ password: pass });
      if (error) throw error;
      acctTab = 'login'; closeModals(); toast('パスワードを変更しました。');
    }
  } catch (er) { err.textContent = jaErr(er); }
  finally { btn.disabled = false; }
});
$('btn-account').addEventListener('click', openAccount);
$('sel-account').addEventListener('click', openAccount);

/* ---- オンラインのフレンド ---- */
function renderOnline() {
  const el = $('online-friends'); if (!el) return;
  const head = '<div class="ol-head"><b>オンラインのフレンド</b><span class="hint">お互いのキャラシ（非公開以外）が見られます</span></div>';
  if (!cloudReady()) { el.innerHTML = `<div class="ol-box">${head}<p class="empty">アカウント機能の準備ができると、ユーザー名でフレンドを追加して、お互いのキャラシを見られるようになります。</p></div>`; return; }
  if (!me) { el.innerHTML = `<div class="ol-box">${head}<p>ログインすると、相手のユーザー名でフレンド申請を送れます。相手が承認すると、お互いのキャラシ一覧が見られるようになります。</p><button class="btn primary small" type="button" data-ol="login">ログイン・新規登録</button></div>`; return; }
  const o = online || { friends: [], incoming: [], outgoing: [] };
  const av = u => `<span class="fav sm" style="--fc:${esc((friendsOf().find(f => f.uid === u.id) || {}).color || 'var(--sky)')}">${esc((u.username || '？').charAt(0))}</span>`;
  el.innerHTML = `<div class="ol-box">${head}
    <p class="ol-me">あなたのユーザー名：<b>${esc(me.username)}</b>（これを友達に教えると申請してもらえます）</p>
    <form class="ol-search" id="ol-search"><input class="inp" id="ol-name" placeholder="相手のユーザー名" autocomplete="off" aria-label="相手のユーザー名"><button class="btn primary" type="submit">フレンド申請</button></form>
    <p class="err" id="ol-err" role="alert"></p>
    ${o.incoming.length ? `<div class="ol-sec"><span class="lbl">届いた申請</span>${o.incoming.map(u => `<div class="ol-row">${av(u)}<b>${esc(u.username)}</b><span class="sp"></span><button class="btn small primary" type="button" data-ol="accept" data-uid="${u.id}">承認</button><button class="btn small" type="button" data-ol="remove" data-uid="${u.id}">断る</button></div>`).join('')}</div>` : ''}
    ${o.outgoing.length ? `<div class="ol-sec"><span class="lbl">申請中</span>${o.outgoing.map(u => `<div class="ol-row">${av(u)}<b>${esc(u.username)}</b><span class="hint">承認待ち</span><span class="sp"></span><button class="btn small" type="button" data-ol="remove" data-uid="${u.id}">取り消す</button></div>`).join('')}</div>` : ''}
    <div class="ol-sec"><span class="lbl">フレンド（${o.friends.length}人）</span>${o.friends.length ? o.friends.map(u => `<div class="ol-row">${av(u)}<b>${esc(u.username)}</b><span class="sp"></span><button class="btn small primary" type="button" data-ol="view" data-uid="${u.id}" data-name="${esc(u.username)}">キャラシを見る</button><button class="btn small danger" type="button" data-ol="unfriend" data-uid="${u.id}">解除</button></div>`).join('') : '<p class="empty">まだいません。相手のユーザー名で申請してみましょう。</p>'}</div>
  </div>`;
}
const pairFilter = (a, b) => `and(requester.eq.${a},addressee.eq.${b}),and(requester.eq.${b},addressee.eq.${a})`;
$('online-friends').addEventListener('submit', async e => {
  e.preventDefault();
  const name = ($('ol-name').value || '').trim(), err = $('ol-err');
  err.textContent = '';
  if (!name) return;
  try {
    const { data: p, error } = await sb.from('profiles').select('id,username').ilike('username', name.replace(/[%_\\]/g, '\\$&')).maybeSingle();
    if (error) throw error;
    if (!p) { err.textContent = `「${name}」というユーザーは見つかりませんでした。つづりを確かめてください。`; return; }
    if (p.id === me.id) { err.textContent = '自分自身はフレンドに追加できません。'; return; }
    const o = online || { friends: [], incoming: [], outgoing: [] };
    if (o.friends.some(u => u.id === p.id)) { err.textContent = `${p.username}さんはもうフレンドです。`; return; }
    if (o.outgoing.some(u => u.id === p.id)) { err.textContent = `${p.username}さんには申請済みです。承認を待ってください。`; return; }
    if (o.incoming.some(u => u.id === p.id)) {
      const r = await sb.from('friendships').update({ status: 'accepted' }).eq('requester', p.id).eq('addressee', me.id);
      if (r.error) throw r.error;
      toast(`${p.username}さんからの申請を承認しました。`);
    } else {
      const r = await sb.from('friendships').insert({ requester: me.id, addressee: p.id });
      if (r.error) throw r.error;
      toast(`${p.username}さんにフレンド申請を送りました。`);
    }
    $('ol-name').value = '';
    await loadFriendships(); renderOnline(); renderFriends();
  } catch (er) { err.textContent = jaErr(er); }
});
$('online-friends').addEventListener('click', async e => {
  const b = e.target.closest('[data-ol]'); if (!b) return;
  const uid = b.dataset.uid;
  try {
    if (b.dataset.ol === 'login') { closeModals(); acctTab = 'login'; openAccount(); return; }
    if (b.dataset.ol === 'view') { viewFriend(uid, b.dataset.name); return; }
    if (b.dataset.ol === 'accept') {
      const r = await sb.from('friendships').update({ status: 'accepted' }).eq('requester', uid).eq('addressee', me.id);
      if (r.error) throw r.error;
      toast('フレンドになりました。');
    }
    if (b.dataset.ol === 'remove' || b.dataset.ol === 'unfriend') {
      if (b.dataset.ol === 'unfriend' && !arm(b, '本当に解除')) return;
      const r = await sb.from('friendships').delete().or(pairFilter(me.id, uid));
      if (r.error) throw r.error;
      if (b.dataset.ol === 'unfriend') {
        state.friends = friendsOf().map(f => f.uid === uid ? Object.assign({}, f, { uid: undefined, note: f.note === 'キャラシ工房のフレンド' ? '' : f.note }) : f);
        save();
      }
    }
    await loadFriendships(); renderOnline(); renderFriends();
  } catch (er) { toast(jaErr(er)); }
});

/* ---- フレンドのキャラシを見る（読み取り専用） ---- */
let fviewChars = [], fviewName = '';
async function viewFriend(uid, name) {
  fviewName = name || 'フレンド';
  $('fview-title').textContent = `${fviewName}さんのキャラシ`;
  $('fview-body').innerHTML = '<p class="empty">読み込み中…</p>';
  openModal('modal-fview');
  try {
    const { data, error } = await sb.from('characters').select('id,data,locked,updated_at').eq('owner', uid);
    if (error) throw error;
    fviewChars = (data || []).map(r => r.data).filter(c => c && c.v === 2 && SYS[c.system] && c.profile);
    renderFviewList();
  } catch (er) { $('fview-body').innerHTML = `<p class="err">${esc(jaErr(er))}</p>`; }
}
function renderFviewList() {
  $('fview-title').textContent = `${fviewName}さんのキャラシ`;
  $('fview-body').innerHTML = fviewChars.length
    ? `<div class="fv-grid">${fviewChars.map((c, i) => `<button class="fv-card" type="button" data-fv="${i}">${tokenHtml(c)}<span class="sel-name">${esc(c.profile.name || '名無し')}</span><span class="sel-sys">${esc(SYS[c.system].short)}${c.profile.occupation ? ' ・ ' + esc(c.profile.occupation) : ''}</span></button>`).join('')}</div>`
    : '<p class="empty">公開されているキャラシはまだありません。</p>';
  if (!reduceMotion.matches) $('fview-body').querySelectorAll('.fv-card').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(12px) scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 50, easing: 'cubic-bezier(.2, .9, .3, 1.2)', fill: 'backwards' }));
}
function sheetViewHtml(c) {
  const d = compute(c), a = d.a, p = c.profile, S = SYS[c.system], src = portraitSrc(c);
  const bars = [['HP', d.hp, d.hpMax, 'var(--hp), var(--orange)'], ['MP', d.mp, d.mpMax, 'var(--mp), var(--cyan)'], ['SAN', d.san, d.sanMax, 'var(--san), var(--pink)']];
  const prof = [['職業', p.occupation], ['年齢', p.age], ['誕生日', p.birthday], ['性別', p.sex], ['身長', p.height], ['体重', p.weight], ['出身', p.origin], ['髪の色', p.hair], ['瞳の色', p.eyes], ['肌の色', p.skin]].filter(([, v]) => v);
  const list = (arr, f) => arr.filter(x => x.name).map(f).join('');
  return `<div class="sv">
    <div class="sv-top">
      <div class="sv-art">${src ? `<img src="${esc(imgSrc(src))}" alt="${esc(p.name || '')}の立ち絵" onerror="this.remove()">` : tokenHtml(c)}</div>
      <div class="sv-id">
        <span class="peek-sys">${esc(S.label)}</span>
        <h3 class="sv-name">${esc(p.name || '名無し')}</h3>
        ${p.kana ? `<span class="peek-kana">${esc(p.kana)}</span>` : ''}
        ${prof.length ? `<dl class="sv-prof">${prof.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
        <div class="pbars">${bars.map(([l, v, m, g]) => `<div class="pbar"><b>${l}</b><span class="tr"><i style="width:${m > 0 ? Math.max(0, Math.min(100, v / m * 100)) : 0}%;background:linear-gradient(90deg, ${g})"></i></span><span>${v}/${m}</span></div>`).join('')}</div>
        <div class="sv-actions"><button class="btn primary small" type="button" data-fvcopy>ココフォリア用にコピー</button><span class="copy-status" id="fv-status" role="status"></span></div>
      </div>
    </div>
    <div class="sv-grid">
      <figure class="chart-fig"><figcaption>能力値チャート</figcaption>${radarSvg(c, a, 280, true)}</figure>
      <div class="derived sv-der">
        <div class="dv"><span class="lbl">アイデア</span><span class="val">${d.idea}</span></div>
        <div class="dv"><span class="lbl">幸運</span><span class="val">${d.luck}</span></div>
        <div class="dv"><span class="lbl">知識</span><span class="val">${d.know}</span></div>
        <div class="dv"><span class="lbl">ダメージ・ボーナス</span><span class="val">${esc(d.db)}</span></div>
        ${c.system === 'coc7' ? `<div class="dv"><span class="lbl">ビルド</span><span class="val">${d.build}</span></div><div class="dv"><span class="lbl">MOV</span><span class="val">${d.mov}</span></div>` : ''}
      </div>
    </div>
    <figure class="chart-fig"><figcaption>技能グラフ <span class="legend"><i class="sw sw-init"></i>初期値<i class="sw sw-add"></i>振ったポイント</span></figcaption>${skillBarsHtml(c, a, true)}</figure>
    ${list(c.weapons || [], w => `<div class="sv-item"><b>${esc(w.name)}</b><span>成功率 ${esc(w.rate || '—')} ・ ダメージ ${esc(w.damage || '—')}${w.range ? ' ・ 射程 ' + esc(w.range) : ''}</span></div>`) ? `<div class="sv-sec"><h4>武器</h4>${list(c.weapons || [], w => `<div class="sv-item"><b>${esc(w.name)}</b><span>成功率 ${esc(w.rate || '—')} ・ ダメージ ${esc(w.damage || '—')}${w.range ? ' ・ 射程 ' + esc(w.range) : ''}</span></div>`)}</div>` : ''}
    ${list(c.items || [], it => `<span class="sv-chip">${esc(it.name)}${it.count ? ' ×' + esc(it.count) : ''}</span>`) ? `<div class="sv-sec"><h4>所持品</h4><div class="sv-chips">${list(c.items || [], it => `<span class="sv-chip">${esc(it.name)}${it.count ? ' ×' + esc(it.count) : ''}</span>`)}</div></div>` : ''}
    ${list(c.scenarios || [], sc => `<span class="sv-chip">「${esc(sc.name)}」${sc.date ? ' ' + esc(sc.date) : ''}</span>`) ? `<div class="sv-sec"><h4>通過シナリオ</h4><div class="sv-chips">${list(c.scenarios || [], sc => `<span class="sv-chip">「${esc(sc.name)}」${sc.date ? ' ' + esc(sc.date) : ''}</span>`)}</div></div>` : ''}
    ${c.backstory ? `<div class="sv-sec"><h4>経歴</h4><p class="sv-text">${esc(c.backstory)}</p></div>` : ''}
    ${c.memo ? `<div class="sv-sec"><h4>メモ</h4><p class="sv-text">${esc(c.memo)}</p></div>` : ''}
  </div>`;
}
let fviewCur = null;
$('fview-body').addEventListener('click', e => {
  const card = e.target.closest('[data-fv]');
  if (card) {
    fviewCur = fviewChars[+card.dataset.fv];
    $('fview-title').innerHTML = `<button class="btn small ghost fv-back" type="button" data-fvback>← 一覧へ</button> ${esc(fviewCur.profile.name || '名無し')}`;
    $('fview-body').innerHTML = sheetViewHtml(fviewCur);
    $('fview-body').scrollTop = 0;
    return;
  }
  if (e.target.closest('[data-fvcopy]') && fviewCur) {
    copyText(JSON.stringify(toCcfolia(fviewCur)), $('fv-status'), null).then(ok => { if (ok) fxAt(e.target.closest('[data-fvcopy]'), true); });
    return;
  }
});
$('fview-title').addEventListener('click', e => { if (e.target.closest('[data-fvback]')) { fviewCur = null; renderFviewList(); } });

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

/* ================= アイコンの調整（拡大・位置） ================= */
let iconEd = null;
function renderIconPreview() {
  const c = active(), src = iconEd.src;
  $('ico-stage').innerHTML = src ? `<img id="ico-img" src="${esc(imgSrc(src))}" alt="" draggable="false" style="${cropStyle(iconEd.crop)}">` : `<span class="ico-none">画像がありません。<br>下の「アイコン用の画像を選ぶ」か、プロフィールで立ち絵を設定してください。</span>`;
  $('ico-zoom').value = iconEd.crop.z; $('ico-zoom-v').textContent = Math.round(iconEd.crop.z * 100) + '%';
  $('ico-mini').innerHTML = [56, 34, 22].map(sz => `<span class="token" style="--tc:${esc(c.profile.color || '#1f6fe0')};width:${sz}px;height:${sz}px">${src ? `<img src="${esc(imgSrc(src))}" alt="" style="${cropStyle(iconEd.crop)}">` : esc(initial(c))}</span>`).join('');
  $('ico-own').hidden = !iconEd.src || iconEd.src !== iconEd.own;
}
function openIconEditor() {
  const c = active();
  iconEd = { own: c.icon || '', src: iconSrc(c), crop: Object.assign({ x: 50, y: 15, z: 1 }, c.iconCrop || {}) };
  renderIconPreview(); openModal('modal-icon');
}
function updateIconImg() { const im = $('ico-img'); if (im) im.setAttribute('style', cropStyle(iconEd.crop)); renderIconMini(); $('ico-zoom-v').textContent = Math.round(iconEd.crop.z * 100) + '%'; }
function renderIconMini() { $('ico-mini').querySelectorAll('img').forEach(im => im.setAttribute('style', cropStyle(iconEd.crop))); }
(() => {
  const st = $('ico-stage'); let drag = null;
  st.addEventListener('pointerdown', e => { if (!iconEd || !iconEd.src) return; drag = { x: e.clientX, y: e.clientY, cx: iconEd.crop.x, cy: iconEd.crop.y }; st.setPointerCapture(e.pointerId); st.classList.add('drag'); });
  st.addEventListener('pointermove', e => {
    if (!drag) return;
    const w = st.clientWidth, k = 100 / (w * iconEd.crop.z) * 1.6;
    iconEd.crop.x = Math.max(0, Math.min(100, drag.cx - (e.clientX - drag.x) * k));
    iconEd.crop.y = Math.max(0, Math.min(100, drag.cy - (e.clientY - drag.y) * k));
    updateIconImg();
  });
  const end = () => { drag = null; st.classList.remove('drag'); };
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
  st.addEventListener('wheel', e => { if (!iconEd || !iconEd.src) return; e.preventDefault(); iconEd.crop.z = Math.max(1, Math.min(5, +(iconEd.crop.z - e.deltaY * .002).toFixed(2))); $('ico-zoom').value = iconEd.crop.z; updateIconImg(); }, { passive: false });
  st.addEventListener('keydown', e => {
    if (!iconEd || !iconEd.src) return;
    const step = e.shiftKey ? 5 : 1, m = { ArrowLeft: ['x', step], ArrowRight: ['x', -step], ArrowUp: ['y', step], ArrowDown: ['y', -step] }[e.key];
    if (!m) return; e.preventDefault();
    iconEd.crop[m[0]] = Math.max(0, Math.min(100, iconEd.crop[m[0]] + m[1])); updateIconImg();
  });
})();
$('ico-zoom').addEventListener('input', e => { iconEd.crop.z = +e.target.value; updateIconImg(); });
$('ico-reset').addEventListener('click', () => { iconEd.crop = { x: 50, y: 15, z: 1 }; renderIconPreview(); });
$('ico-own').addEventListener('click', () => { iconEd.own = ''; iconEd.src = portraitSrc(active()); iconEd.crop = { x: 50, y: 15, z: 1 }; renderIconPreview(); });
$('ico-file').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try { iconEd.own = await loadImageData(f, 600, .86); iconEd.src = iconEd.own; iconEd.crop = { x: 50, y: 50, z: 1 }; renderIconPreview(); }
  catch (er) { toast(er.message); }
});
function renderAvatar(src, crop, size = 128) {
  return new Promise(res => {
    if (!src) return res('');
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      try {
        const cv = document.createElement('canvas'); cv.width = cv.height = size;
        const g = cv.getContext('2d');
        const sc = Math.max(size / im.width, size / im.height);
        const w = im.width * sc, h = im.height * sc;
        const ox = (size - w) * crop.x / 100, oy = (size - h) * crop.y / 100;
        const px = size * crop.x / 100, py = size * crop.y / 100;
        g.translate(px, py); g.scale(crop.z, crop.z); g.translate(-px, -py);
        g.drawImage(im, ox, oy, w, h);
        let url = cv.toDataURL('image/webp', .85);
        if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/png');
        res(url);
      } catch (e) { res(''); }
    };
    im.onerror = () => res('');
    im.src = imgSrc(src);
  });
}
$('ico-save').addEventListener('click', async () => {
  const c = active();
  c.icon = iconEd.own || '';
  c.iconCrop = { x: +iconEd.crop.x.toFixed(1), y: +iconEd.crop.y.toFixed(1), z: +(+iconEd.crop.z).toFixed(2) };
  c.avatar = await renderAvatar(iconEd.src, c.iconCrop);
  touch(); renderAll(); closeModals();
  toast('アイコンを保存しました。');
});

/* ================= 並べ替え ================= */
const SORT_LABEL = { created: ['新しい順', '古い順'], name: ['あ→ん', 'ん→あ'], age: ['若い順', '年上順'], birthday: ['1月→12月', '12月→1月'], updated: ['最近順', '昔順'], system: ['6版→7版', '7版→6版'] };
function bdayKey(t) {
  t = toHalf(t || '');
  let m = t.match(/(\d{4})\s*[\/\-.年]\s*(\d{1,2})\s*[\/\-.月]\s*(\d{1,2})/);
  if (m) return +m[2] * 100 + +m[3];
  m = t.match(/(\d{1,2})\s*[月\/\-.]\s*(\d{1,2})/);
  if (m) return +m[1] * 100 + +m[2];
  m = t.match(/(\d{1,2})\s*月/);
  return m ? +m[1] * 100 : null;
}
function ageKey(t) { const m = toHalf(t || '').match(/\d+/); return m ? +m[0] : null; }
function sortedChars() {
  const key = state.sortKey || 'created', desc = !!state.sortDesc;
  const list = state.chars.map((c, i) => ({ c, i }));
  const val = ({ c, i }) => {
    switch (key) {
      case 'name': { const n = (c.profile.kana || c.profile.name || '').trim(); return n || null; }
      case 'age': return ageKey(c.profile.age);
      case 'birthday': return bdayKey(c.profile.birthday);
      case 'updated': return -(c.updatedAt || 0);
      case 'system': return c.system === 'coc7' ? 7 : 6;
      default: return i;
    }
  };
  list.forEach(x => { x.v = val(x); });
  list.sort((a, b) => {
    if (a.v == null && b.v == null) return a.i - b.i;
    if (a.v == null) return 1;
    if (b.v == null) return -1;
    const d = typeof a.v === 'string' ? a.v.localeCompare(b.v, 'ja') : a.v - b.v;
    return (desc ? -d : d) || a.i - b.i;
  });
  return list.map(x => x.c);
}
function sortValueText(c) {
  switch (state.sortKey) {
    case 'age': return c.profile.age ? c.profile.age + '歳' : '年齢未設定';
    case 'birthday': return c.profile.birthday ? '誕生日 ' + c.profile.birthday : '誕生日未設定';
    case 'updated': { const d = new Date(c.updatedAt || 0); return c.updatedAt ? `${d.getMonth() + 1}/${d.getDate()} 更新` : ''; }
    default: return '';
  }
}
function renderSortBar() {
  $('sel-sort').hidden = selTab !== 'mine';
  $('sort-key').value = state.sortKey || 'created';
  const lab = SORT_LABEL[state.sortKey || 'created'];
  $('sort-dir').innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 4v12M3 13l3 3 3-3M14 16V4M11 7l3-3 3 3"/></svg>${lab[state.sortDesc ? 1 : 0]}`;
  document.querySelectorAll('[data-view]').forEach(b => { const on = b.dataset.view === (state.selView || 'orbit'); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
}
function listViewHtml(chars) {
  return `<button class="sel-list-new" type="button" id="sel-new"><span class="plus">＋</span>新しい探索者をつくる</button>
  <ol class="sel-list">${chars.map((c, i) => {
    const p = c.profile;
    return `<li><button class="sel-row" type="button" data-id="${c.id}" aria-label="${esc(p.name || '名無し')}のシートを開く">
      <span class="sr-rank">${i + 1}</span>${tokenHtml(c)}
      <span class="sr-name"><b>${esc(p.name || '名無し')}</b><small>${esc(p.kana || '')}</small></span>
      <span class="sr-meta"><span><i>年齢</i>${esc(p.age ? p.age + '歳' : '—')}</span><span><i>誕生日</i>${esc(p.birthday || '—')}</span><span><i>職業</i>${esc(p.occupation || '—')}</span><span><i>版</i>${esc(SYS[c.system].short)}</span></span>
      <span class="sr-flags">${c.bgm ? '<em title="BGMあり">♪</em>' : ''}${c.locked ? '<em class="lk" title="フレンドに非公開">非公開</em>' : ''}</span>
    </button></li>`;
  }).join('')}</ol>`;
}
$('sel-sort').addEventListener('change', e => { if (e.target.id === 'sort-key') { state.sortKey = e.target.value; state.sortDesc = false; save(); renderSelect(); popSelect(); renderShelf(); } });
$('sel-sort').addEventListener('click', e => {
  if (e.target.closest('#sort-dir')) { state.sortDesc = !state.sortDesc; save(); renderSelect(); popSelect(); renderShelf(); return; }
  const v = e.target.closest('[data-view]');
  if (v && v.dataset.view !== (state.selView || 'orbit')) { state.selView = v.dataset.view; save(); renderSelect(); popSelect(); }
});

/* ---- フレンド一覧（探索者をえらぶ画面の「フレンド」タブ） ---- */
let selTab = 'mine';
function ringLayout(n, W, B) {
  const small = W < 560, pos = [], radii = [];
  let r = small ? Math.min(150, W / 2 - (B + 44) / 2 - 4) : 210, ring = 0, idx = 0;
  const ky = small ? 1.45 : 1;
  while (idx < n && r >= 100) {
    if (r + (B + 44) / 2 > W / 2) break;
    const cap = Math.max(5, Math.floor(2 * Math.PI * r / (B + 54)));
    const k = Math.min(cap, n - idx);
    for (let j = 0; j < k; j++) { const ang = -Math.PI / 2 + (j + (ring % 2) * .5) / k * 2 * Math.PI; pos.push([r * Math.cos(ang), r * ky * Math.sin(ang)]); }
    radii.push(r); idx += k; r += B + 62; ring++;
  }
  return { pos, radii: radii.length ? radii : [small ? Math.min(150, W / 2 - (B + 44) / 2 - 4) : 210], idx, ky, small };
}
function renderFriendSelect(stage) {
  const W = stage.clientWidth || Math.min(1100, innerWidth - 32);
  const B = W < 560 ? 70 : 96;
  const L = ringLayout(0, W, B);
  const rings = rr => `<svg class="sel-rings" aria-hidden="true">${rr.map(r => `<ellipse cx="50%" cy="50%" rx="${r}" ry="${(r * L.ky).toFixed(1)}"/>`).join('')}<circle cx="50%" cy="50%" r="${L.small ? 80 : 112}"/></svg>`;
  stage.classList.remove('grid');
  if (!cloudReady() || !me) {
    stage.style.height = (L.small ? 380 : 460) + 'px';
    stage.innerHTML = `${rings(L.radii)}<button class="sel-new" type="button" id="sel-login"><span class="plus">⟶</span><b>ログイン</b><small>SIGN IN</small></button>
      <p class="sel-empty">${!cloudReady() ? 'アカウント機能の準備中です。' : 'ログインすると、フレンドとキャラシを見せ合えます。'}</p>`;
    return;
  }
  const o = online || { friends: [], incoming: [], outgoing: [], chars: {} };
  const items = [...o.incoming.map(u => ({ u, kind: 'in' })), ...o.friends.map(u => ({ u, kind: 'fr' })), ...o.outgoing.map(u => ({ u, kind: 'out' }))];
  const lay = ringLayout(items.length, W, B);
  const H = Math.max(L.small ? 380 : 480, 2 * (lay.radii[lay.radii.length - 1] * lay.ky + B / 2 + 60));
  const colorOf = u => (friendsOf().find(f => f.uid === u.id) || {}).color || '#1f6fe0';
  const bubble = ({ u, kind }, i, xy) => {
    const chars = (o.chars || {})[u.id] || [];
    const sub = kind === 'fr' ? (o.chars && o.chars[u.id] !== undefined ? `公開キャラ ${chars.length}人` : '公開キャラ …') : kind === 'in' ? '申請が届いています' : '承認待ち';
    const minis = kind === 'fr' && chars.length ? `<span class="sel-minis">${chars.slice(0, 4).map(ch => `<i style="--tc:${esc(ch.color)}">${ch.avatar ? `<img src="${esc(ch.avatar)}" alt="">` : esc((ch.name || '？').charAt(0))}</i>`).join('')}${chars.length > 4 ? `<i class="more">+${chars.length - 4}</i>` : ''}</span>` : '';
    return `<button class="sel-char sel-friend ${kind}" type="button" data-fuid="${u.id}" data-fname="${esc(u.username)}" data-kind="${kind}" style="--i:${i};--B:${B}px${xy ? `;left:calc(50% + ${xy[0].toFixed(1)}px);top:calc(50% + ${xy[1].toFixed(1)}px)` : ''}" aria-label="${esc(u.username)}${kind === 'fr' ? 'さんのキャラシを見る' : kind === 'in' ? 'さんからの申請を確認する' : 'さん（承認待ち）'}">
      <span class="token" style="--tc:${esc(colorOf(u))}">${esc((u.username || '？').charAt(0))}</span>${kind === 'in' ? '<span class="sel-reqmark">申請</span>' : ''}
      <span class="sel-name">${esc(u.username)}</span><span class="sel-sys">${sub}</span>${minis}
    </button>`;
  };
  stage.style.height = H + 'px';
  stage.innerHTML = `${rings(lay.radii)}<button class="sel-new" type="button" id="sel-addfriend"><span class="plus">＋</span><b>フレンドを追加</b><small>ADD FRIEND</small></button>
    ${items.slice(0, lay.idx).map((it, i) => bubble(it, i, lay.pos[i])).join('')}
    ${items.length ? '' : '<p class="sel-empty">まだフレンドがいません。真ん中から、友達のユーザー名で申請しましょう。</p>'}`;
  const rest = items.slice(lay.idx);
  if (rest.length) stage.insertAdjacentHTML('afterend', `<div class="sel-grid sel-rest" id="sel-rest">${rest.map((it, i) => bubble(it, lay.idx + i)).join('')}</div>`);
}
async function loadFriendChars() {
  if (!sb || !me || !online) return;
  const ids = online.friends.map(u => u.id);
  const map = {};
  ids.forEach(id => { map[id] = []; });
  if (ids.length) {
    const { data, error } = await sb.from('characters').select('id,owner,name,color:data->profile->>color,avatar:data->>avatar').in('owner', ids);
    if (error) throw error;
    (data || []).forEach(r => { (map[r.owner] = map[r.owner] || []).push({ id: r.id, avatar: r.avatar || '', name: r.name || (r.data && r.data.profile && r.data.profile.name) || '', color: r.color || (r.data && r.data.profile && r.data.profile.color) || '#1f6fe0' }); });
  }
  online.chars = map;
}
async function refreshFriendView() {
  if (!sb || !me) return;
  try { await loadFriendships(); await loadFriendChars(); } catch (e) { toast(jaErr(e)); }
  await loadGroups();
  if (!$('select').hidden && (selTab === 'friends' || selTab === 'groups')) renderSelect();
}
function setSelTab(t) {
  if (selTab === t) { if (t !== 'mine') refreshFriendView(); return; }
  selTab = t; hidePeek();
  renderSelect(); popSelect();
  if (t === 'friends' || t === 'groups') refreshFriendView();
}

/* ================= グループ（代表者が作り、フレンドを招待する） ================= */
const G = { list: [], names: {}, loaded: false, err: '' };
let gDraft = null, joinCtx = null;
const ROLE = { kp: 'キーパー', pl: '探索者' };
const LOCK_ICON = '<svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg>', UNLOCK_ICON = '<svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 5.8-1"/></svg>';
const groupMissing = e => /group_members|relation .* does not exist|Could not find the (table|function)/i.test(String((e && (e.message || e.details)) || e || ''));
const gUser = uid => (me && uid === me.id) ? (me.username || 'あなた') : (G.names[uid] || ((online && online.friends.find(u => u.id === uid)) || {}).username || '？');
const myRow = g => (g.members || []).find(m => me && m.user_id === me.id);
const inviteCount = () => G.list.filter(g => { const r = myRow(g); return r && r.status === 'invited'; }).length;
const isFriendUid = uid => !!(online && online.friends.some(u => u.id === uid));
function renderGroupBadge() {
  const n = inviteCount(), el = $('sel-greq');
  if (el) el.innerHTML = n ? `<b class="req-badge">${n}</b>` : '';
}
async function loadGroups() {
  if (!sb || !me) { G.list = []; renderGroupBadge(); return; }
  try {
    const { data, error } = await sb.from('groups').select('id,owner,locked,data,updated_at');
    if (error) throw error;
    const ids = (data || []).map(r => r.id);
    let mem = [];
    if (ids.length) {
      const r = await sb.from('group_members').select('group_id,user_id,status,role,char_id,char_name,invited_by').in('group_id', ids);
      if (r.error) throw r.error;
      mem = r.data || [];
    }
    const uids = [...new Set([...mem.map(m => m.user_id), ...(data || []).map(r => r.owner)])].filter(u => u !== me.id && !G.names[u]);
    if (uids.length) { const r = await sb.from('profiles').select('id,username').in('id', uids); (r.data || []).forEach(x => { G.names[x.id] = x.username; }); }
    G.list = (data || []).map(r => ({ id: r.id, owner: r.owner, locked: !!r.locked, data: r.data || {}, updated: r.updated_at, members: mem.filter(m => m.group_id === r.id) }));
    G.loaded = true; G.err = '';
    if (await migrateLegacyGroups()) return loadGroups();
  } catch (e) { G.err = groupMissing(e) ? 'setup' : jaErr(e); }
  renderGroupBadge();
}
/* 前の形式（自分の端末だけ／KP・探索者を直接書いた形）のグループを新しい形に移す */
async function migrateLegacyGroups() {
  const legacy = [...(state.groups || []).map(g => ({ g, local: true })), ...G.list.filter(x => x.owner === me.id && x.data && (x.data.players || x.data.kp)).map(x => ({ g: Object.assign({ id: x.id, locked: x.locked }, x.data), local: false }))];
  if (!legacy.length) return false;
  for (const { g } of legacy) {
    const extras = [];
    let myRole = null, myChar = null;
    if (g.kp) { if (g.kp.who === 'me') myRole = 'kp'; else if (g.kp.name) extras.push({ role: 'kp', name: g.kp.name, charName: '' }); }
    (g.players || []).forEach(p => {
      if (p.who === 'me' && !myRole) { myRole = 'pl'; myChar = p; }
      else if (p.name || p.charName) extras.push({ role: 'pl', name: p.name || '', charName: p.charName || '' });
    });
    const up = await sb.from('groups').upsert({ id: g.id, owner: me.id, locked: !!g.locked, data: { name: g.name || '', date: g.date || '', note: g.note || '', extras }, updated_at: new Date().toISOString() });
    if (up.error) throw up.error;
    const r = await sb.from('group_members').upsert({ group_id: g.id, user_id: me.id, status: 'joined', role: myRole || 'pl', char_id: myChar ? myChar.charId || null : null, char_name: myChar ? myChar.charName || null : null });
    if (r.error) throw r.error;
  }
  state.groups = []; save();
  return true;
}
function rosterOf(g) {
  const joined = (g.members || []).filter(m => m.status === 'joined');
  const kp = [...joined.filter(m => m.role === 'kp').map(m => ({ user: m.user_id, name: gUser(m.user_id) })), ...(g.data.extras || []).filter(x => x.role === 'kp').map(x => ({ name: x.name }))];
  const pl = [...joined.filter(m => m.role === 'pl').map(m => ({ user: m.user_id, name: gUser(m.user_id), charId: m.char_id, charName: m.char_name })), ...(g.data.extras || []).filter(x => x.role !== 'kp').map(x => ({ name: x.name, charName: x.charName }))];
  const pending = (g.members || []).filter(m => m.status === 'invited').map(m => gUser(m.user_id));
  return { kp, pl, pending };
}
function personColor(uid) {
  if (!uid) return '#8a8f99';
  if (me && uid === me.id) return 'var(--sky)';
  const f = friendsOf().find(x => x.uid === uid);
  return f ? f.color : '#6b7280';
}
function charDot(x) {
  if (!x.user || !x.charId) return '';
  const c = (me && x.user === me.id) ? state.chars.find(ch => ch.id === x.charId) : null;
  const av = c ? (c.avatar || '') : (((online && online.chars && online.chars[x.user]) || []).find(ch => ch.id === x.charId) || {}).avatar;
  return av ? `<span class="gc-dot img"><img src="${esc(av)}" alt=""></span>` : '';
}
const dot = (name, uid) => `<span class="gc-dot" style="--c:${esc(personColor(uid))}">${esc((name || '？').charAt(0))}</span>`;
function groupCardHtml(g, kind) {
  const d = g.data || {}, { kp, pl, pending } = rosterOf(g), mine = myRow(g), owner = me && g.owner === me.id;
  const chips = pl.map(x => `<button class="gc-pl" type="button" ${x.user && x.charId ? `data-gm-user="${x.user}" data-gm-char="${esc(x.charId)}"` : 'disabled'}>
      ${charDot(x) || dot(x.name, x.user)}<span class="gc-pn">${esc(x.name || '？')}</span>${x.charName ? `<span class="gc-cn">${esc(x.charName)}</span>` : '<span class="gc-none">キャラ未設定</span>'}</button>`).join('');
  let actions = '';
  if (kind === 'invite') actions = `<button class="btn small primary" type="button" data-gjoin="${g.id}">参加する</button><button class="btn small" type="button" data-gdecline="${g.id}">断る</button>`;
  else if (owner) actions = `<button class="btn small" type="button" data-gedit="${g.id}">編集</button>`;
  else if (mine && mine.status === 'joined') actions = `<button class="btn small" type="button" data-gjoin="${g.id}">参加内容を変更</button>`;
  return `<article class="grp-card ${g.locked ? 'locked' : ''} ${kind === 'invite' ? 'invite' : ''}">
    ${kind === 'invite' ? `<p class="gc-invite">${esc(gUser(g.owner))}さんから招待が届いています。キーパーか探索者かを選んで参加してください。</p>` : ''}
    <div class="gc-top">
      <div class="gc-title"><b>${esc(d.name || '無題のシナリオ')}</b>${d.date ? `<span class="gc-date">${esc(d.date)}</span>` : ''}</div>
      ${g.locked ? `<span class="gc-lock" title="グループの参加者以外には見えません">${LOCK_ICON}非公開</span>` : ''}
      <span class="gc-owner">代表 ${dot(gUser(g.owner), g.owner)}${esc(gUser(g.owner))}</span>
      ${actions}
    </div>
    <div class="gc-row"><span class="gc-role kp">KP</span><div class="gc-pls">${kp.length ? kp.map(x => `<span class="gc-kp">${dot(x.name, x.user)}${esc(x.name || '？')}</span>`).join('') : '<span class="gc-none">未定</span>'}</div></div>
    <div class="gc-row"><span class="gc-role pl">探索者</span><div class="gc-pls">${chips || '<span class="gc-none">未定</span>'}</div></div>
    ${pending.length ? `<div class="gc-row"><span class="gc-role wait">招待中</span><div class="gc-pls">${pending.map(n => `<span class="gc-wait">${esc(n)}</span>`).join('')}</div></div>` : ''}
    ${d.note ? `<p class="gc-note">${esc(d.note)}</p>` : ''}
  </article>`;
}
function sortGroups(list) { return [...list].sort((a, b) => String(b.data.date || '').localeCompare(String(a.data.date || '')) || String(b.updated || '').localeCompare(String(a.updated || ''))); }
function renderGroupSelect(stage) {
  stage.classList.remove('grid'); stage.classList.add('listv'); stage.style.height = '';
  if (!cloudReady() || !me) {
    stage.innerHTML = `<div class="grp-gate"><p>グループは、アカウントを持っている人どうしで作ります。代表者がグループを作ってフレンドを招待し、招待された人がキーパーか探索者かを選んで参加します。</p><button class="btn primary" type="button" id="sel-login">ログイン・新規登録</button></div>`;
    return;
  }
  if (G.err === 'setup') {
    stage.innerHTML = `<div class="grp-gate"><p>グループの招待機能を使うには、サーバーの追加設定（<b>supabase/03-group-invites.sql</b>）が必要です。Supabase の SQL Editor で実行してから、ページを再読み込みしてください。</p></div>`;
    return;
  }
  const inv = sortGroups(G.list.filter(g => { const r = myRow(g); return r && r.status === 'invited'; }));
  const mine = sortGroups(G.list.filter(g => g.owner === me.id || (myRow(g) && myRow(g).status === 'joined')));
  const fr = sortGroups(G.list.filter(g => g.owner !== me.id && !myRow(g)));
  stage.innerHTML = `${inv.length ? `<h3 class="grp-h">届いている招待</h3><div class="grp-list">${inv.map(g => groupCardHtml(g, 'invite')).join('')}</div>` : ''}
    <button class="sel-list-new" type="button" id="sel-newgroup"><span class="plus">＋</span>グループをつくってフレンドを招待する</button>
    ${mine.length ? `<h3 class="grp-h">参加しているグループ</h3><div class="grp-list">${mine.map(g => groupCardHtml(g, 'mine')).join('')}</div>` : (G.err ? `<p class="err">${esc(G.err)}</p>` : '<p class="empty grp-empty">まだグループがありません。遊ぶシナリオごとにグループを作り、フレンドを招待しましょう。</p>')}
    ${fr.length ? `<h3 class="grp-h">フレンドのグループ</h3><div class="grp-list">${fr.map(g => groupCardHtml(g, 'friend')).join('')}</div>` : ''}`;
}
const charOptions = sel => state.chars.filter(c => !c.sample || state.chars.length === 1).map(c => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${esc(c.profile.name || '名無し')}${c.locked ? '（非公開のキャラ）' : ''}</option>`).join('');
const roleSwitch = (cur, attr) => `<div class="role-sw" role="group" aria-label="役割">${['kp', 'pl'].map(r => `<button type="button" class="role-btn ${cur === r ? 'on' : ''}" ${attr}="${r}" aria-pressed="${cur === r}"><b>${ROLE[r]}</b><small>${r === 'kp' ? 'シナリオを回す' : 'キャラで遊ぶ'}</small></button>`).join('')}</div>`;
/* ---- 代表者の編集画面 ---- */
function renderGroupEditor() {
  const d = gDraft;
  $('grp-title').textContent = d._new ? '新しいグループ' : 'グループを編集';
  const friends = (online && online.friends) || [];
  const memberById = Object.fromEntries((d.members || []).map(m => [m.user_id, m]));
  $('grp-body').innerHTML = `
    <div class="fields">
      <div class="field wide"><label for="g-name">シナリオ名</label><input class="inp" id="g-name" data-g="name" value="${esc(d.name)}" placeholder="例：悪霊の家"></div>
      <div class="field"><label for="g-date">日付</label><input class="inp" id="g-date" data-g="date" value="${esc(d.date)}" placeholder="例：2026/10/01"></div>
      <div class="field"><span class="lbl">公開</span><button class="btn lock-btn ${d.locked ? 'on' : ''}" type="button" data-gact="lock" aria-pressed="${d.locked}">${d.locked ? LOCK_ICON + '非公開（参加者だけ）' : UNLOCK_ICON + 'フレンドに公開'}</button></div>
    </div>
    <div class="gm-sec"><b>あなたの参加</b>${roleSwitch(d.myRole, 'data-gmyrole')}
      ${d.myRole === 'pl' ? `<select class="inp" id="g-mychar" aria-label="使う探索者"><option value="">使う探索者を選ぶ</option>${charOptions(d.myChar)}</select>` : ''}</div>
    <div class="gm-sec"><b>フレンドを招待</b><span class="hint">招待された人が、参加するときにキーパーか探索者かを選びます。</span>
      <div class="gm-friends">${friends.length ? friends.map(u => {
        const m = memberById[u.id], on = d.invite.includes(u.id), removed = d.remove.includes(u.id);
        if (m && !removed) return `<span class="gm-mem">${dot(u.username, u.id)}<b>${esc(u.username)}</b><small>${m.status === 'joined' ? (m.role ? ROLE[m.role] + 'で参加中' : '参加中') : '招待中'}</small><button class="icon-btn" type="button" data-gact="remove" data-u="${u.id}" aria-label="${esc(u.username)}をグループから外す">×</button></span>`;
        return `<button type="button" class="fchip ${on ? 'on' : ''}" style="--fc:${esc(personColor(u.id))}" data-gact="invite" data-u="${u.id}" aria-pressed="${on}"><span class="fdot">${esc((u.username || '？').charAt(0))}</span>${esc(u.username)}${removed ? '（外す）' : ''}</button>`;
      }).join('') : '<span class="empty">オンラインのフレンドがいません。「フレンド」タブでフレンドを追加すると招待できます。</span>'}
      ${(d.members || []).filter(m => m.user_id !== me.id && !friends.some(u => u.id === m.user_id)).map(m => `<span class="gm-mem">${dot(gUser(m.user_id), m.user_id)}<b>${esc(gUser(m.user_id))}</b><small>${m.status === 'joined' ? ROLE[m.role] || '参加中' : '招待中'}</small></span>`).join('')}</div></div>
    <div class="gm-sec"><b>アプリを使っていない参加者</b><span class="hint">アカウントのない人は、ここに名前を書いておけます。</span>
      <div class="gm-list">${d.extras.map((x, i) => `<div class="gm-row ex">
        <select class="inp" data-gx="role" data-i="${i}" aria-label="役割"><option value="kp" ${x.role === 'kp' ? 'selected' : ''}>キーパー</option><option value="pl" ${x.role !== 'kp' ? 'selected' : ''}>探索者</option></select>
        <input class="inp" data-gx="name" data-i="${i}" placeholder="名前" value="${esc(x.name || '')}" aria-label="名前">
        <input class="inp" data-gx="charName" data-i="${i}" placeholder="キャラ名（探索者のとき）" value="${esc(x.charName || '')}" aria-label="キャラ名">
        <button class="icon-btn" type="button" data-gact="rmx" data-i="${i}" aria-label="この参加者を消す">×</button></div>`).join('')}</div>
      <button class="btn small" type="button" data-gact="addx">＋ 参加者を書き加える</button></div>
    <div class="field wide"><label for="g-note">メモ（生還・ロスト・感想など）</label><textarea class="inp" id="g-note" data-g="note" rows="3">${esc(d.note)}</textarea></div>
    <p class="err" id="g-err" role="alert"></p>`;
  $('grp-del').hidden = !!d._new;
}
function openGroupEditor(id) {
  const g = id && G.list.find(x => x.id === id);
  const mine = g && myRow(g);
  gDraft = g
    ? { id: g.id, name: g.data.name || '', date: g.data.date || '', note: g.data.note || '', locked: g.locked, extras: JSON.parse(JSON.stringify(g.data.extras || [])), members: g.members, invite: [], remove: [], myRole: (mine && mine.role) || 'kp', myChar: (mine && mine.char_id) || '' }
    : { _new: true, id: uid(), name: '', date: '', note: '', locked: false, extras: [], members: [], invite: [], remove: [], myRole: 'kp', myChar: '' };
  renderGroupEditor(); openModal('modal-group');
}
$('grp-body').addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.g) gDraft[t.dataset.g] = t.value;
  if (t.dataset.gx) gDraft.extras[+t.dataset.i][t.dataset.gx] = t.value;
});
$('grp-body').addEventListener('change', e => {
  if (e.target.id === 'g-mychar') gDraft.myChar = e.target.value;
  if (e.target.dataset.gx === 'role') gDraft.extras[+e.target.dataset.i].role = e.target.value;
});
$('grp-body').addEventListener('click', e => {
  const r = e.target.closest('[data-gmyrole]');
  if (r) { gDraft.myRole = r.dataset.gmyrole; if (gDraft.myRole === 'pl' && !gDraft.myChar) gDraft.myChar = state.activeId; renderGroupEditor(); return; }
  const b = e.target.closest('[data-gact]'); if (!b) return;
  const u = b.dataset.u, act = b.dataset.gact;
  if (act === 'lock') gDraft.locked = !gDraft.locked;
  if (act === 'invite') { const rm = gDraft.remove.indexOf(u); if (rm >= 0) gDraft.remove.splice(rm, 1); else { const i = gDraft.invite.indexOf(u); if (i >= 0) gDraft.invite.splice(i, 1); else gDraft.invite.push(u); } }
  if (act === 'remove') gDraft.remove.push(u);
  if (act === 'addx') gDraft.extras.push({ role: 'pl', name: '', charName: '' });
  if (act === 'rmx') gDraft.extras.splice(+b.dataset.i, 1);
  renderGroupEditor();
});
$('grp-save').addEventListener('click', async e => {
  const d = gDraft, btn = e.currentTarget;
  if (!d.name.trim()) { $('g-err').textContent = 'シナリオ名を書いてください。'; $('g-name').focus(); return; }
  if (d.myRole === 'pl' && !d.myChar) { $('g-err').textContent = '使う探索者を選んでください。'; return; }
  btn.disabled = true;
  try {
    const ch = state.chars.find(c => c.id === d.myChar);
    let r = await sb.from('groups').upsert({ id: d.id, owner: me.id, locked: !!d.locked, data: { name: d.name.trim(), date: d.date.trim(), note: d.note, extras: d.extras.filter(x => (x.name || '').trim() || (x.charName || '').trim()) }, updated_at: new Date().toISOString() });
    if (r.error) throw r.error;
    r = await sb.from('group_members').upsert({ group_id: d.id, user_id: me.id, status: 'joined', role: d.myRole, char_id: d.myRole === 'pl' ? d.myChar : null, char_name: d.myRole === 'pl' && ch ? (ch.profile.name || '名無し') : null });
    if (r.error) throw r.error;
    const have = new Set((d.members || []).map(m => m.user_id));
    const inv = d.invite.filter(u => !have.has(u));
    if (inv.length) { r = await sb.from('group_members').insert(inv.map(u => ({ group_id: d.id, user_id: u, status: 'invited', invited_by: me.id }))); if (r.error) throw r.error; }
    for (const u of d.remove) { r = await sb.from('group_members').delete().eq('group_id', d.id).eq('user_id', u); if (r.error) throw r.error; }
    closeModals(); await loadGroups(); renderSelect(); popSelect();
    toast(inv.length ? `グループ「${d.name.trim()}」を保存し、${inv.length}人を招待しました。` : `グループ「${d.name.trim()}」を保存しました。`);
  } catch (er) { $('g-err').textContent = groupMissing(er) ? 'サーバーの追加設定（supabase/03-group-invites.sql）がまだのようです。' : jaErr(er); }
  finally { btn.disabled = false; }
});
$('grp-del').addEventListener('click', async e => {
  if (!arm(e.currentTarget, '本当に削除')) return;
  const r = await sb.from('groups').delete().eq('id', gDraft.id);
  if (r.error) { $('g-err').textContent = jaErr(r.error); return; }
  closeModals(); await loadGroups(); renderSelect();
  toast('グループを削除しました。');
});
/* ---- 招待された人：参加・変更・抜ける ---- */
function renderJoin() {
  const g = G.list.find(x => x.id === joinCtx.id); if (!g) return;
  const r = myRow(g), joined = r && r.status === 'joined';
  $('join-title').textContent = joined ? '参加内容を変更' : `「${g.data.name || '無題のシナリオ'}」に参加する`;
  $('join-body').innerHTML = `<p>${esc(gUser(g.owner))}さんのグループです。${joined ? '役割や使う探索者を変えられます。' : 'キーパーか探索者かを選んでください。'}</p>
    ${roleSwitch(joinCtx.role, 'data-jrole')}
    ${joinCtx.role === 'pl' ? `<label class="lbl" for="j-char">使う探索者</label><select class="inp" id="j-char"><option value="">選ぶ</option>${charOptions(joinCtx.char)}</select><p class="hint">非公開のキャラを選ぶと、ほかの参加者にはキャラ名だけ表示され、キャラシは開けません。</p>` : ''}
    <p class="err" id="j-err" role="alert"></p>`;
  $('join-leave').hidden = !joined;
  $('join-ok').textContent = joined ? '変更する' : '参加する';
}
function openJoin(id) {
  const g = G.list.find(x => x.id === id); if (!g) return;
  const r = myRow(g);
  joinCtx = { id, role: (r && r.role) || 'pl', char: (r && r.char_id) || state.activeId };
  renderJoin(); openModal('modal-join');
}
$('join-body').addEventListener('click', e => { const b = e.target.closest('[data-jrole]'); if (b) { joinCtx.role = b.dataset.jrole; renderJoin(); } });
$('join-body').addEventListener('change', e => { if (e.target.id === 'j-char') joinCtx.char = e.target.value; });
$('join-ok').addEventListener('click', async () => {
  if (joinCtx.role === 'pl' && !joinCtx.char) { $('j-err').textContent = '使う探索者を選んでください。'; return; }
  const ch = state.chars.find(c => c.id === joinCtx.char);
  const r = await sb.from('group_members').update({ status: 'joined', role: joinCtx.role, char_id: joinCtx.role === 'pl' ? joinCtx.char : null, char_name: joinCtx.role === 'pl' && ch ? (ch.profile.name || '名無し') : null }).eq('group_id', joinCtx.id).eq('user_id', me.id);
  if (r.error) { $('j-err').textContent = jaErr(r.error); return; }
  closeModals(); await loadGroups(); renderSelect();
  toast(`${ROLE[joinCtx.role]}として参加しました。`);
});
$('join-leave').addEventListener('click', async e => {
  if (!arm(e.currentTarget, '本当に抜ける')) return;
  const r = await sb.from('group_members').delete().eq('group_id', joinCtx.id).eq('user_id', me.id);
  if (r.error) { $('j-err').textContent = jaErr(r.error); return; }
  closeModals(); await loadGroups(); renderSelect();
  toast('グループから抜けました。');
});
async function declineGroup(id) {
  const r = await sb.from('group_members').delete().eq('group_id', id).eq('user_id', me.id);
  if (r.error) { toast(jaErr(r.error)); return; }
  await loadGroups(); renderSelect();
  toast('招待を断りました。');
}
function openMemberChar(user, charId) {
  if (me && user === me.id) {
    const c = state.chars.find(x => x.id === charId);
    if (!c) { toast('このキャラはこの端末に見つかりませんでした。'); return; }
    state.activeId = c.id; save(); renderShelf(); renderSheet(); renderOutput(); leaveSelect(null); playCharBgm(active()); return;
  }
  if (!isFriendUid(user)) { toast(`${gUser(user)}さんはフレンドではないため、キャラシを開けません。`); return; }
  viewFriend(user, gUser(user)).then(() => {
    const idx = fviewChars.findIndex(c => c.id === charId);
    if (idx >= 0) document.querySelector(`#fview-body [data-fv="${idx}"]`)?.click();
    else toast('このキャラシは非公開か、見つかりませんでした。');
  });
}

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

/* ================= オープニング ================= */
(function intro() {
  const el = $('intro'); if (!el) return;
  document.documentElement.style.overflow = 'hidden';
  // 魔法陣：七芒星・六角形・ルーン
  const pt = (r, deg) => [300 + r * Math.cos(deg * Math.PI / 180), 300 + r * Math.sin(deg * Math.PI / 180)];
  $('intro-star').setAttribute('points', Array.from({ length: 7 }, (_, i) => pt(232, -90 + (i * 3 % 7) * 360 / 7).map(v => v.toFixed(1)).join(',')).join(' '));
  $('intro-hex').setAttribute('points', Array.from({ length: 6 }, (_, i) => pt(122, -90 + i * 60).map(v => v.toFixed(1)).join(',')).join(' '));
  const runes = 'ᚠᚢᚦᚨᚱᚲᚷ';
  $('intro-runes').innerHTML = [...runes].map((ch, i) => { const [x, y] = pt(205, -90 + (i + .5) * 360 / 7); return `<text class="rune" x="${x.toFixed(1)}" y="${y.toFixed(1)}">${ch}</text>`; }).join('');

  // 火の粉
  const cv = $('intro-dust'), ctx = cv.getContext('2d');
  let W = 0, H = 0, raf = 0, parts = [];
  const resize = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const spawn = init => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: .6 + Math.random() * 1.8, v: .15 + Math.random() * .55, drift: (Math.random() - .5) * .3, ph: Math.random() * 6.28, gold: Math.random() < .55 });
  resize(); addEventListener('resize', resize);
  parts = Array.from({ length: Math.round(Math.min(90, W * H / 14000)) }, () => spawn(true));
  const tick = t => {
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.y -= p.v; p.x += p.drift + Math.sin(t / 1400 + p.ph) * .15;
      if (p.y < -10) Object.assign(p, spawn(false));
      const a = .35 + .45 * Math.sin(t / 500 + p.ph) ** 2;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = p.gold ? `rgba(226,186,110,${a})` : `rgba(120,215,225,${a * .8})`;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  };
  if (!reduceMotion.matches) raf = requestAnimationFrame(tick);

  let entered = false;
  const finish = () => {
    cancelAnimationFrame(raf); removeEventListener('resize', resize); document.removeEventListener('keydown', onKey, true);
    el.remove(); document.documentElement.style.overflow = $('select').hidden ? '' : 'hidden';
  };
  function enter() {
    if (entered) return; entered = true;
    const app = document.querySelector('.app');
    if (reduceMotion.matches) { finish(); return; }
    const b = $('intro-enter').getBoundingClientRect();
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    const reach = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) * 2 / 40 * 1.25;
    const flash = document.createElement('div');
    flash.className = 'intro-flash'; flash.style.left = cx + 'px'; flash.style.top = cy + 'px';
    el.appendChild(flash);
    const ease = 'cubic-bezier(.55, 0, .2, 1)';
    el.querySelector('.intro-body').animate([{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.06)', filter: 'blur(8px)' }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
    $('intro-circle').animate([{ opacity: 1, scale: 1 }, { opacity: 0, scale: 1.7 }], { duration: 1100, easing: ease, fill: 'forwards' });
    flash.animate([{ transform: 'scale(0)', opacity: .95 }, { transform: 'scale(1.4)', opacity: 1, offset: .12 }, { transform: `scale(${reach})`, opacity: 1 }], { duration: 1100, easing: ease, fill: 'forwards' })
      .finished.then(() => {
        el.style.background = 'transparent';
        el.style.pointerEvents = 'none';
        el.querySelectorAll('canvas, .intro-fog, svg, .intro-body').forEach(n => { n.style.display = 'none'; });
        popSelect();
        return flash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).finished;
      })
      .then(finish);
  }
  $('intro-enter').addEventListener('click', enter);
  const onKey = e => { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); enter(); } };
  document.addEventListener('keydown', onKey, true);
  setTimeout(() => $('intro-enter')?.focus({ preventScroll: true }), 50);
})();

/* ================= 起動 ================= */
load();
applyTheme();
renderAll();
renderSelect();
initCloud();
if (!$('intro')) document.documentElement.style.overflow = 'hidden';
})();
