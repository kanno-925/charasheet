# キャラシ工房

クトゥルフ神話TRPG（6版・7版）のキャラクターシートを作って、ココフォリアのコマにそのまま貼り付けられるWebアプリです。

公開URL：https://kanno-925.github.io/charasheet/

## フォルダ構成

```
index.html, css/, js/   GitHub Pages で公開しているもの（build.py が作ります。直接編集しない）
dist/キャラシ工房.html     ダブルクリックで開ける1ファイル版（build.py が作ります）
src/                     ソースコード（ここを編集します）
  index.html             画面の骨組み（HTML）
  css/                   見た目（番号順に結合）
  js/                    動き（番号順に結合し、1つの即時関数で包みます）
  files.txt              結合する順番
supabase/                サーバー（Supabase）の設定SQL。番号順に1回ずつ実行します
build.py                 src/ から公開用ファイルを作るスクリプト
```

## 更新のしかた

1. `src/` のファイルを編集する
2. `python3 build.py` を実行する
3. 変更を commit して push すると、GitHub Pages に反映されます

## サーバーの準備（Supabase）

`supabase/` のSQLを、Supabase の SQL Editor で番号順に実行します（何度実行しても大丈夫です）。

- `01-setup.sql`：アカウント・キャラシ・フレンド
- `02-groups.sql`：グループ
- `03-group-invites.sql`：グループへの招待・参加
