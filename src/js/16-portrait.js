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
