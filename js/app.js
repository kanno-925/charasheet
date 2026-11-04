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

/* 1人が持てる探索者は最大 50 人（見本は数えない） */
const MAX_CHARS = 50;
const charCount = () => state.chars.filter(c => !c.sample).length;
const charRoom = () => Math.max(0, MAX_CHARS - charCount());
function canAddChar(n = 1) {
  if (charRoom() >= n) return true;
  toast(`探索者は${MAX_CHARS}人までです。いらない探索者を削除してから作ってください。`);
  return false;
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
  let name = d.name || '', kana2 = kana.trim();
  const nk = name.match(/^(.+?)\s*[(（]([^()（）]+)[)）]\s*$/);
  if (nk && /^[ぁ-んァ-ヶー・\s]+$/.test(nk[2])) { name = nk[1].trim(); kana2 = kana2 || nk[2].trim(); }
  return buildImported({
    name, kana: kana2, color: d.color, iconUrl: d.iconUrl || '', externalUrl: d.externalUrl || '',
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

/* ---------- いあきゃらの「テキスト出力」（いあきゃらテキスト 6版／7版）----------
   いあきゃらのキャラ画面の「テキスト出力」（.txt）には、技能の内訳・武器・所持品・財産・経歴・
   通過シナリオ・メモまで全部入っている。（「ココフォリア駒出力」には合計値しか入っていない） */
const iaWidth = ch => /^[^\x01-\x7E\xA1-\xDF]$/.test(ch) ? 2 : 1; // いあきゃらと同じ数え方（全角は2）
/* 決まった幅で並んだ1行を、列の幅（全角=2で数える）ごとに切り分ける */
function iaCols(line, widths) {
  const out = []; let i = 0;
  for (const w of widths) {
    let acc = 0, cell = '';
    while (i < line.length && acc < w) { cell += line[i]; acc += iaWidth(line[i]); i++; }
    out.push(cell.trim());
  }
  out.push(line.slice(i).trim());
  return out;
}
/* 「[見出し]\n本文」が空行で並ぶ部分を取り出す */
function iaEntries(body) {
  const out = []; let cur = null;
  body.split('\n').forEach(l => {
    const m = l.match(/^\[(.*)\]\s*$/);
    if (m) { cur = { name: m[1], lines: [] }; out.push(cur); }
    else if (cur) cur.lines.push(l);
    else if (l.trim()) { cur = { name: '', lines: [l] }; out.push(cur); }
  });
  return out.map(e => ({ name: e.name.trim(), value: e.lines.join('\n').trim() }));
}
function fromIachara(text) {
  const t = String(text).replace(/\r\n?/g, '\n');
  const head = t.match(/いあきゃらテキスト\s*([67])版/);
  if (!head) return null;
  const sys = head[1] === '7' ? 'coc7' : 'coc6';
  const c = blank(sys);
  // 【見出し】ごとに分ける
  const sec = {}; let cur = '_';
  t.split('\n').forEach(l => {
    const m = l.match(/^【(.+?)】\s*$/);
    if (m) { cur = m[1]; sec[cur] = []; } else (sec[cur] = sec[cur] || []).push(l);
  });
  const body = k => (sec[k] || []).join('\n');
  const field = (src, label) => { const m = src.match(new RegExp(`(?:^|\\n|/ )${label}:[ \\t]*([^\\n/]*?)\\s*(?=$|\\n| / )`)); return m ? m[1].trim() : ''; };
  const notes = []; // 入れる欄がないものはメモの最後にまとめる

  /* 基本情報 */
  const b = body('基本情報'), P = c.profile;
  const nm = b.match(/名前:[ \t]*(.*?)\s*\((.*)\)\s*$/m) || b.match(/名前:[ \t]*(.*)$/m);
  if (nm) { P.name = (nm[1] || '').trim(); P.kana = (nm[2] || '').trim(); }
  const line = label => ((b.match(new RegExp(`^${label}:[ \\t]*(.*)$`, 'm')) || [])[1] || '').trim();
  P.tags = line('タグ'); P.occupation = line('職業');
  P.age = field(b, '年齢').replace(/歳$/, ''); P.sex = field(b, '性別'); P.height = field(b, '身長');
  P.weight = field(b, '体重'); P.origin = field(b, '出身');
  P.hair = field(b, '髪の色'); P.eyes = field(b, '瞳の色'); P.skin = field(b, '肌の色');
  // 自分で足したプロフィール項目（「名前:値」の行）
  const known = /^(名前|タグ|職業|年齢|体重|髪の色)[:：]/;
  b.split('\n').filter(l => l.trim() && !known.test(l) && /^[^:]{1,30}:/.test(l)).forEach(l => {
    const i = l.indexOf(':'), k = l.slice(0, i).trim(), v = l.slice(i + 1).trim();
    if (!v) return;
    if (/誕生日|生年月日/.test(k) && !P.birthday) P.birthday = v;
    else if (/プレイヤー|PL/.test(k) && !P.player) P.player = v;
    else notes.push(`${k}：${v}`);
  });
  const icon = (body('アイコン').match(/https?:\/\/\S+/) || [])[0];
  if (icon) P.iconUrl = icon;
  const url = t.match(/https:\/\/iachara\.com\/view\/[\w-]+/);
  if (url) P.externalUrl = url[0];

  /* 能力値（現在値・能力値・増加分・一時的） */
  const ab = {};
  body('能力値').split('\n').forEach(l => {
    const m = l.trim().match(/^(\S+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)$/);
    if (m) ab[m[1]] = { sum: +m[2], value: +m[3], fixed: +m[4], tmp: +m[5] };
  });
  ABIL_KEYS.forEach(k => {
    const r = ab[k]; if (!r || !c.abilities[k]) return;
    c.abilities[k].base = String(r.value);
    c.abilities[k].adj = r.fixed ? String(r.fixed) : '';
    c.abilities[k].tmp = r.tmp ? String(r.tmp) : '';
  });
  if (sys === 'coc7' && ab['幸運'] && c.abilities.LUCK) { c.abilities.LUCK.base = String(ab['幸運'].value); if (ab['幸運'].fixed) c.abilities.LUCK.adj = String(ab['幸運'].fixed); }
  if (ab.HP) c.hp = String(ab.HP.sum);
  if (ab.MP) c.mp = String(ab.MP.sum);
  const san = body('能力値').match(/正気度\s+(-?\d+)\s*\/\s*(-?\d+)/);
  if (san) c.san = san[1]; else if (ab['正気度']) c.san = String(ab['正気度'].sum);

  /* 技能値（合計・初期値・職業P・興味P・成長分・その他） */
  const a = abilities(c);
  let matched = 0, added = 0;
  const num = v => v ? String(v) : '';
  body('技能値').split('\n').forEach(l => {
    const m = l.trim().match(/^(.+?)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)$/);
    if (!m || m[1] === '技能名') return;
    const [, rawName, sum, def, job, hobby, grow, other] = m;
    const name = rawName.trim(), n = normName(name);
    const sub = (name.match(/^(.+?)[(（](.*)[)）]$/) || []);
    let t2 = c.skills.find(s => normName(skillLabel(s)) === n && !s._ia);
    if (!t2 && sub[1]) {
      const base = c.skills.find(s => s.hasSub && normName(s.name) === normName(sub[1]) && !s._ia);
      if (base) {
        if (!base.sub) { base.sub = sub[2].trim(); t2 = base; }
        else { t2 = { ...base, sub: sub[2].trim(), job: '', hobby: '', grow: '', other: '', isJob: false, dup: true }; c.skills.splice(c.skills.indexOf(base) + 1, 0, t2); }
      }
    }
    if (!t2) t2 = c.skills.find(s => !s.hasSub && !s._ia && normName(s.name).replace(/（.*）$/, '') === n.replace(/（.*）$/, ''));
    if (t2) {
      t2._ia = true;
      t2.job = num(+job); t2.hobby = num(+hobby); t2.grow = num(+grow); t2.isJob = +job > 0;
      // 初期値がこのアプリの計算とちがうときは、差を「その他」に入れて合計をいあきゃらと同じにする
      const diff = +def - skillInit(t2, a);
      t2.other = num(+other + diff);
      matched++;
    } else {
      c.skills.push({ cat: 'k', name, hasSub: false, sub: '', init: String(def), job: num(+job), hobby: num(+hobby), grow: num(+grow), other: num(+other), isJob: +job > 0, custom: true, _ia: true });
      added++;
    }
  });
  c.skills.forEach(s => { delete s._ia; });

  /* 武器（名前20・成功率〜故障は14ずつ・最後にその他） */
  const wl = body('武器').split('\n').filter(l => l.trim());
  const weapons = wl.filter(l => !/^名前\s/.test(l.trim())).map(l => {
    const [name, rate, damage, range, attacks, ammo, durability, broken, note] = iaCols(l, [20, 14, 14, 14, 14, 14, 14, 14]);
    return { name, rate, damage, range, attacks, ammo, durability, note: [broken && broken !== '-' ? '故障 ' + broken : '', note].filter(Boolean).join(' / ') };
  }).filter(w => w.name);
  if (weapons.length) c.weapons = weapons;

  /* 装備と所持品（名称20・単価・個数・価格は14ずつ・最後に備考） */
  const il = (body('装備と所持品') || body('冒険の装備とその他の所持品')).split('\n').filter(l => l.trim());  // 7版／6版で見出しがちがう
  const items = il.filter(l => !/^名称\s/.test(l.trim())).map(l => {
    const [name, unit, count, price, note] = iaCols(l, [20, 14, 14, 14]);
    return { name, count, price: price || unit, note };
  }).filter(x => x.name);
  if (items.length) c.items = items;

  /* 収入と財産 */
  const money = {}, rest = [];
  body('収入と財産').split('\n').forEach(l => {
    const i = l.indexOf(':'); if (i < 0) return;
    const k = l.slice(0, i).trim(), v = l.slice(i + 1).trim(); if (!v) return;
    if (k === '収入') money.income = v;
    else if (k === '支出レベル') money.income = '支出レベル：' + v;
    else if (k === '手持ち現金' || k === '現金') money.cash = v;
    else if (k === '預金') money.deposit = v;
    else if (k === '個人資産' || k === '資産') money.assets = v;
    else rest.push(`${k}：${v}`);
  });
  if (rest.length) money.assets = [money.assets, ...rest].filter(Boolean).join(' / ');
  Object.assign(c.money, money);

  /* バックストーリー：魔導書・遭遇した存在は専用の欄へ、ほかは経歴にまとめる */
  const story = [];
  iaEntries(body('バックストーリー')).forEach(({ name, value }) => {
    if (!value) return;
    const label = name.replace(/^★/, '');
    if (/魔導書|呪文|アーティファクト/.test(label)) c.tomes = [c.tomes, value].filter(Boolean).join('\n');
    else if (/超自然|遭遇/.test(label)) c.entities = [c.entities, value].filter(Boolean).join('\n');
    else story.push(label ? `【${label}】\n${value}` : value);
  });
  c.backstory = story.join('\n\n');

  /* 6版：「新たに得た知識・経験」の中が〈魔導書…〉〈遭遇した…〉〈通過したシナリオ名〉に分かれている */
  const exp = {}; let ek = '';
  body('新たに得た知識・経験').split('\n').forEach(l => { const m = l.match(/^〈(.+?)〉\s*$/); if (m) { ek = m[1]; exp[ek] = []; } else if (ek) exp[ek].push(l); });
  const asList = arr => iaEntries(arr.join('\n')).filter(e => e.name || e.value).map(e => e.name && e.value ? (e.value.includes('\n') ? `${e.name}\n${e.value}` : `${e.name}：${e.value}`) : (e.name || e.value)).join('\n');
  Object.entries(exp).forEach(([k, arr]) => {
    if (/魔導書|呪文|アーティファクト/.test(k)) c.tomes = [c.tomes, asList(arr)].filter(Boolean).join('\n');
    else if (/超自然|遭遇/.test(k)) c.entities = [c.entities, asList(arr)].filter(Boolean).join('\n');
  });

  /* 通過したシナリオ */
  c.scenarios = iaEntries(body('通過したシナリオ名') || (Object.entries(exp).find(([k]) => /シナリオ/.test(k)) || [, []])[1].join('\n')).filter(e => e.name || e.value).map(e => ({ name: e.name || e.value.split('\n')[0], date: '', note: e.name ? e.value : '', friends: [] }));

  /* メモ（追加のメモは見出しつきで続ける） */
  const mb = body('メモ'), firstBr = mb.search(/^\[.*\]\s*$/m);
  const memoMain = (firstBr < 0 ? mb : mb.slice(0, firstBr)).trim();
  const extraMemo = firstBr < 0 ? [] : iaEntries(mb.slice(firstBr));
  c.memo = [memoMain, ...extraMemo.filter(e => e.value || e.name).map(e => `【${e.name}】\n${e.value}`), notes.length ? '【プロフィールの追加項目】\n' + notes.join('\n') : ''].filter(Boolean).join('\n\n');

  c.importInfo = { matched, added, full: true };
  return c;
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

/* ---- 和風テーマのキャラシ：掛け軸に立ち絵、名前は縦書き、項目は「お知らせ」のような目次 ---- */
const isWa = () => (presetOf().look || '').split(' ').includes('wa');
const WA_NUM = ['壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖', '拾'];
const WA_EN = { profile: 'Profile', abilities: 'Abilities', skills: 'Skills', weapons: 'Weapons', items: 'Items', money: 'Assets', tomes: 'Mythos', scenarios: 'Scenarios', story: 'Story' };
function waHtml(c) {
  const src = portraitSrc(c);
  return `
    <div class="hub-top wa-tools">${toolsHtml(c)}</div>
    <div class="wa-sheet">
      <div class="wa-left">
        <button class="wa-kake" type="button" data-stage aria-label="立ち絵を表示">
          <i class="wa-rod" aria-hidden="true"></i>
          <span class="wa-kake-in">${src ? `<img src="${esc(imgSrc(src))}" alt="" draggable="false" onerror="this.remove()">` : ''}<span class="wa-kake-token">${tokenHtml(c)}</span></span>
          <i class="wa-rod bot" aria-hidden="true"></i><i class="wa-cord" aria-hidden="true"></i>
        </button>
        <div class="wa-tate"><b data-hub="name"></b><span data-hub="kana"></span></div>
      </div>
      <div class="wa-right">
        <p class="wa-sub" data-hub="sub"></p>
        <div class="wa-stats">${[['hp', '体力', 'HP'], ['mp', '魔力', 'MP'], ['san', '正気', 'SAN']].map(([k, jp, en]) => `<div class="wa-stat ${k}"><span class="wa-st-l"><b>${jp}</b><small>${en}</small></span><span class="wa-st-tr"><i data-bar="${k}"></i></span><span class="wa-st-v" data-out="${k}Cur"></span></div>`).join('')}</div>
        <div class="wa-head"><span class="wa-head-jp">目録</span><span class="wa-head-en">Contents</span></div>
        <ol class="wa-list">${SECTIONS.map((s, i) => `<li><button class="wa-row" type="button" data-open="${s.key}" style="--i:${i}">
          <span class="wa-no">${WA_NUM[i]}</span><span class="wa-jp">${s.jp}<small>${WA_EN[s.key] || s.en}</small></span><span class="wa-sum" data-sum="${s.key}"></span><span class="wa-go" aria-hidden="true">›</span></button></li>`).join('')}</ol>
      </div>
    </div>`;
}

/* 襖（ふすま）がしまって、ひらく画面の切りかえ。しまった瞬間に mid() を呼ぶ */
function waDoors(mid) {
  if (reduceMotion.matches) { mid(); return; }
  const ov = document.createElement('div'); ov.className = 'wa-doors'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = '<i class="wa-door l"><b></b></i><i class="wa-door r"><b></b></i>';
  document.body.appendChild(ov);
  const [l, r] = ov.children, ease = 'cubic-bezier(.7, 0, .3, 1)';
  const shut = [l.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], { duration: 420, easing: ease, fill: 'forwards' }),
    r.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 420, easing: ease, fill: 'forwards' })];
  shut[0].finished.then(() => {
    try { mid(); } catch (e) { console.error(e); }
    setTimeout(() => {
      const open = [l.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-102%)' }], { duration: 620, easing: ease, fill: 'forwards' }),
        r.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(102%)' }], { duration: 620, easing: ease, fill: 'forwards' })];
      open[0].finished.then(() => ov.remove(), () => ov.remove());
    }, 140);
  }, () => { ov.remove(); mid(); });
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

