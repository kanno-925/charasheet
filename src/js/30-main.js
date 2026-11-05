/* ================= 起動 ================= */
/* 保存データの読み込み（IndexedDB）は少し時間がかかるので、終わってから画面を作る */
load().catch(() => {}).finally(() => {
  applyTheme();
  renderAll();
  renderSelect();
  ueApply();
  initCloud();
});
if (!$('intro')) document.documentElement.style.overflow = 'hidden';