/* ================= 効果音（ページめくり・書き直し） ================= */
const SFX = { ctx: null, noise: null };
const sfxOn = () => state.sfx !== false && !state.bgmMuted;
function actx() {
  if (!SFX.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; SFX.ctx = new C(); }
  if (SFX.ctx.state === 'suspended') SFX.ctx.resume();
  if (!SFX.noise) {
    const len = SFX.ctx.sampleRate * 2, buf = SFX.ctx.createBuffer(1, len, SFX.ctx.sampleRate), d = buf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = .97 * b + .03 * w; d[i] = w * .6 + b * 2.2; }
    SFX.noise = buf;
  }
  return SFX.ctx;
}
function noiseBurst(ctx, at, dur, { f0, f1, q = 1, vol = .3, attack = .01, hp = 300, offset = Math.random() * 1.5 }) {
  const src = ctx.createBufferSource(); src.buffer = SFX.noise;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
  bp.frequency.setValueAtTime(f0, at); bp.frequency.exponentialRampToValueAtTime(Math.max(60, f1), at + dur);
  const hpf = ctx.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + attack); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(bp).connect(hpf).connect(g).connect(ctx.destination);
  src.start(at, offset, dur + .05);
}
/* 録音した効果音（assets/ の mp3）。読み込めないときは上の合成音で代わりに鳴らす */
const SFX_SRC = { flip: 'assets/sfx-flip.mp3', write: 'assets/sfx-write.mp3' };
const SFX_LEAD = { flip: 0, write: .8 }; // 頭の無音を飛ばす秒数
function sfxPreload() {
  Object.keys(SFX_SRC).forEach(k => {
    if (SFX.raw?.[k] !== undefined) return;
    SFX.raw = SFX.raw || {}; SFX.raw[k] = null;
    fetch(SFX_SRC[k]).then(r => r.ok ? r.arrayBuffer() : null).then(b => { SFX.raw[k] = b || false; }, () => { SFX.raw[k] = false; });
  });
}
function sfxBuffer(ctx, k) {
  SFX.buf = SFX.buf || {};
  if (SFX.buf[k] !== undefined) return SFX.buf[k];
  const raw = SFX.raw?.[k];
  if (!raw) return raw === false ? (SFX.buf[k] = false) : null; // 失敗 → false、読み込み中 → null
  SFX.buf[k] = SFX.raw[k] = null;
  return (SFX.buf[k] = ctx.decodeAudioData(raw).then(b => (SFX.buf[k] = b), () => (SFX.buf[k] = false)));
}
/* 録音を ms ミリ秒だけ鳴らして、最後はふわっと消す。鳴らせたら true */
function sfxSample(k, delayMs, ms, vol) {
  const ctx = actx(); if (!ctx) return false;
  const b = sfxBuffer(ctx, k);
  if (b === false || b === null) return false;
  const start = ctx.currentTime + delayMs / 1000;
  const play = buf => {
    const t = Math.max(ctx.currentTime + .01, start), lead = SFX_LEAD[k] || 0;
    const len = Math.min(ms / 1000, buf.duration - lead);
    const from = lead + Math.random() * Math.max(0, buf.duration - lead - len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(), fade = Math.min(.35, len / 3);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .05);
    g.gain.setValueAtTime(vol, t + len - fade); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(g).connect(ctx.destination); src.start(t, from, len + .05);
  };
  if (b instanceof Promise) b.then(x => x && play(x)); else play(b);
  return true;
}
/* ページをめくる音：n 枚を gap ミリ秒ずつずらしてめくる */
function sfxFlip(delayMs, ms, n = 1, gap = 0) {
  if (!sfxOn()) return;
  if (sfxSample('flip', delayMs, ms, .9)) return;
  const ctx = actx(); if (!ctx) return;
  for (let i = 0; i < n; i++) {
    const t = ctx.currentTime + (delayMs + i * gap) / 1000, v = (i === n - 1 ? 1 : .8) * (.85 + Math.random() * .3);
    noiseBurst(ctx, t, .34, { f0: 1400, f1: 3600, q: .8, vol: .16 * v, attack: .12, hp: 500 });
    noiseBurst(ctx, t + .26, .12, { f0: 2600, f1: 900, q: 1.2, vol: .28 * v, attack: .006, hp: 700 });
    noiseBurst(ctx, t + .33, .05, { f0: 4200, f1: 2000, q: 2, vol: .12 * v, attack: .003, hp: 1500 });
  }
}
/* 万年筆で書く音 */
function sfxWrite(ms, delayMs = 0) {
  if (!sfxOn()) return;
  if (sfxSample('write', 20 + delayMs, Math.min(ms, 7000), .8)) return;
  const ctx = actx(); if (!ctx) return;
  let t = ctx.currentTime + .02 + delayMs / 1000; const end = t + Math.min(ms, 6000) / 1000;
  while (t < end) {
    const d = .05 + Math.random() * .14;
    noiseBurst(ctx, t, d, { f0: 3800 + Math.random() * 1800, f1: 2600 + Math.random() * 1600, q: 2.2, vol: .05 + Math.random() * .05, attack: .008, hp: 1800 });
    t += d + (Math.random() < .25 ? .14 + Math.random() * .16 : .02 + Math.random() * .05);
  }
}
/* 消す音：書く音を小さく短く */
function sfxErase(ms) {
  if (!sfxOn()) return;
  if (sfxSample('write', 0, ms, .45)) return;
  const ctx = actx(); if (!ctx) return;
  let t = ctx.currentTime + .01; const end = t + ms / 1000;
  while (t < end) { const d = .12 + Math.random() * .1; noiseBurst(ctx, t, d, { f0: 900, f1: 1400, q: .9, vol: .07, attack: .05, hp: 250 }); t += d * .8; }
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
      <span class="bk-edge" aria-hidden="true"></span>
      <button class="bk-sound ${state.sfx === false ? 'off' : ''}" type="button" data-act="sfx" aria-pressed="${state.sfx !== false}" title="効果音（ページめくり・書き直し）">${state.sfx === false ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z"/><path class="w" d="M13.5 7.5l5 5M18.5 7.5l-5 5"/></svg>' : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z"/><path class="w" d="M13.5 7a4 4 0 0 1 0 6M15.6 5a7 7 0 0 1 0 10"/></svg>'}</button>
      <nav class="bk-tabs" aria-label="章の付箋">${SECTIONS.map((x, i) => `<button class="bk-tab ${x.key === key ? 'on' : ''}" type="button" data-booktab="${x.key}" style="--bc:${x.color};--i:${i}" aria-current="${x.key === key}" aria-label="${x.jp}">${BOOK_LABEL[x.key]}</button>`).join('')}</nav>
      <div class="bk-pages">
        <div class="bk-page bk-left">
          <svg class="bk-circle" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="88" class="d"/><circle cx="100" cy="100" r="62"/><polygon points="100,12 176,144 24,144"/><polygon points="100,188 24,56 176,56"/><circle cx="100" cy="100" r="30" class="d"/><text x="100" y="9" text-anchor="middle">ᚠ</text><text x="191" y="104" text-anchor="middle">ᚱ</text><text x="100" y="199" text-anchor="middle">ᚲ</text><text x="9" y="104" text-anchor="middle">ᚷ</text></svg>
          <span class="bk-stain l" aria-hidden="true"></span>
          <div class="bk-scroll">
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
          </div>
          <p class="bk-folio">${idx * 20 + 12}</p>
        </div>
        <span class="bk-ribbon" aria-hidden="true"></span>
        <div class="bk-page bk-right" id="bk-right">
          <span class="bk-stain" aria-hidden="true"></span>
          <div class="bk-scroll" id="bk-scroll">
          <div class="bk-head"><span class="bk-en">第${kn(idx)}章 ・ ${kn(curNo)}</span><h3><span class="bk-ht">${cur ? esc(cur.label) : sec.jp}</span></h3></div>
          <div class="bk-body">${body}</div>
          </div>
          <p class="bk-folio">${idx * 20 + curNo * 2 + 13}</p>
        </div>
      </div>
    </div>
  </div>`;
}
/* 頁に文字が書きこまれていく（delay ミリ秒後から）。
   filter はアニメさせない：かすれ文字の SVG フィルターが外れて、終わりに見た目が跳ねるため */
function writeIn(pg, delay = 0) {
  if (!pg || reduceMotion.matches) return;
  const els = [...pg.querySelectorAll('.bk-head .bk-en, .bk-head h3, .bk-note, .field, .sec-title, .points .pt, .tbl thead tr, .tbl tbody tr, .dv, .chart-fig, .sub-title, .scn-friends, .played-with, .bk-entry-act, .bk-manage, textarea, .bk-empty')]
    .filter(el => !el.closest('.field') || el.classList.contains('field')).slice(0, 44);
  const dur = 900, step = 115;
  els.forEach((el, i) => el.animate(
    [{ clipPath: 'inset(0 100% 0 0)', opacity: .3 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }],
    { duration: dur, delay: delay + i * step, easing: 'cubic-bezier(.45, .1, .35, 1)', fill: 'backwards' }));
  if (els.length) sfxWrite(dur + (els.length - 1) * step, delay);
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
  sfxErase(560);
  oldHead?.animate(erase, { duration: 600, easing: 'ease-in', fill: 'forwards' });
  old.animate(erase, { duration: 600, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { bookBusy = false; go(); }, () => { bookBusy = false; go(); });
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
  const dur = count === 1 ? 760 : 1050, gap = count === 1 ? 85 : 170;
  const anims = [];
  const shade = document.createElement('i'); shade.className = 'flip-shade'; wrap.appendChild(shade);
  anims.push(shade.animate([{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: dur + (n - 1) * gap, easing: 'ease-in-out', fill: 'both' }));
  const end = narrow ? -100 : -180;
  const path = [
    { t: 0, ry: 0, rz: 0, tz: 0, b: 1 },
    { t: .18, ry: -24, rz: -1.6, tz: 18, b: .97 },
    { t: .5, ry: -90, rz: -2.2, tz: 46, b: .62 },
    { t: .82, ry: end * .88, rz: -1, tz: 16, b: .82 },
    { t: 1, ry: end, rz: 0, tz: 0, b: .9 },
  ];
  const seq = forward ? path : path.map(x => ({ ...x, t: 1 - x.t })).reverse();
  for (let i = 0; i < n; i++) {
    const leaf = document.createElement('i');
    leaf.className = 'leaf' + (i === n - 1 ? ' last' : '');
    leaf.innerHTML = '<b class="lf front"></b><b class="lf back"></b>';
    wrap.appendChild(leaf);
    const k = seq.map(x => ({ offset: x.t, transform: `rotateY(${x.ry}deg) rotateZ(${x.rz}deg) translateZ(${x.tz}px)`, opacity: narrow && Math.abs(x.ry) > 95 ? 0 : 1 }));
    anims.push(leaf.animate(k, { duration: dur, delay: i * gap, easing: 'cubic-bezier(.42, .02, .3, 1)', fill: 'both' }));
    leaf.querySelectorAll('.lf').forEach(f => anims.push(f.animate(seq.map(x => ({ offset: x.t, filter: `brightness(${x.b})` })), { duration: dur, delay: i * gap, easing: 'cubic-bezier(.42, .02, .3, 1)', fill: 'both' })));
  }
  sfxFlip(dur * .08, dur + (n - 1) * gap, n, gap);
  // 新しい頁は白紙から：書きこみ前の文字は最初から隠しておき、めくり終わりに合わせて書き始める
  writeIn(pg, Math.max(0, dur + n * gap - 260));
  Promise.all(anims.map(a => a.finished)).then(() => wrap.remove(), () => wrap.remove());
}
/* 探索者を選んで本を開くとき：閉じた魔導書が手前に開く */
function bookOpening() {
  if (reduceMotion.matches || !isBook()) return false;
  const ov = document.createElement('div'); ov.className = 'bk-opening'; ov.setAttribute('aria-hidden', 'true');
  ov.innerHTML = '<img src="assets/book-closed.webp" alt="">';
  document.body.appendChild(ov);
  const img = ov.firstChild;
  sfxFlip(380, 1400, 3, 160);
  img.animate([{ opacity: 0, transform: 'scale(.9) translateY(18px)' }, { opacity: 1, transform: 'scale(1)', offset: .3 }, { opacity: 1, transform: 'scale(1.04)', offset: .55 }, { opacity: 0, transform: 'perspective(1400px) rotateX(18deg) scale(1.25)', filter: 'blur(6px)' }],
    { duration: 1500, easing: 'cubic-bezier(.4, 0, .3, 1)', fill: 'forwards' });
  ov.animate([{ opacity: 1 }, { opacity: 1, offset: .6 }, { opacity: 0 }], { duration: 1500, fill: 'forwards' }).finished.then(() => ov.remove(), () => ov.remove());
  document.querySelector('.app').animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 0, offset: .5 }, { opacity: 1, transform: 'none' }], { duration: 1500, easing: 'cubic-bezier(.2, .8, .2, 1)' });
  return true;
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
  if (book) sfxPreload();
  // 書き直しても、同じ頁なら読んでいた位置（頁の中のスクロール）を保つ
  const pageAt = () => ['.bk-chapter h3', '#bk-right .bk-head h3'].map(q => document.querySelector(q)?.textContent);
  const was = book ? pageAt() : [], kept = book ? [...document.querySelectorAll('#book .bk-scroll')].map(e => e.scrollTop) : [];
  $('sheet').classList.toggle('is-wa', !book && isWa());
  $('sheet').innerHTML = book ? bookHtml(c) : isWa() ? waHtml(c) : hubHtml(c);
  if (book) { const now = pageAt(); document.querySelectorAll('#book .bk-scroll').forEach((e, i) => { if (now[i] === was[i]) e.scrollTop = kept[i] || 0; }); }
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
  if (!reduceMotion.matches && isWa()) {
    // 巻物がひらくように、上から下へ広がる
    ov.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    $('sao-win').animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 760, easing: 'cubic-bezier(.55, 0, .2, 1)' });
    $('sao-win').animate([{ transform: 'translateY(-10px)' }, { transform: 'none' }], { duration: 760, easing: 'cubic-bezier(.55, 0, .2, 1)' });
    $('sao-line').animate([{ top: '0%', opacity: 1 }, { top: '100%', opacity: 1, offset: .97 }, { top: '100%', opacity: 0 }], { duration: 780, easing: 'cubic-bezier(.55, 0, .2, 1)' }); // 下の軸が紙といっしょに下りる
    stagger(380);
  } else if (!reduceMotion.matches) {
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
  const target = document.querySelector(`#sheet [data-open="${panelKey}"]`) || document.querySelector('#sheet .hub-core, #sheet .wa-kake');
  const done = anims => {
    ov.hidden = true; panelKey = null;
    anims.forEach(a => a.cancel());
    if (target) {
      target.focus({ preventScroll: true });
      if (!reduceMotion.matches) { target.classList.remove('land'); void target.offsetWidth; target.classList.add('land'); fxAt(target, false); }
    }
  };
  if (reduceMotion.matches) return done([]);
  if (isWa()) { // 巻物を下から巻きあげてしまう
    const anims = [$('sao-win').animate([{ clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 520, easing: 'cubic-bezier(.6, 0, .4, 1)', fill: 'forwards' }),
      ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, delay: 320, fill: 'forwards' })];
    Promise.all(anims.map(a => a.finished)).then(() => done(anims));
    return;
  }
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
  if (!reduceMotion.matches && isWa()) { // 筆でさっと書いたように、左から現れる
    $('panel-body').animate([{ clipPath: 'inset(0 100% 0 0)', opacity: .4 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }], { duration: 560, easing: 'cubic-bezier(.5, 0, .2, 1)' });
    return;
  }
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
    case 'sfx': state.sfx = state.sfx === false; save(); renderSheet(); if (state.sfx !== false) sfxFlip(0, 700); toast(state.sfx === false ? '効果音をオフにしました。' : '効果音をオンにしました。'); return;
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
      if (!canAddChar()) return;
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
  if (!canAddChar()) { closeModals(); return; }
  const c = blank(b.dataset.sys);
  state.chars.unshift(c); state.activeId = c.id; save(); closeModals(); stopBgm();
  if (!$('select').hidden) leaveSelect(null, true);
  renderAll();
  openPanel('profile', document.querySelector('#sheet .hub-core'));
  $('f-profile-name')?.focus({ preventScroll: true });
});
function openNewChar() {
  if (!canAddChar()) return;
  $('new-count').textContent = `いま ${charCount()} 人 ／ 最大 ${MAX_CHARS} 人（あと ${charRoom()} 人作れます）`;
  openModal('modal-new');
}
$('btn-new').addEventListener('click', openNewChar);

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
    const c = fromIachara(raw) || fromText(raw);
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
  const room = charRoom();
  if (!room) { err.textContent = `探索者は${MAX_CHARS}人までです。いらない探索者を削除してから読み込んでください。`; return; }
  const cut = list.length - room;
  if (cut > 0) list = list.slice(0, room);
  list.forEach(c => { c.id = uid(); delete c.sample; });
  if (obj && Array.isArray(obj.friends)) {
    state.friends = state.friends || [];
    obj.friends.forEach(f => { if (f && f.id && f.name && !state.friends.some(x => x.id === f.id)) state.friends.push({ id: f.id, name: String(f.name), color: f.color || '#1f6fe0', note: f.note || '' }); });
  }
  state.chars = [...list, ...state.chars]; state.activeId = list[0].id;
  save(); closeModals(); renderAll();
  const info = list[0].importInfo;
  list.forEach(c => { delete c.importInfo; });
  if (cut > 0) toast(`探索者は${MAX_CHARS}人までなので、先頭の${room}人だけ読み込みました（${cut}人は読み込んでいません）。`);
  else if (info && info.full) toast(`「${list[0].profile.name || '名無し'}」をいあきゃらのテキストから読み込みました。技能${info.matched}個${info.added ? `（うち${info.added}個は新しく追加）` : ''}の内訳、武器・所持品・財産・経歴・通過シナリオ・メモも入っています。`);
  else if (info) toast(`「${list[0].profile.name || '名無し'}」を読み込みました。技能${info.matched}個を反映${info.added ? `、${info.added}個を新しく追加` : ''}しました。技能の値は「その他」欄に入っています。`);
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
  sakura: { name: '和風', sub: '和紙と墨と金、舞う桜', look: 'mincho wa', vals: { bg: '#ebdfc6', solid: '#f7efdd', ink: '#2e2520', sky: '#5a3c2c', cyan: '#b08d4a', amber: '#b08d4a' } },
  neon:   { name: 'ネオン', sub: '夜のサイバー', look: 'dark', vals: { bg: '#0b0918', solid: '#16122b', ink: '#ece8ff', sky: '#a159f5', cyan: '#22c8e8', amber: '#f2569e' } },
  book:   { name: '魔導書', sub: '古本に万年筆で書きこむ記録', look: 'dark mincho book', vals: { bg: '#140c07', solid: '#22160d', ink: '#efe0c4', sky: '#7a5a8c', cyan: '#c9a04e', amber: '#c9a04e' } },
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
  waScene();
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

/* ================= 和風テーマ：和紙の背景・景色・金の霞・青海波・舞い散る桜 ================= */
const WA = { on: false, raf: 0, petals: [], sprites: null, last: 0, w: 0, h: 0, dpr: 1 };
function waScene() {
  const on = (presetOf().look || '').split(' ').includes('wa');
  let el = $('wa-bg');
  if (on && !el) {
    el = document.createElement('div'); el.id = 'wa-bg'; el.className = 'wa-bg'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<i class="wa-sun"></i><div class="wa-scene"><i class="wa-branch"></i></div><i class="wa-cloud c1"></i><i class="wa-cloud c2"></i><i class="wa-cloud c3"></i><i class="wa-wave wl"></i><i class="wa-wave wr"></i><i class="wa-wave wg"></i><canvas class="wa-petals" id="wa-petals"></canvas>';
    document.body.prepend(el);
  }
  if (el) el.hidden = !on;
  if (on === WA.on) return;
  WA.on = on;
  if (on) waPetalsStart(); else cancelAnimationFrame(WA.raf);
}
/* 花びらの絵を3色ぶん先に描いておく（毎回描くより軽い） */
function waSprites() {
  const mk = (c1, c2) => {
    const cv = document.createElement('canvas'), w = 28, h = 32; cv.width = w; cv.height = h;
    const g = cv.getContext('2d'); g.translate(w / 2, h / 2);
    const gr = g.createRadialGradient(0, 8, 1, 0, 0, 16); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.beginPath();
    g.moveTo(0, 15); g.bezierCurveTo(13, 7, 13, -10, 4.5, -15); g.lineTo(0, -10.5); g.lineTo(-4.5, -15); g.bezierCurveTo(-13, -10, -13, 7, 0, 15);
    g.fill(); g.strokeStyle = 'rgba(190,110,130,.35)'; g.lineWidth = .8; g.stroke();
    return cv;
  };
  return [mk('#fff6f7', '#f2b8c6'), mk('#fde9ee', '#e89aae'), mk('#fffaf6', '#f6cdd3')];
}
function waPetalsStart() {
  const cv = $('wa-petals'); if (!cv) return;
  const g = cv.getContext('2d');
  WA.sprites = WA.sprites || waSprites();
  const size = () => { WA.dpr = Math.min(2, devicePixelRatio || 1); WA.w = innerWidth; WA.h = innerHeight; cv.width = WA.w * WA.dpr; cv.height = WA.h * WA.dpr; };
  size(); if (!WA.sized) { WA.sized = true; addEventListener('resize', size); }
  const n = reduceMotion.matches ? 0 : innerWidth < 760 ? 14 : 30;
  const make = (fresh) => ({ x: Math.random() * WA.w * 1.2 - WA.w * .1, y: fresh ? Math.random() * WA.h : -30 - Math.random() * 200, s: .45 + Math.random() * .65,
    vy: .35 + Math.random() * .55, vx: -.15 - Math.random() * .35, sw: 18 + Math.random() * 40, sp: .0006 + Math.random() * .0012, ph: Math.random() * 6.3,
    r: Math.random() * 6.3, vr: (Math.random() - .5) * .03, fl: Math.random() * 6.3, vf: .02 + Math.random() * .04, k: Math.floor(Math.random() * 3) });
  WA.petals = Array.from({ length: n }, () => make(true));
  cancelAnimationFrame(WA.raf);
  const tick = t => {
    if (!WA.on) return;
    WA.raf = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min(50, t - (WA.last || t)) / 16.7; WA.last = t;
    const wind = Math.sin(t * .00025) * .45 + Math.sin(t * .0011) * .15;
    g.setTransform(WA.dpr, 0, 0, WA.dpr, 0, 0); g.clearRect(0, 0, WA.w, WA.h);
    WA.petals.forEach((p, i) => {
      p.y += p.vy * dt * p.s * 1.4; p.x += (p.vx + wind) * dt + Math.cos(t * p.sp + p.ph) * .35 * dt;
      p.r += p.vr * dt; p.fl += p.vf * dt;
      if (p.y > WA.h + 30 || p.x < -60 || p.x > WA.w + 60) WA.petals[i] = make(false);
      const x = p.x + Math.sin(t * p.sp + p.ph) * p.sw;
      g.save(); g.translate(x, p.y); g.rotate(p.r); g.scale(p.s * Math.max(.15, Math.abs(Math.cos(p.fl))), p.s);
      g.globalAlpha = .85; g.drawImage(WA.sprites[p.k], -14, -16); g.restore();
    });
  };
  if (n) WA.raf = requestAnimationFrame(tick); else g.clearRect(0, 0, cv.width, cv.height);
}

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
  if (e.target.closest('#stage-profile')) { closeStage(); openPanel('profile', document.querySelector('#sheet [data-open="profile"]')); return; }
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
      ${playedWith(c).length ? `<div class="peek-friends"><small>一緒に遊んだ</small>${playedWith(c).map(({ f, n }) => `<span class="fchip on static" style="--fc:${esc(f.color)}"><span class="fdot">${fInit(f)}</span>${esc(f.name)}${n > 1 ? `<b>×${n}</b>` : ''}</span>`).join('')}</div>` : ''}
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
/* フレンドの丸：キャラシ工房のフレンドでアイコン画像があれば画像、なければ名前の1文字目 */
const fInit = f => (f.uid && avImg(f.uid)) || esc((f.name || '？').charAt(0));
const fchip = (f, attrs, on) => `<button type="button" class="fchip ${on ? 'on' : ''}" style="--fc:${esc(f.color)}" ${attrs}><span class="fdot">${fInit(f)}</span>${esc(f.name)}</button>`;
function scenariosHtml(c) {
  const fr = friendsOf(), pw = playedWith(c);
  return `<section class="sec">
    <div class="played-with">
      <span class="lbl">この探索者と冒険したフレンド</span>
      <div class="pw-chips">${pw.length ? pw.map(({ f, n }) => `<span class="fchip on static" style="--fc:${esc(f.color)}"><span class="fdot">${fInit(f)}</span>${esc(f.name)}<b>×${n}</b></span>`).join('') : '<span class="empty">シナリオに「一緒に遊んだフレンド」を付けると、ここに並びます。</span>'}</div>
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
      <span class="fav" style="--fc:${esc(f.color)}">${fInit(f)}${f.uid ? '<i class="ol-badge" title="キャラシ工房のフレンド"></i>' : ''}</span>
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

/* ---- ユーザーのアイコン画像（profiles.avatar に小さな正方形の画像を data URL で入れる） ---- */
const AVATARS = {};    // ユーザーID → 画像
let avatarCol = true;  // サーバーに avatar 欄がまだ無い（SQL 07 を実行していない）ときは false にして、名前だけ読む
const okAvatar = v => typeof v === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v) ? v : '';
const avImg = uid => AVATARS[uid] ? `<img src="${esc(AVATARS[uid])}" alt="" loading="lazy" draggable="false">` : '';
/* profiles を読む。q は列の名前を受け取ってクエリを返す関数。avatar 欄があればいっしょに読んで覚えておく */
async function selectProfiles(q) {
  if (avatarCol) {
    const r = await q('id,username,avatar');
    if (!r.error) {
      [].concat(r.data || []).forEach(p => { if (p && p.id) { if (okAvatar(p.avatar)) AVATARS[p.id] = p.avatar; else delete AVATARS[p.id]; } });
      return r;
    }
    if (!/avatar/i.test(r.error.message || '')) return r;
    avatarCol = false;
  }
  return q('id,username');
}
/* 画像ファイル → 真ん中を正方形に切りぬいた 160px の画像（data URL） */
function avatarFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error('画像ファイル（PNG・JPGなど）を選んでください。')); return; }
    const url = URL.createObjectURL(file), img = new Image();
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('画像を読み込めませんでした。別の画像で試してください。')); };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const s = Math.min(img.width, img.height), sx = (img.width - s) / 2, sy = (img.height - s) * .3; // 縦長の画像は少し上（顔のあたり）を使う
      const cv = document.createElement('canvas'); cv.width = cv.height = 160;
      const g = cv.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 160, 160);
      g.drawImage(img, sx, sy, s, s, 0, 0, 160, 160);
      let out = '';
      for (const q of [.85, .72, .6, .45]) { out = cv.toDataURL('image/jpeg', q); if (out.length <= 60000) break; }
      resolve(out);
    };
    img.src = url;
  });
}
async function saveAvatar(v) {
  if (!sbClient() || !me) return;
  const { error } = await sb.from('profiles').update({ avatar: v || null }).eq('id', me.id);
  if (error) { toast(/avatar/i.test(error.message || '') ? 'サーバーの準備がまだです。Supabase で supabase/07-avatars.sql を実行してください。' : 'アイコンを保存できませんでした：' + jaErr(error)); return; }
  avatarCol = true;
  if (v) AVATARS[me.id] = v; else delete AVATARS[me.id];
  renderAccount(); renderAccountBtn(); renderOnline(); renderFriends();
  if (!$('select').hidden) renderSelect();
  toast(v ? 'アイコンを変えました。フレンドやグループの人にも見えます。' : 'アイコンを外しました。');
}
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
  if (ids.length) { const r = await selectProfiles(c => sb.from('profiles').select(c).in('id', ids)); if (r.error) throw r.error; profs = r.data || []; }
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
  if (!uid) { me = null; online = null; lastSynced.clear(); setSync('off'); renderAccount(); renderOnline(); ueCheckAdmin(); if (!$('select').hidden && selTab === 'friends') renderSelect(); return; }
  me = { id: uid, email: session.user.email, username: (session.user.user_metadata || {}).username || '' };
  renderAccountBtn(); renderAccount();
  try {
    const { data: prof } = await selectProfiles(c => sb.from('profiles').select(c).eq('id', uid).maybeSingle());
    if (prof && prof.username) me.username = prof.username;
    renderAccountBtn(); renderAccount();
    ueCheckAdmin();
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
        <label class="fav acct-av ${AVATARS[me.id] ? 'has' : ''}" style="--fc:var(--sky)" title="アイコン画像を選ぶ">${avImg(me.id) || esc((me.username || '？').charAt(0))}<input type="file" id="ac-avatar" accept="image/*" hidden><i class="acct-av-cam" aria-hidden="true">✎</i></label>
        <div><b class="acct-name">${esc(me.username)}</b><span class="acct-mail">${esc(me.email || '')}</span>
          <span class="acct-av-act"><label class="btn small" for="ac-avatar">アイコン画像を${AVATARS[me.id] ? '変える' : '選ぶ'}</label>${AVATARS[me.id] ? '<button class="btn small ghost" type="button" data-acct="avatar-off">外す</button>' : ''}</span>
          <small class="acct-av-note">フレンドやグループの人にも見えます。</small></div>
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
  if (a.dataset.acct === 'avatar-off') { if (!arm(a, 'もう一度押すと外す')) return; saveAvatar(''); return; }
  if (a.dataset.acct === 'sync') { try { await pullAndMerge(); await loadFriendships(); toast('同期しました。'); } catch (er) { setSync('error', jaErr(er)); } }
  if (a.dataset.acct === 'friends') { closeModals(); openFriends(); }
  if (a.dataset.acct === 'logout') { if (!arm(a, 'もう一度押すとログアウト')) return; closeModals(); logout(); }
});
$('acct-body').addEventListener('change', async e => {
  if (e.target.id !== 'ac-avatar') return;
  const f = e.target.files && e.target.files[0]; e.target.value = '';
  if (!f) return;
  try { await saveAvatar(await avatarFromFile(f)); } catch (er) { toast(er.message || 'アイコンを設定できませんでした。'); }
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
  const av = u => `<span class="fav sm" style="--fc:${esc((friendsOf().find(f => f.uid === u.id) || {}).color || 'var(--sky)')}">${avImg(u.id) || esc((u.username || '？').charAt(0))}</span>`;
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
    const { data: p, error } = await selectProfiles(c => sb.from('profiles').select(c).ilike('username', name.replace(/[%_\\]/g, '\\$&')).maybeSingle());
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
/* スライド表示：立ち絵を全身で横に並べ、真ん中のキャラを大きく見せる */
function slideViewHtml(chars) {
  const flags = c => `${c.bgm ? '<span class="sel-bgm" title="BGMあり">♪</span>' : ''}${c.locked ? '<span class="sel-lock" title="フレンドに非公開"><svg class="lk" viewBox="0 0 20 20" aria-hidden="true"><rect x="4.5" y="9" width="11" height="8" rx="2"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/></svg></span>' : ''}`;
  const card = (c, i) => {
    const p = c.profile, src = portraitSrc(c);
    return `<button class="sel-char sl-card" type="button" data-id="${c.id}" style="--i:${i}" aria-label="${esc(p.name || '名無し')}のシートを開く">
      <span class="sl-body"><span class="sl-art ${src ? 'has' : ''}">${src ? `<img src="${esc(imgSrc(src))}" alt="" draggable="false" onerror="this.parentNode.classList.remove('has');this.remove()">` : ''}${tokenHtml(c)}</span>
      <span class="sl-ground" aria-hidden="true"></span>
      <span class="sl-name">${esc(p.name || '名無し')}${flags(c)}</span>
      <span class="sl-sys">${esc(sortValueText(c) || [SYS[c.system].short, p.occupation].filter(Boolean).join(' ・ '))}</span></span>
    </button>`;
  };
  return `<div class="sl-track" id="sl-track">
    <button class="sl-card sl-new" type="button" id="sel-new" style="--i:0"><span class="sl-body"><span class="sl-art"><span class="sl-plus">＋</span></span><span class="sl-ground" aria-hidden="true"></span><span class="sl-name">新しい探索者</span><span class="sl-sys">NEW INVESTIGATOR</span></span></button>
    ${chars.map((c, i) => card(c, i + 1)).join('')}
  </div>
  <p class="sl-hint">横にスクロールして選ぶ ・ 長押しで詳細 ・ ${canHover.matches ? 'クリック' : 'タップ'}で編集</p>`;
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
      <span class="token" style="--tc:${esc(colorOf(u))}">${avImg(u.id) || esc((u.username || '？').charAt(0))}</span>${kind === 'in' ? '<span class="sel-reqmark">申請</span>' : ''}
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
    if (uids.length) { const r = await selectProfiles(c => sb.from('profiles').select(c).in('id', uids)); (r.data || []).forEach(x => { G.names[x.id] = x.username; }); }
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
const dot = (name, uid) => `<span class="gc-dot ${AVATARS[uid] ? 'img' : ''}" style="--c:${esc(personColor(uid))}">${avImg(uid) || esc((name || '？').charAt(0))}</span>`;
const safeRoom = u => /^https:\/\/[^\s"'<>]+$/.test(u || '') ? u : '';
function roomRow(g, member) {
  const url = safeRoom((g.data || {}).roomUrl);
  if (!url) return '';
  if (!member) return '<div class="gc-room"><span class="gc-room-n">ココフォリアのルームあり（参加者だけが開けます）</span></div>';
  return `<div class="gc-room"><a class="btn small primary gc-room-go" href="${esc(url)}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M17 3l-8 8M15 12v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"/></svg>ココフォリアのルームを開く</a><button class="btn small ghost" type="button" data-gcopy="${esc(url)}">URLをコピー</button></div>`;
}
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
    ${roomRow(g, owner || (mine && mine.status === 'joined'))}
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
/* ---- 代表をゆずる（参加中のメンバーだけが相手になれる） ---- */
function transferHtml(d) {
  const joined = (d.members || []).filter(m => m.status === 'joined' && m.user_id !== me.id);
  return `<div class="gm-sec gm-transfer"><b>代表をゆずる</b>
    <span class="hint">代表（グループの編集・招待・削除ができる人）を、参加中のメンバーにゆずれます。ゆずったあと、あなたは参加者として残ります。ほかの変更は先に「保存」してください。</span>
    ${joined.length ? `<div class="row"><select class="inp" id="g-newowner" aria-label="代表をゆずる相手"><option value="">ゆずる相手を選ぶ</option>${joined.map(m => `<option value="${m.user_id}">${esc(gUser(m.user_id))}（${m.role ? ROLE[m.role] : '参加中'}）</option>`).join('')}</select>
      <button class="btn small" type="button" data-gact="transfer">代表をゆずる</button></div>`
      : '<span class="empty">まだ参加中のメンバーがいないので、ゆずれません。招待した人が参加すると選べるようになります。</span>'}</div>`;
}
async function transferGroup(btn) {
  const d = gDraft, to = $('g-newowner') && $('g-newowner').value, err = $('g-err');
  err.textContent = '';
  if (!to) { err.textContent = 'ゆずる相手を選んでください。'; return; }
  if (!arm(btn, `${gUser(to)}さんにゆずる（もう一度押す）`)) return;
  btn.disabled = true;
  try {
    const { error } = await sb.rpc('transfer_group', { gid: d.id, new_owner: to });
    if (error) throw error;
    closeModals(); await loadGroups(); renderSelect(); popSelect();
    toast(`グループ「${d.name || '名前なし'}」の代表を${gUser(to)}さんにゆずりました。あなたは参加者として残っています。`);
  } catch (er) {
    const m = String(er && er.message || '');
    err.textContent = /transfer_group|Could not find the function|schema cache/.test(m) ? 'サーバーの追加設定（supabase/08-group-transfer.sql）がまだのようです。Supabase の SQL Editor で実行してください。'
      : /[ぁ-んァ-ヶ一-龠]/.test(m) ? m : jaErr(er);
  } finally { btn.disabled = false; }
}
/* ---- 代表者の編集画面 ---- */
function renderGroupEditor() {
  const d = gDraft;
  $('grp-title').textContent = d._new ? '新しいグループ' : 'グループを編集';
  const friends = (online && online.friends) || [];
  const memberById = Object.fromEntries((d.members || []).map(m => [m.user_id, m]));
  $('grp-body').innerHTML = `
    <div class="fields">
      <div class="field wide"><label for="g-name">シナリオ名</label><input class="inp" id="g-name" data-g="name" value="${esc(d.name)}" placeholder="例：悪霊の家"></div>
      <div class="field wide"><label for="g-room">ココフォリアのルームURL</label><input class="inp" id="g-room" data-g="roomUrl" value="${esc(d.roomUrl)}" placeholder="https://ccfolia.com/rooms/…" inputmode="url" autocomplete="off"><span class="hint">参加者のカードに「ルームを開く」ボタンが出ます。公開グループでも、ボタンは参加者にだけ表示されます。</span></div>
      <div class="field"><label for="g-date">日付</label><input class="inp" id="g-date" data-g="date" value="${esc(d.date)}" placeholder="例：2026/10/01"></div>
      <div class="field"><span class="lbl">公開</span><button class="btn lock-btn ${d.locked ? 'on' : ''}" type="button" data-gact="lock" aria-pressed="${d.locked}">${d.locked ? LOCK_ICON + '非公開（参加者だけ）' : UNLOCK_ICON + 'フレンドに公開'}</button></div>
    </div>
    <div class="gm-sec"><b>あなたの参加</b>${roleSwitch(d.myRole, 'data-gmyrole')}
      ${d.myRole === 'pl' ? `<select class="inp" id="g-mychar" aria-label="使う探索者"><option value="">使う探索者を選ぶ</option>${charOptions(d.myChar)}</select>` : ''}</div>
    <div class="gm-sec"><b>フレンドを招待</b><span class="hint">招待された人が、参加するときにキーパーか探索者かを選びます。</span>
      <div class="gm-friends">${friends.length ? friends.map(u => {
        const m = memberById[u.id], on = d.invite.includes(u.id), removed = d.remove.includes(u.id);
        if (m && !removed) return `<span class="gm-mem">${dot(u.username, u.id)}<b>${esc(u.username)}</b><small>${m.status === 'joined' ? (m.role ? ROLE[m.role] + 'で参加中' : '参加中') : '招待中'}</small><button class="icon-btn" type="button" data-gact="remove" data-u="${u.id}" aria-label="${esc(u.username)}をグループから外す">×</button></span>`;
        return `<button type="button" class="fchip ${on ? 'on' : ''}" style="--fc:${esc(personColor(u.id))}" data-gact="invite" data-u="${u.id}" aria-pressed="${on}"><span class="fdot">${avImg(u.id) || esc((u.username || '？').charAt(0))}</span>${esc(u.username)}${removed ? '（外す）' : ''}</button>`;
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
    ${d._new ? '' : transferHtml(d)}
    <p class="err" id="g-err" role="alert"></p>`;
  $('grp-del').hidden = !!d._new;
}
function openGroupEditor(id) {
  const g = id && G.list.find(x => x.id === id);
  const mine = g && myRow(g);
  gDraft = g
    ? { id: g.id, name: g.data.name || '', date: g.data.date || '', note: g.data.note || '', roomUrl: g.data.roomUrl || '', locked: g.locked, extras: JSON.parse(JSON.stringify(g.data.extras || [])), members: g.members, invite: [], remove: [], myRole: (mine && mine.role) || 'kp', myChar: (mine && mine.char_id) || '' }
    : { _new: true, id: uid(), name: '', date: '', note: '', roomUrl: '', locked: false, extras: [], members: [], invite: [], remove: [], myRole: 'kp', myChar: '' };
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
  if (act === 'transfer') { transferGroup(b); return; }
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
  d.roomUrl = (d.roomUrl || '').trim();
  if (d.roomUrl && !safeRoom(d.roomUrl)) { $('g-err').textContent = 'ルームURLは https:// で始まるURLを入れてください。'; $('g-room').focus(); return; }
  btn.disabled = true;
  try {
    const ch = state.chars.find(c => c.id === d.myChar);
    let r = await sb.from('groups').upsert({ id: d.id, owner: me.id, locked: !!d.locked, data: { name: d.name.trim(), date: d.date.trim(), note: d.note, roomUrl: d.roomUrl, extras: d.extras.filter(x => (x.name || '').trim() || (x.charName || '').trim()) }, updated_at: new Date().toISOString() });
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
  $('sel-desc').textContent = { friends: 'フレンドを押すと、その人の公開キャラシが見られます。真ん中からフレンドを追加できます。', groups: '代表者がグループを作ってフレンドを招待し、招待された人はキーパーか探索者かを選んで参加します。キャラ名を押すとキャラシが開きます。' }[selTab] || ((state.selView || 'orbit') === 'slide' ? 'キャラを押すとシートが開きます。いちばん左から新しい探索者をつくれます。' : 'キャラを押すとシートが開きます。真ん中から新しい探索者をつくれます。');
  renderSortBar();
  if (selTab === 'friends') { renderFriendSelect(stage); return; }
  if (selTab === 'groups') { renderGroupSelect(stage); return; }
  if ((state.selView || 'orbit') === 'slide') {
    stage.classList.remove('grid', 'listv'); stage.classList.add('slidev'); stage.style.height = '';
    stage.innerHTML = slideViewHtml(sortedChars());
    initSlide();
    return;
  }
  stage.classList.remove('slidev');
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
/* ---- スライド表示の動き ---- */
let slideRaf = 0;
function slideUpdate() {
  const tr = $('sl-track'); if (!tr) return;
  const mid = tr.scrollLeft + tr.clientWidth / 2;
  tr.querySelectorAll('.sl-card').forEach(el => {
    const d = (el.offsetLeft + el.offsetWidth / 2 - mid) / el.offsetWidth, ad = Math.min(2.5, Math.abs(d));
    el.style.setProperty('--d', Math.max(-2.5, Math.min(2.5, d)).toFixed(3));
    el.style.setProperty('--ad', ad.toFixed(3));
    el.style.zIndex = String(100 - Math.round(ad * 10));
    el.classList.toggle('center', Math.abs(d) < .5);
  });
}
function slideTo(tr, el, smooth) {
  tr.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - tr.clientWidth / 2, behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto' });
}
function initSlide() {
  const tr = $('sl-track'); if (!tr) return;
  const start = [...tr.querySelectorAll('.sel-char')].find(x => x.dataset.id === state.activeId) || tr.querySelector('.sel-char') || tr.querySelector('.sl-card');
  if (start) slideTo(tr, start, false);
  slideUpdate();
  tr.addEventListener('scroll', () => { cancelAnimationFrame(slideRaf); slideRaf = requestAnimationFrame(slideUpdate); }, { passive: true });
  // マウスのホイール・ドラッグでも横に流し、止まったら一番近いキャラを真ん中に寄せる
  let snapT = null;
  const settle = () => {
    clearTimeout(snapT);
    snapT = setTimeout(() => {
      const mid = tr.scrollLeft + tr.clientWidth / 2;
      let best = null, bd = Infinity;
      tr.querySelectorAll('.sl-card').forEach(el => { const dd = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = el; } });
      if (best) slideTo(tr, best, true);
      setTimeout(() => tr.classList.remove('free'), 600);
    }, 160);
  };
  tr.addEventListener('wheel', e => {
    const dl = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (!dl) return;
    e.preventDefault(); hidePeek(); clearTimeout(selPress);
    tr.classList.add('free'); tr.scrollLeft += dl; settle();
  }, { passive: false });
  let drag = null;
  tr.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) drag = { x: e.clientX, s: tr.scrollLeft, id: e.pointerId, moved: false }; });
  tr.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; clearTimeout(selPress); hidePeek(); tr.classList.add('free', 'dragging'); tr.setPointerCapture(e.pointerId); }
    if (drag.moved) tr.scrollLeft = drag.s - dx;
  });
  const end = () => { if (drag && drag.moved) { selLong = true; tr.classList.remove('dragging'); settle(); } drag = null; };
  tr.addEventListener('pointerup', end); tr.addEventListener('pointercancel', end);
  tr.addEventListener('focusin', e => { const c = e.target.closest('.sl-card'); if (c && !c.classList.contains('center')) slideTo(tr, c, true); });
  tr.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const cards = [...tr.querySelectorAll('.sl-card')], i = cards.findIndex(c => c.classList.contains('center'));
    const n = cards[Math.max(0, Math.min(cards.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))];
    if (n) { e.preventDefault(); n.focus({ preventScroll: true }); slideTo(tr, n, true); }
  });
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
  if (isWa() && !showSelect.inner && !reduceMotion.matches && $('select').hidden) { waDoors(() => { showSelect.inner = true; try { showSelect(); } finally { showSelect.inner = false; } }); return; }
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
  if (isWa()) { waDoors(done); return; } // 和風：襖がしまって、ひらくとシート
  if (fromEl) {
    fxAt(fromEl, true);
    fromEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)', opacity: 0 }], { duration: 520, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'forwards' });
  }
  const a = sel.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'scale(1.06)', filter: 'blur(10px)' }], { duration: 560, delay: 140, easing: 'cubic-bezier(.5, 0, .3, 1)', fill: 'forwards' });
  a.finished.then(() => {
    done(); a.cancel();
    if (bookOpening()) return;
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
  const gc = e.target.closest('[data-gcopy]');
  if (gc) { copyText(gc.dataset.gcopy, { classList: { remove() {}, add() {} }, set textContent(v) {} }, null).then(ok => toast(ok ? 'ルームURLをコピーしました。' : 'コピーできませんでした。')); return; }
  const gm = e.target.closest('[data-gm-user]');
  if (gm) { openMemberChar(gm.dataset.gmUser, gm.dataset.gmChar); return; }
  if (e.target.closest('#sel-addfriend')) { openFriends(); setTimeout(() => $('ol-name')?.focus(), 60); return; }
  if (e.target.closest('#sel-login')) { acctTab = 'login'; openAccount(); return; }
  const fb = e.target.closest('.sel-friend');
  if (fb) { if (selLong) { selLong = false; return; } if (fb.dataset.kind === 'fr') viewFriend(fb.dataset.fuid, fb.dataset.fname); else openFriends(); return; }
  const nw = e.target.closest('#sel-new');
  if (nw) { if (nw.classList.contains('sl-card') && !nw.classList.contains('center')) slideTo($('sl-track'), nw, true); else openNewChar(); return; }
  if (e.target.closest('#sel-import')) { $('btn-import').click(); return; }
  if (e.target.closest('#sel-theme')) { $('btn-theme').click(); return; }
  const ch = e.target.closest('.sel-char, .sel-row'); if (!ch) return;
  if (selLong) { selLong = false; return; }
  // スライド：奥にいるキャラを押したら、まず真ん中まで回してくる
  if (ch.classList.contains('sl-card') && !ch.classList.contains('center')) { slideTo($('sl-track'), ch, true); return; }
  state.activeId = ch.dataset.id; save();
  renderShelf(); renderSheet(); renderOutput();
  leaveSelect(ch);
  playCharBgm(active());
});
$('select').addEventListener('pointerover', e => {
  if (!canHover.matches) return;
  const ch = e.target.closest('.sel-char:not(.sel-friend):not(.sl-card), .sel-row');
  if (ch && ch.dataset.id !== peekId) showPeek(ch);
  if (!ch && peekId) hidePeek();
});
$('select').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hidePeek(); });
$('select').addEventListener('scroll', hidePeek, { passive: true });
$('select').addEventListener('pointerdown', e => {
  const ch = e.target.closest('.sel-char'); if (!ch) return;
  if (e.pointerType === 'mouse' && (e.button !== 0 || !ch.classList.contains('sl-card'))) return; // スライドはマウスでも長押しで詳細
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

/* ================= 画面の編集モード（部品の文字・色・画像・形・位置を変える） =================
   ・権限が「マスター」か「編集者」の人がログインすると「テーマ・背景」に「画面を編集する」が出る（Ctrl+Shift+E でも開く）
   ・編集中の内容は「下書き」としてこのブラウザに保存される
   ・マスター：「みんなに公開」でサーバー（ui_layout）に送り、全員の画面に反映する。編集者の仮保存を読み込んで確認できる
   ・編集者：「仮保存」でサーバー（ui_drafts）に送るだけ。公開はできない
   ・部品は「CSSセレクター」という住所で覚えておき、CSSを上書きして見た目を変える */
const UE_KEY = 'charasheet-kobo.ui-edit';
const UE_PUB_KEY = UE_KEY + '.pub';
const UE_EMPTY = () => ({ v: 1, items: {} });
const UE = {
  on: false, pause: false, sel: null, el: null, data: UE_EMPTY(), pub: UE_EMPTY(), admin: false, role: null,
  tab: 'look', users: null, userQ: '', drafts: null, saved: null, busy: false, drag: null, noClick: false,
  secOpen: { '文字': true }, sheet: 'half',
};
const UE_STATE_CLS = /^(on|off|open|land|listv|slidev|free|warn|pulse|playing|over|out|enter|leave|drag|changed|center|armed|grid|hidden|active|show|in|is-.*|has-.*|sel-has-bg|res-.*|ue-.*)$/;
const UE_SKIP_DATA = /^data-(i|id|uid|fid|u|row|p|del|ch|tk|gjoin|fv|final|max|sum|open|ring|sides|close|close-panel)$/;

const ueRead = k => { try { const s = JSON.parse(localStorage.getItem(k) || 'null'); return s && s.items ? s : null; } catch (e) { return null; } };
const ueWrite = (k, v) => { try { v ? localStorage.setItem(k, JSON.stringify(v)) : localStorage.removeItem(k); } catch (e) { toast('編集内容を保存できませんでした。'); } };
const ueItemsJson = d => JSON.stringify(d.items);
const ueSame = (a, b) => ueItemsJson(a) === ueItemsJson(b);
const ueClone = d => JSON.parse(JSON.stringify(d));
const ueIsMaster = () => UE.role === 'master';
function ueLoad() {
  UE.pub = ueRead(UE_PUB_KEY) || UE_EMPTY();       // 前回サーバーから受け取った公開版（すぐ表示するため）
  UE.data = ueRead(UE_KEY) || ueClone(UE.pub);    // 自分の下書き
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

/* ===== 権限 ===== */
/* ログインした人の権限（'master' マスター / 'editor' 編集者 / null なし） */
async function ueCheckAdmin() {
  let role = null;
  if (me && sb) {
    try {
      const r = await sb.rpc('my_app_role');
      if (!r.error) role = r.data || null;
      else { const r2 = await sb.rpc('is_app_admin'); role = r2.data === true ? 'master' : null; } // 05-app-roles.sql がまだのとき
    } catch (e) { role = null; }
  }
  UE.role = role;
  const ok = UE.admin = !!role;
  if (!ueIsMaster() && UE.tab !== 'look') UE.tab = 'look';
  const b = $('ue-open'); if (b) b.hidden = !ok;
  if (!ok && UE.on) ueStop(); else if (UE.on) ueRenderBody();
}
const ueNoPick = () => UE.pause || UE.tab !== 'look';
const UE_ROLE = { master: 'マスター', editor: '編集者', none: 'なし' };
async function ueLoadUsers() {
  UE.users = null; ueRenderBody();
  const { data, error } = await sb.rpc('app_users_list');
  UE.users = error ? { err: jaErr(error) } : (data || []);
  ueRenderBody();
}
function ueRolesHtml() {
  if (!UE.users) return '<p class="ue-hint">読み込み中…</p>';
  if (UE.users.err) return `<p class="ue-hint">${esc(UE.users.err)}</p>`;
  const q = UE.userQ.trim().toLowerCase();
  const list = UE.users.filter(u => !q || String(u.username).toLowerCase().includes(q));
  return `<p class="ue-hint">マスター：画面の編集・公開・権限の変更<br>編集者：画面の編集と仮保存だけ（公開はできない）</p>
    <input type="search" class="ue-search" id="ue-user-q" placeholder="ユーザー名でさがす" value="${esc(UE.userQ)}">
    <div class="ue-users">${list.map(u => `<label class="ue-user"><span>${esc(u.username)}${me && u.user_id === me.id ? '<small>（あなた）</small>' : ''}</span>
      <select data-ue-role="${esc(u.user_id)}">${Object.entries(UE_ROLE).map(([k, l]) => `<option value="${k}" ${(u.role || 'none') === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`).join('') || '<p class="ue-hint">見つかりません</p>'}</div>`;
}
async function ueSetRole(sel) {
  const u = UE.users.find(x => x.user_id === sel.dataset.ueRole); if (!u) return;
  const role = sel.value, before = u.role || 'none';
  if (me && u.user_id === me.id && role !== 'master' && !confirm('自分の権限を下げると、公開や権限の変更ができなくなります。よろしいですか？')) { sel.value = before; return; }
  sel.disabled = true;
  const { data, error } = await sb.rpc('set_app_role', { target: u.user_id, new_role: role });
  sel.disabled = false;
  if (error || data !== 'ok') { sel.value = before; toast(error ? jaErr(error) : data); return; }
  u.role = role === 'none' ? null : role;
  toast(`${u.username}さんを「${UE_ROLE[role]}」にしました`);
  if (me && u.user_id === me.id) ueCheckAdmin();
}

/* ===== 公開（マスター）と仮保存（編集者） ===== */
async function uePublish() {
  if (!ueIsMaster() || !sb || !me || UE.busy) return;
  UE.busy = true; ueRenderFoot();
  try {
    const { error } = await sb.from('ui_layout').upsert({ id: 'main', data: UE.data, updated_at: new Date().toISOString(), updated_by: me.id });
    if (error) throw error;
    UE.pub = ueClone(UE.data); ueWrite(UE_PUB_KEY, UE.pub);
    toast('みんなの画面に公開しました');
  } catch (e) { toast(/row-level security|permission/i.test(String(e && e.message)) ? '公開できませんでした。公開できるのはマスターだけです。' : jaErr(e)); }
  finally { UE.busy = false; ueRenderFoot(); }
}
async function ueSaveDraft() {
  if (!UE.admin || !sb || !me || UE.busy) return;
  UE.busy = true; ueRenderFoot();
  try {
    const { error } = await sb.from('ui_drafts').upsert({ user_id: me.id, data: UE.data, updated_at: new Date().toISOString() });
    if (error) throw error;
    UE.saved = ueItemsJson(UE.data);
    toast('仮保存しました。マスターが確認して公開します。');
  } catch (e) { toast(/does not exist|Could not find/i.test(String(e && e.message)) ? '仮保存の準備（06のSQL）がまだのようです。マスターに伝えてください。' : jaErr(e)); }
  finally { UE.busy = false; ueRenderFoot(); }
}
/* 編集者：サーバーにある自分の仮保存を受け取る（別の端末で続きをするため） */
async function ueLoadMyDraft() {
  UE.saved = ueItemsJson(UE.pub);
  if (!sb || !me) return;
  try {
    const { data } = await sb.from('ui_drafts').select('data').eq('user_id', me.id).maybeSingle();
    if (data && data.data && data.data.items) {
      UE.saved = ueItemsJson(data.data);
      if (ueSame(UE.data, UE.pub)) { UE.data = ueClone(data.data); ueSave(); }
    }
  } catch (e) { /* なければそのまま */ }
  if (UE.on) ueRenderBody();
}
/* マスター：みんなの仮保存の一覧 */
async function ueLoadDrafts() {
  UE.drafts = null; ueRenderBody();
  try {
    const { data, error } = await sb.from('ui_drafts').select('user_id,data,updated_at').order('updated_at', { ascending: false });
    if (error) throw error;
    const ids = (data || []).map(d => d.user_id);
    const names = {};
    if (ids.length) {
      const { data: ps } = await sb.from('profiles').select('id,username').in('id', ids);
      (ps || []).forEach(p => { names[p.id] = p.username; });
    }
    UE.drafts = (data || []).map(d => ({ ...d, name: names[d.user_id] || '（不明なユーザー）' }));
  } catch (e) { UE.drafts = { err: /does not exist|Could not find/i.test(String(e && e.message)) ? '仮保存の準備（06のSQL）がまだのようです。' : jaErr(e) }; }
  ueRenderBody();
}
function ueDraftsHtml() {
  if (!UE.drafts) return '<p class="ue-hint">読み込み中…</p>';
  if (UE.drafts.err) return `<p class="ue-hint">${esc(UE.drafts.err)}</p>`;
  if (!UE.drafts.length) return '<p class="ue-hint">まだ仮保存はありません。編集者が「仮保存」を押すと、ここに出ます。</p>';
  return `<p class="ue-hint">「読み込んで見る」を押すと、その内容を自分の下書きにして画面で確かめられます。よければ「みんなに公開」を押してください。</p>
    ${UE.drafts.map((d, i) => `<div class="ue-draft"><b>${esc(d.name)}</b>${me && d.user_id === me.id ? '<small>（あなた）</small>' : ''}
      <span>${esc(new Date(d.updated_at).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }))} ・ 部品${Object.keys((d.data && d.data.items) || {}).length}個</span>
      <div class="ue-row"><button type="button" class="ue-b" data-ue-dload="${i}">読み込んで見る</button><button type="button" class="ue-b danger" data-ue-ddel="${i}">削除</button></div></div>`).join('')}`;
}

/* ===== 部品の住所（セレクター） ===== */
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

/* ===== 変えられる項目 ===== */
const UE_FONTS = [
  ['', '元のまま'],
  ['sys', '標準ゴシック', 'system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif'],
  ['mincho', '標準明朝', '"Hiragino Mincho ProN", "Yu Mincho", YuMincho, serif'],
  ['Noto Sans JP', 'Noto Sans（ゴシック）'], ['Noto Serif JP', 'Noto Serif（明朝）'],
  ['M PLUS Rounded 1c', 'M PLUS Rounded（丸ゴシック）'], ['Zen Maru Gothic', 'Zen丸ゴシック'], ['Kosugi Maru', '小杉丸ゴシック'],
  ['Shippori Mincho', 'しっぽり明朝'], ['Zen Old Mincho', 'Zenオールド明朝'], ['Kaisei Decol', '解星デコール'],
  ['Klee One', 'クレー（手書き風）'], ['Yusei Magic', '油性マジック'], ['Hachi Maru Pop', 'はちまるポップ'],
  ['Yuji Syuku', '佑字 肅（毛筆）'], ['DotGothic16', 'ドットゴシック'], ['RocknRoll One', 'ロックンロール'],
  ['Reggae One', 'レゲエ'], ['Dela Gothic One', 'デラゴシック（極太）'],
];
const ueFontStack = k => { const f = UE_FONTS.find(x => x[0] === k); return f ? f[2] || `"${f[0]}", sans-serif` : ''; };
const ueFontIsWeb = k => !!k && UE_FONTS.some(x => x[0] === k && !x[2]);
const UE_SHADOW = { none: 'none', soft: '0 6px 20px rgba(0,0,0,.18)', strong: '0 4px 0 rgba(0,0,0,.35)', glow: '0 0 18px 4px color-mix(in srgb, var(--sky) 55%, transparent)', inset: 'inset 0 2px 10px rgba(0,0,0,.3)' };
const UE_TSHADOW = { none: 'none', soft: '0 2px 6px rgba(0,0,0,.35)', glow: '0 0 10px color-mix(in srgb, var(--sky) 80%, white)', outline: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', white: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' };
const UE_CLIP = {
  circle: 'circle(50% at 50% 50%)', ellipse: 'ellipse(50% 50% at 50% 50%)',
  hex: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)', diamond: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
  star: 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  slant: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)', arrow: 'polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)',
  ribbon: 'polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)', cut: 'polygon(12% 0, 88% 0, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0 88%, 0 12%)',
};
const ueOpts = opts => [['', '元のまま'], ...opts];
/* type: num（数字）/ color（色）/ select（選ぶ）/ 特別なものは render で描く */
const UE_SECS = [
  ['文字', [
    { k: 'text', special: 'text' },
    { k: 'font', label: 'フォント', type: 'select', opts: UE_FONTS.map(f => [f[0], f[1]]) },
    { k: 'fs', label: '文字サイズ', type: 'num', min: 6, max: 96, cur: 'font-size', css: v => `font-size:${v}px` },
    { k: 'fw', label: '太さ', type: 'select', opts: ueOpts([['300', '細い'], ['400', '普通'], ['700', '太い'], ['900', '極太']]), css: v => `font-weight:${v}` },
    { k: 'ls', label: '文字の間隔', type: 'num', min: -5, max: 30, step: .5, css: v => `letter-spacing:${v}px` },
    { k: 'lh', label: '行の高さ', type: 'num', min: .8, max: 3, step: .1, css: v => `line-height:${v}` },
    { k: 'ta', label: 'そろえ', type: 'select', opts: ueOpts([['left', '左'], ['center', '中央'], ['right', '右']]), css: v => `text-align:${v}` },
    { k: 'color', label: '文字色', type: 'color', cur: 'color', css: v => `color:${v};-webkit-text-fill-color:${v}` },
    { k: 'tsh', label: '文字の影', type: 'select', opts: ueOpts([['none', 'なし'], ['soft', 'やわらかい影'], ['glow', '光る'], ['outline', '黒いふち'], ['white', '白いふち']]), css: v => `text-shadow:${UE_TSHADOW[v]}` },
  ]],
  ['色・画像', [
    { k: 'bg', label: '背景色', type: 'color', cur: 'background-color', css: v => `background:${v}` },
    { k: 'img', special: 'img' },
    { k: 'fit', label: '画像の合わせ方', type: 'select', opts: ueOpts([['cover', 'いっぱいに（はみ出しは切る）'], ['contain', '全体が入るように'], ['fill', '引きのばす'], ['repeat', 'タイルのように並べる'], ['auto', 'そのままの大きさ']]) },
    { k: 'op', label: '透明度（%）', type: 'num', min: 0, max: 100, cur: o => Math.round(parseFloat(o.opacity) * 100), css: v => `opacity:${v / 100}` },
  ]],
  ['形', [
    { k: 'w', label: '横幅', type: 'num', min: 0, max: 1600, cur: 'width', css: v => `width:${v}px;min-width:0;max-width:none` },
    { k: 'h', label: '高さ', type: 'num', min: 0, max: 1200, cur: 'height', css: v => `height:${v}px;min-height:0;max-height:none` },
    { k: 'pad', label: '内側の余白', type: 'num', min: 0, max: 80, cur: 'padding-top', css: v => `padding:${v}px` },
    { k: 'mar', label: '外側の余白', type: 'num', min: -40, max: 80, cur: 'margin-top', css: v => `margin:${v}px` },
    { k: 'rad', label: '角の丸み', type: 'num', min: 0, max: 200, cur: 'border-top-left-radius', css: v => `border-radius:${v}px` },
    { k: 'shape', label: '切り抜く形', type: 'select', opts: ueOpts([['circle', '円'], ['ellipse', 'だ円'], ['hex', '六角形'], ['diamond', 'ひし形'], ['star', '星'], ['cut', '角を切る'], ['slant', '平行四辺形'], ['arrow', '矢印'], ['ribbon', 'リボン']]), css: v => `clip-path:${UE_CLIP[v]}` },
    { k: 'bw', label: 'ふちの太さ', type: 'num', min: 0, max: 20 },
    { k: 'bc', label: 'ふちの色', type: 'color', cur: 'border-top-color' },
    { k: 'shadow', label: '影', type: 'select', opts: ueOpts([['none', 'なし'], ['soft', 'やわらかい影'], ['strong', 'くっきりした影'], ['glow', '光る'], ['inset', '内側にへこむ']]), css: v => `box-shadow:${UE_SHADOW[v]}` },
    { k: 'rot', label: '回転（度）', type: 'num', min: -180, max: 180, css: v => `rotate:${v}deg` },
    { k: 'sc', label: '拡大（%）', type: 'num', min: 10, max: 300, css: v => `scale:${v / 100}` },
  ]],
  ['位置・表示', [
    { k: 'pos', special: 'pos' },
    { k: 'hide', special: 'hide' },
  ]],
];
const UE_PROPS = UE_SECS.flatMap(([, rows]) => rows);
const ueHas = (o, k) => o[k] != null && o[k] !== '';

/* 上書き用のCSSを作る */
function ueCss() {
  let css = '';
  Object.entries(ueShown().items).forEach(([s, o]) => {
    const d = [];
    UE_PROPS.forEach(p => { if (p.css && ueHas(o, p.k)) d.push(...p.css(o[p.k]).split(';')); });
    if (ueHas(o, 'bw')) d.push(`border:${o.bw}px solid ${o.bc || 'currentColor'}`);
    else if (o.bc) d.push(`border-color:${o.bc}`);
    if (o.img && o.tag !== 'img') {
      d.push(`background-image:url("${String(o.img).replace(/["\\\n]/g, '')}")`);
      const f = o.fit || 'cover';
      if (f === 'repeat') d.push('background-repeat:repeat', 'background-size:auto');
      else d.push('background-repeat:no-repeat', 'background-position:center', `background-size:${f === 'fill' ? '100% 100%' : f}`);
    }
    if (o.tag === 'img' && o.fit && o.fit !== 'repeat') d.push(`object-fit:${o.fit === 'auto' ? 'none' : o.fit}`);
    if (o.x || o.y) {
      const [tx, ty] = (o.tb && o.tb !== 'none' ? o.tb : '0px 0px').split(' ');
      d.push(`translate:calc(${tx} + ${o.x || 0}px) calc(${ty || '0px'} + ${o.y || 0}px)`);
    }
    if (d.length) css += `${s}{${d.map(x => x + ' !important').join(';')}}\n`;
    // フォントは、アプリが中の部品ごとに決めているので、中の部品にもまとめて効かせる
    if (o.font) css += `${s}, ${s} *:not(svg):not(svg *){font-family:${ueFontStack(o.font)} !important}\n`;
    if (o.hide) css += `body:not(.ue-on) ${s}{display:none !important}\nbody.ue-on ${s}{opacity:.3 !important;outline:2px dashed #e2483d !important}\n`;
  });
  return css;
}
const ueShown = () => UE.on ? UE.data : UE.pub;   // 編集中は下書き、それ以外は公開版を表示
/* 文言と <img> の画像は、CSSでは変えられないので直接書きかえる */
let ueObs = null, ueRaf = 0;
const ueNeedsDom = o => o.text != null || (o.img && o.tag === 'img');
function ueDom() {
  ueRaf = 0;
  Object.entries(ueShown().items).forEach(([s, o]) => {
    if (!ueNeedsDom(o)) return;
    let els = [];
    try { els = document.querySelectorAll(s); } catch (e) { return; }
    els.forEach(e => {
      if (o.text != null && !e.children.length && e.textContent !== o.text) e.textContent = o.text;
      if (o.img && o.tag === 'img' && e.tagName === 'IMG' && e.getAttribute('src') !== o.img) { e.removeAttribute('srcset'); e.src = o.img; }
    });
  });
}
function ueFonts() {
  const used = new Set(Object.values(ueShown().items).map(o => o.font).filter(ueFontIsWeb));
  used.forEach(f => {
    const id = 'ue-font-' + f.replace(/\W/g, '');
    if ($(id)) return;
    const l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}&display=swap`;
    document.head.appendChild(l);
  });
}
function ueApply() {
  let st = $('ue-style');
  if (!st) { st = document.createElement('style'); st.id = 'ue-style'; document.head.appendChild(st); }
  st.textContent = ueCss();
  ueFonts();
  const need = Object.values(ueShown().items).some(ueNeedsDom);
  if (need && !ueObs) {
    // 画面が描き直されても変更を保つ
    ueObs = new MutationObserver(() => { if (!ueRaf) ueRaf = requestAnimationFrame(ueDom); });
    ueObs.observe(document.body, { childList: true, subtree: true, characterData: true });
  } else if (!need && ueObs) { ueObs.disconnect(); ueObs = null; }
  ueDom();
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

/* 画像をサーバー（Storage）に置いて、そのURLを返す */
async function ueUpload(file) {
  const url = await loadImageData(file, 1600, .85);
  if (sb && me) {
    try {
      const blob = await (await fetch(url)).blob();
      const path = `${me.id}/${Date.now()}.${blob.type === 'image/png' ? 'png' : 'webp'}`;
      const { error } = await sb.storage.from('ui-assets').upload(path, blob, { contentType: blob.type });
      if (error) throw error;
      return sb.storage.from('ui-assets').getPublicUrl(path).data.publicUrl;
    } catch (e) { /* 下で直接入れる */ }
  }
  if (url.length < 400000) { toast('画像をサーバーに置けなかったので、編集内容の中に直接入れました（06のSQLを実行すると軽くなります）'); return url; }
  throw new Error('画像をサーバーに置けませんでした。06のSQLを実行したか確認するか、小さい画像にしてください。');
}

/* ===== パネル ===== */
function uePanelHtml() {
  return `<div class="ue-grip" id="ue-grip" role="button" aria-label="パネルの高さを変える"><i></i></div>
    <div class="ue-head"><b>画面の編集</b>
      <button type="button" class="ue-b" id="ue-pause"></button>
      <button type="button" class="ue-b" id="ue-exit" aria-label="編集モードを終える">終了</button></div>
    <div class="ue-tabs" id="ue-tabs" hidden>
      <button type="button" data-ue-tab="look">見た目</button><button type="button" data-ue-tab="drafts">仮保存</button><button type="button" data-ue-tab="roles">権限</button>
    </div>
    <div class="ue-body" id="ue-body"></div>
    <div class="ue-foot">
      <div class="ue-pub" id="ue-pub"></div>
      <details class="ue-more"><summary>変更した部品 <span id="ue-count"></span>・その他</summary>
        <div id="ue-list"></div>
        <div class="ue-row">
          <button type="button" class="ue-b" id="ue-export">書き出し</button>
          <button type="button" class="ue-b" id="ue-import">読み込み</button>
          <button type="button" class="ue-b danger" id="ue-reset-all">すべて元に戻す</button>
        </div>
        <textarea id="ue-io" hidden placeholder="書き出した内容をここに貼り付けて「読み込む」を押してください"></textarea>
        <button type="button" class="ue-b" id="ue-io-go" hidden>読み込む</button>
      </details>
    </div>`;
}
function ueRenderFoot() {
  if (!$('ue-pub')) return;
  $('ue-pause').textContent = UE.pause ? '部品を選ぶ' : 'アプリを操作する';
  $('ue-pause').classList.toggle('on', UE.pause);
  $('ue-pause').hidden = UE.tab !== 'look';
  $('ue-tabs').hidden = !ueIsMaster();
  document.querySelectorAll('[data-ue-tab]').forEach(b => b.classList.toggle('on', b.dataset.ueTab === UE.tab));
  const n = Object.keys(UE.data.items).length;
  $('ue-count').textContent = n ? `（${n}）` : '';
  $('ue-list').innerHTML = n ? Object.entries(UE.data.items).map(([s, o]) =>
    `<button type="button" class="ue-li" data-ue-sel="${esc(s)}">${esc(o.label || s)}</button>`).join('') : '<p class="ue-hint">まだありません</p>';
  const diffPub = !ueSame(UE.data, UE.pub), busy = UE.busy;
  if (ueIsMaster()) {
    $('ue-pub').innerHTML = `<p class="ue-hint">${diffPub ? '<b class="ue-dirty">● まだ公開していない変更があります</b>（みんなの画面はまだ前のまま）' : 'みんなの画面と同じです'}</p>
      <div class="ue-row"><button type="button" class="ue-b on" id="ue-publish" ${diffPub && !busy ? '' : 'disabled'}>${busy ? '送信中…' : 'みんなに公開'}</button>
      <button type="button" class="ue-b" id="ue-discard" ${diffPub && !busy ? '' : 'disabled'}>公開中の状態に戻す</button></div>`;
  } else {
    const unsaved = UE.saved != null && ueItemsJson(UE.data) !== UE.saved;
    $('ue-pub').innerHTML = `<p class="ue-hint">${unsaved ? '<b class="ue-dirty">● 仮保存していない変更があります</b>' : diffPub ? '仮保存ずみです。マスターが確認して公開します。' : '公開中の画面と同じです'}</p>
      <div class="ue-row"><button type="button" class="ue-b on" id="ue-draft-save" ${unsaved && !busy ? '' : 'disabled'}>${busy ? '送信中…' : '仮保存する'}</button>
      <button type="button" class="ue-b" id="ue-discard" ${diffPub && !busy ? '' : 'disabled'}>公開中の状態に戻す</button></div>`;
  }
}
function ueField(p, o, cs) {
  const has = ueHas(o, p.k);
  const clr = `<button type="button" class="ue-x" data-ue-clear="${p.k}" ${has ? '' : 'disabled'} aria-label="${p.label}を元に戻す">↺</button>`;
  if (p.type === 'color') {
    const cur = has ? o[p.k] : ueHex(p.cur ? cs.getPropertyValue(p.cur) : '') || '#000000';
    return `<label class="ue-f"><span>${p.label}</span><input type="color" data-ue-k="${p.k}" value="${esc(cur)}">${clr}</label>`;
  }
  if (p.type === 'select') {
    return `<label class="ue-f ue-f2"><span>${p.label}</span><select data-ue-k="${p.k}">${p.opts.map(([v, l]) => `<option value="${esc(v)}" ${String(o[p.k] ?? '') === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>${clr}</label>`;
  }
  // 数字：設定していないときは、いまの値を目安に出す
  let cur = '';
  if (has) cur = o[p.k];
  else if (typeof p.cur === 'function') cur = p.cur(cs);
  else if (p.cur) { const v = parseFloat(cs.getPropertyValue(p.cur)); cur = isNaN(v) ? '' : Math.round(v); }
  const step = p.step ? `step="${p.step}"` : '';
  return `<label class="ue-f"><span>${p.label}</span>
    <input type="range" min="${p.min}" max="${p.max}" ${step} value="${cur === '' ? (p.min + p.max) / 2 : cur}" data-ue-k="${p.k}">
    <input type="number" ${step} value="${cur}" placeholder="—" data-ue-k="${p.k}">${clr}</label>`;
}
function ueSpecial(p, o, el) {
  if (p.special === 'text') {
    const leaf = !el.children.length && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && !(el instanceof SVGElement);
    return leaf ? `<label class="ue-f ue-col"><span>文言</span><textarea data-ue-k="text" rows="2">${esc(o.text != null ? o.text : el.textContent)}</textarea></label>`
      : '<p class="ue-hint">文言は、中に別の部品がない一番内側の部品で変えられます（「内側へ」で選び直してください）。</p>';
  }
  if (p.special === 'img') {
    const isImg = el.tagName === 'IMG';
    return `<div class="ue-f ue-col"><span>${isImg ? '画像（差しかえ）' : '背景の画像'}</span>
      ${o.img ? `<div class="ue-thumb" style="background-image:url('${esc(String(o.img).replace(/'/g, ''))}')"></div>` : ''}
      <div class="ue-row"><label class="ue-b">画像を選ぶ<input type="file" accept="image/*" id="ue-img-file" hidden></label>
      <button type="button" class="ue-b" data-ue-clear="img,tag" ${o.img ? '' : 'disabled'}>画像を外す</button></div>
      <input type="url" class="ue-search" data-ue-k="img" placeholder="または画像のURLを貼る" value="${o.img && !String(o.img).startsWith('data:') ? esc(o.img) : ''}"></div>`;
  }
  if (p.special === 'pos') {
    return `<label class="ue-f ue-pos"><span>位置（横・縦）</span>
      <input type="number" data-ue-k="x" value="${o.x || 0}"><input type="number" data-ue-k="y" value="${o.y || 0}">
      <button type="button" class="ue-x" data-ue-clear="x,y,tb" ${o.x || o.y ? '' : 'disabled'} aria-label="位置を元に戻す">↺</button></label>
      <p class="ue-hint">選んだ部品はドラッグで動かせます。右下の四角をドラッグすると大きさを変えられます。</p>`;
  }
  if (p.special === 'hide') return `<label class="ue-f ue-chk"><input type="checkbox" data-ue-k="hide" ${o.hide ? 'checked' : ''}> この部品を隠す</label>`;
  return '';
}
function ueRenderBody() {
  const body = $('ue-body'); if (!body) return;
  ueRenderFoot();
  if (UE.tab === 'roles') {
    const f = document.activeElement && document.activeElement.id === 'ue-user-q', pos = f ? document.activeElement.selectionStart : 0;
    body.innerHTML = ueRolesHtml();
    if (f) { const i = $('ue-user-q'); i.focus(); i.setSelectionRange(pos, pos); }
    return;
  }
  if (UE.tab === 'drafts') { body.innerHTML = ueDraftsHtml(); return; }
  if (UE.pause) { body.innerHTML = '<p class="ue-hint">いまはアプリを普通に操作できます。編集したい画面（ウィンドウなど）を開いてから「部品を選ぶ」を押してください。</p>'; return; }
  const el = UE.el;
  if (!el || !el.isConnected) {
    body.innerHTML = `<p class="ue-hint">画面の中の部品を押すと、ここで文字・色・画像・形を変えられます。<br>選んだ部品はドラッグで動かせます。<br>Escキーで選ぶのをやめます。</p>
      ${ueIsMaster() ? '' : '<p class="ue-hint">編集者は「仮保存」までできます。みんなの画面に出すのはマスターです。</p>'}`;
    return;
  }
  const o = UE.data.items[UE.sel] || {}, cs = getComputedStyle(el);
  const scroll = body.scrollTop;
  body.innerHTML = `
    <div class="ue-sel"><b>${esc(ueLabel(el))}</b><small>${esc(el.tagName.toLowerCase())}</small>
      <span class="ue-nav"><button type="button" class="ue-b" id="ue-parent" ${el.parentElement && el.parentElement !== document.body ? '' : 'disabled'}>外側へ</button><button type="button" class="ue-b" id="ue-child" ${el.firstElementChild && !(el instanceof SVGElement) ? '' : 'disabled'}>内側へ</button></span></div>
    ${UE_SECS.map(([name, rows]) => `<details class="ue-sec" data-ue-sec="${name}" ${UE.secOpen[name] ? 'open' : ''}><summary>${name}${rows.some(p => ueHas(o, p.k) || (p.k === 'pos' && (o.x || o.y))) ? ' <i class="ue-dot">●</i>' : ''}</summary>
      ${rows.map(p => p.special ? ueSpecial(p, o, el) : ueField(p, o, cs)).join('')}</details>`).join('')}
    <button type="button" class="ue-b danger wide" id="ue-reset" ${UE.data.items[UE.sel] ? '' : 'disabled'}>この部品を元に戻す</button>`;
  body.scrollTop = scroll;
}
function ueSet(k, v) {
  if (!UE.sel) return;
  const o = UE.data.items[UE.sel] = UE.data.items[UE.sel] || {};
  o.label = o.label || ueLabel(UE.el);
  if (v === '' || v == null || v === false) delete o[k]; else o[k] = v;
  if (Object.keys(o).every(x => x === 'label')) delete UE.data.items[UE.sel];
  ueSave(); ueRenderFoot();
}
const ueBaseTranslate = el => { const st = $('ue-style'); st.disabled = true; const t = getComputedStyle(el).translate || 'none'; st.disabled = false; return t; };
function ueSelect(el) {
  if (!el || el === document.body || el === document.documentElement) return;
  UE.el?.classList.remove('ue-picked');
  UE.el = el; UE.sel = ueSelector(el);
  el.classList.add('ue-picked');
  if (ueMobile() && UE.sheet === 'min') ueSheet('half');
  ueRenderBody(); uePlaceBox();
  ueReveal(el);
}
const ueMobile = () => matchMedia('(max-width: 720px)').matches;
function ueSheet(k) {
  UE.sheet = k;
  const p = $('ue-panel'); if (p) p.dataset.sheet = k;
  setTimeout(() => { if (UE.el) ueReveal(UE.el); uePlaceBox(); }, 220);
}
/* 選んだ部品がパネルの下に隠れていたら、見える位置までスクロールする */
function ueReveal(el) {
  const p = $('ue-panel'); if (!p || !ueMobile() || !el.isConnected) return;
  const top = p.getBoundingClientRect().top, r = el.getBoundingClientRect();
  if (r.bottom > top - 8) {
    const sc = (function find(n) { for (; n && n !== document.body; n = n.parentElement) { const st = getComputedStyle(n); if (/(auto|scroll)/.test(st.overflowY) && n.scrollHeight > n.clientHeight) return n; } return null; })(el.parentElement);
    const dy = r.bottom - top + 24;
    if (sc) sc.scrollBy({ top: dy, behavior: 'smooth' }); else window.scrollBy({ top: dy, behavior: 'smooth' });
    setTimeout(uePlaceBox, 400);
  }
}
function uePlaceBox() {
  const box = $('ue-box'); if (!box) return;
  const el = UE.el;
  if (!UE.on || ueNoPick() || !el || !el.isConnected) { box.hidden = true; return; }
  const r = el.getBoundingClientRect();
  box.hidden = false;
  Object.assign(box.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
}
function ueHover(el) {
  const h = $('ue-hover'); if (!h) return;
  if (!el || ueNoPick()) { h.hidden = true; return; }
  const r = el.getBoundingClientRect();
  h.hidden = false;
  Object.assign(h.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
}

/* ===== マウス・指の操作 ===== */
const ueInPanel = t => t && t.closest && t.closest('#ue-panel');
function ueOnPointerDown(e) {
  if (!UE.on || ueNoPick() || ueInPanel(e.target)) return;
  e.preventDefault(); e.stopPropagation();
  if (e.button !== 0 || !UE.el) return;
  const o = UE.data.items[UE.sel] || {};
  if (e.target.id === 'ue-handle') {
    const r = UE.el.getBoundingClientRect();
    UE.drag = { resize: true, sx: e.clientX, sy: e.clientY, w0: ueHas(o, 'w') ? o.w : Math.round(r.width), h0: ueHas(o, 'h') ? o.h : Math.round(r.height), moved: false };
  } else if (UE.el.contains(e.target)) {
    UE.drag = { sx: e.clientX, sy: e.clientY, x0: o.x || 0, y0: o.y || 0, moved: false };
  }
}
function ueOnPointerMove(e) {
  if (!UE.on || ueNoPick()) return;
  if (UE.drag) {
    const d = UE.drag, dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    const o = UE.data.items[UE.sel] = UE.data.items[UE.sel] || { label: ueLabel(UE.el) };
    if (!d.moved) { d.moved = true; if (!d.resize && o.tb == null) o.tb = ueBaseTranslate(UE.el); }
    if (d.resize) { o.w = Math.max(4, Math.round(d.w0 + dx)); o.h = Math.max(4, Math.round(d.h0 + dy)); }
    else { o.x = Math.round(d.x0 + dx); o.y = Math.round(d.y0 + dy); }
    $('ue-style').textContent = ueCss(); uePlaceBox();
    return;
  }
  if (!ueInPanel(e.target) && e.target.id !== 'ue-handle') ueHover(e.target); else ueHover(null);
}
function ueOnPointerUp(e) {
  if (!UE.drag) return;
  const moved = UE.drag.moved; UE.drag = null;
  if (moved) { UE.noClick = true; ueSave(); ueRenderBody(); e.stopPropagation(); }
}
function ueOnClick(e) {
  if (!UE.on || ueNoPick() || ueInPanel(e.target)) return;
  e.preventDefault(); e.stopPropagation();
  if (UE.noClick) { UE.noClick = false; return; }
  if (e.target.id === 'ue-handle') return;
  let t = e.target;
  if (t.closest('#toast')) { $('toast').hidden = true; t = document.elementFromPoint(e.clientX, e.clientY) || t; }
  ueSelect(t.ownerSVGElement ? t.closest('svg') : t);
}
const ueBlock = e => { if (UE.on && !ueNoPick() && !ueInPanel(e.target)) { e.preventDefault(); e.stopPropagation(); } };

function ueStart() {
  if (UE.on) return;
  if (!UE.admin) { toast('画面の編集は、マスターか編集者としてログインしているときだけ使えます'); return; }
  closeModals();
  UE.on = true; UE.pause = false; UE.tab = 'look';
  document.body.classList.add('ue-on');
  const p = document.createElement('aside');
  p.id = 'ue-panel'; p.className = 'ue-panel'; p.setAttribute('aria-label', '画面の編集'); p.dataset.sheet = UE.sheet;
  p.innerHTML = uePanelHtml();
  document.body.appendChild(p);
  ['ue-box', 'ue-hover'].forEach(id => { const b = document.createElement('div'); b.id = id; b.className = id; b.hidden = true; document.body.appendChild(b); });
  const h = document.createElement('span'); h.id = 'ue-handle'; h.title = 'ドラッグで大きさを変える'; $('ue-box').appendChild(h);
  ueRenderBody(); ueApply();
  if (!ueIsMaster()) ueLoadMyDraft();
}
function ueStop() {
  UE.el?.classList.remove('ue-picked');
  UE.on = false; UE.el = null; UE.sel = null; UE.drag = null;
  document.body.classList.remove('ue-on');
  ['ue-panel', 'ue-box', 'ue-hover'].forEach(id => $(id)?.remove());
  ueApply();
  if (!ueSame(UE.data, UE.pub)) toast(ueIsMaster() ? '未公開の変更は下書きとして残っています。みんなの画面には公開した分だけが出ます。' : '編集内容は下書きとして残っています。みんなの画面に出るのは、マスターが公開したときです。');
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
    if (UE.el) { UE.el.classList.remove('ue-picked'); UE.el = null; UE.sel = null; ueRenderBody(); uePlaceBox(); } else ueStop();
  }
}, true);
/* スマホ：つまみを押すと 小→中→大 と切りかえ、上下にドラッグしても変えられる */
let ueGrip = null;
document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('#ue-grip')) ueGrip = { y: e.clientY, moved: false }; }, true);
document.addEventListener('pointermove', e => {
  if (!ueGrip) return;
  const dy = e.clientY - ueGrip.y; if (Math.abs(dy) < 30) return;
  const order = ['min', 'half', 'full'], i = order.indexOf(UE.sheet);
  const j = Math.max(0, Math.min(2, i + (dy < 0 ? 1 : -1)));
  ueGrip = { y: e.clientY, moved: true };
  if (j !== i) ueSheet(order[j]);
}, true);
document.addEventListener('pointerup', e => {
  if (!ueGrip) return;
  const g = ueGrip; ueGrip = null;
  if (!g.moved) ueSheet({ min: 'half', half: 'full', full: 'min' }[UE.sheet]);
}, true);
document.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.ueSec) UE.secOpen[d.dataset.ueSec] = d.open; }, true);

/* ===== パネルの中の操作 ===== */
function ueInput(e) {
  const t = e.target, k = t.dataset && t.dataset.ueK; if (!k || !ueInPanel(t)) return;
  let v;
  if (t.type === 'checkbox') v = t.checked;
  else if (t.type === 'range' || t.type === 'number') {
    v = t.value === '' ? '' : Number(t.value);
    t.closest('.ue-f').querySelectorAll(`[data-ue-k="${k}"]`).forEach(x => { if (x !== t) x.value = t.value; });
    if ((k === 'x' || k === 'y') && UE.data.items[UE.sel]?.tb == null) ueSet('tb', ueBaseTranslate(UE.el));
  } else v = t.value;
  if (k === 'text' && v === UE.el.textContent && UE.data.items[UE.sel]?.text == null) return;
  if (k === 'img') { v = v.trim(); if (v && !/^https?:\/\//.test(v)) return; ueSet('tag', v && UE.el.tagName === 'IMG' ? 'img' : ''); }
  ueSet(k, v);
  const clr = t.closest('.ue-f')?.querySelector('.ue-x'); if (clr) clr.disabled = !ueHas(UE.data.items[UE.sel] || {}, k);
  const rs = $('ue-reset'); if (rs) rs.disabled = !UE.data.items[UE.sel];
  if (k === 'img' || k === 'fit') ueRenderBody();
}
document.addEventListener('input', e => {
  if (!ueInPanel(e.target)) return;
  if (e.target.id === 'ue-user-q') { UE.userQ = e.target.value; ueRenderBody(); return; }
  if (e.target.type === 'file' || e.target.tagName === 'SELECT' && e.target.dataset.ueRole) return;
  if (e.target.type === 'url') return; // URL は貼り終わってから（change）
  ueInput(e);
});
document.addEventListener('change', async e => {
  const t = e.target; if (!ueInPanel(t)) return;
  if (t.dataset.ueRole) return ueSetRole(t);
  if (t.type === 'checkbox' || t.type === 'url') return ueInput(e);
  if (t.id === 'ue-img-file' && t.files[0]) {
    const el = UE.el, s = UE.sel;
    toast('画像を読み込んでいます…');
    try {
      const url = await ueUpload(t.files[0]);
      if (UE.sel !== s) return;
      ueSet('tag', el.tagName === 'IMG' ? 'img' : '');
      ueSet('img', url);
      ueRenderBody(); toast('画像を設定しました');
    } catch (err) { toast(err.message || '画像を読み込めませんでした'); }
  }
});
function ueArm(b, label, fn) {
  if (b.dataset.armed) { delete b.dataset.armed; b.textContent = label; fn(); return; }
  b.dataset.armed = '1'; b.textContent = 'もう一度押すと実行します';
  setTimeout(() => { if (b.isConnected && b.dataset.armed) { delete b.dataset.armed; b.textContent = label; } }, 3000);
}
document.addEventListener('click', e => {
  const t = e.target; if (!ueInPanel(t)) return;
  const b = t.closest('button'); if (!b) return;
  if (b.id === 'ue-exit') return ueStop();
  if (b.dataset.ueTab) {
    UE.tab = b.dataset.ueTab; ueHover(null); uePlaceBox();
    if (UE.tab === 'roles') ueLoadUsers(); else if (UE.tab === 'drafts') ueLoadDrafts(); else ueRenderBody();
    return;
  }
  if (b.id === 'ue-pause') { UE.pause = !UE.pause; ueHover(null); ueRenderBody(); uePlaceBox(); return; }
  if (b.id === 'ue-parent') return ueSelect(UE.el.parentElement);
  if (b.id === 'ue-child') return ueSelect(UE.el.firstElementChild);
  if (b.id === 'ue-publish') return uePublish();
  if (b.id === 'ue-draft-save') return ueSaveDraft();
  if (b.id === 'ue-discard') return ueArm(b, '公開中の状態に戻す', () => { UE.data = ueClone(UE.pub); ueSave(); ueRenderBody(); toast('公開中の状態に戻しました（文言や画像は画面を開き直すと戻ります）'); });
  if (b.dataset.ueDload != null) {
    const d = UE.drafts[+b.dataset.ueDload]; if (!d) return;
    const go = () => { UE.data = ueClone(d.data && d.data.items ? d.data : UE_EMPTY()); ueSave(); UE.tab = 'look'; ueRenderBody(); toast(`${d.name}さんの仮保存を読み込みました。よければ「みんなに公開」を押してください。`); };
    return ueSame(UE.data, UE.pub) ? go() : ueArm(b, '読み込んで見る', go);
  }
  if (b.dataset.ueDdel != null) {
    const d = UE.drafts[+b.dataset.ueDdel]; if (!d) return;
    return ueArm(b, '削除', async () => {
      const { error } = await sb.from('ui_drafts').delete().eq('user_id', d.user_id);
      if (error) toast(jaErr(error)); else { toast('仮保存を削除しました'); ueLoadDrafts(); }
    });
  }
  if (b.id === 'ue-reset') {
    const o = UE.data.items[UE.sel];
    if (o && ueNeedsDom(o)) toast('文言や画像は、画面を開き直すと元に戻ります');
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
    if (!el) { toast('その部品はいまの画面にありません（別の画面やウィンドウの中かもしれません）'); return; }
    UE.pause = false; UE.tab = 'look'; ueSelect(el); el.scrollIntoView({ block: 'nearest' }); return;
  }
  if (b.id === 'ue-reset-all') {
    if (!Object.keys(UE.data.items).length) return;
    return ueArm(b, 'すべて元に戻す', () => { UE.data.items = {}; ueSave(); ueRenderBody(); toast('すべて元に戻しました（文言や画像は画面を開き直すと戻ります）'); });
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

/* ================= 起動 ================= */
load();
applyTheme();
renderAll();
renderSelect();
ueApply();
initCloud();
if (!$('intro')) document.documentElement.style.overflow = 'hidden';
})();
