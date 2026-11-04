# キャラシ工房 — Claude向けメモ

クトゥルフ神話TRPG（6版・7版）のキャラシを作り、ココフォリアのコマに貼り付けられるWebアプリ。
公開URL：https://kanno-925.github.io/charasheet/ （GitHub Pages、main に push すると反映）

## 作業のルール
- オーナーは開発者ではないので、説明・コミットメッセージ・コード内コメントは**やさしい日本語**で書く。
- 編集するのは `src/` だけ。直下の `index.html` / `css/app.css` / `js/app.js` と `dist/` は `python3 build.py` が作る生成物なので**直接編集しない**。
- 変更したら必ず `python3 build.py` を実行し、生成物もいっしょに commit する（しないと公開版に反映されない）。
- 外部ライブラリやビルドツール（npm 等）は増やさない。素のHTML/CSS/JS + build.py の構成を保つ。
- 1ファイル版（`dist/キャラシ工房.html`）はダブルクリックで動く必要がある。画像・音は `assets/` に置き、CSSでは `../assets/名前`、JSでは `'assets/名前'` と書く（build.py がこの形だけを埋め込む）。
- 作業の最後に、決まったこと・新機能を `docs/history.md` に1〜2行で追記する。

## 仕組み
- JS は `src/files.txt` の順に連結され、全体が1つの即時関数で包まれる。ファイルをまたいで同じ変数・関数を使えるので**順番が大事**。新しいファイルは番号を付けて files.txt にも追加する。
- データは `state`（03-state.js）に集まり、localStorage のキー `charasheet-kobo.v2` に保存（v1 からの移行処理あり）。キャラ1人分の形は `blank()` を参照。
- ルール（6版 `coc6`／7版 `coc7`）の能力値・技能・DB計算は `01-rules.js` の `SYS`。
- 主な機能とファイル：取り込み（いあきゃら・ココフォリア・テキスト）04 / ココフォリア出力 06 / 魔導書テーマ 09・11-book.css / テーマ 15 / BGM 19 / フレンド 20 / クラウド同期 21 / ダイス 22 / グループ 25 / 探索者選択 26 / オープニング 27。
- サーバーは Supabase（接続先は 21-cloud.js。公開してよい publishable key）。見える範囲は RLS でサーバー側に強制している。
- DB を変えるときは `supabase/` に**番号付きの新しいSQLファイルを追加**し、何度実行しても大丈夫な書き方（`if not exists`、`create or replace`、policy は drop してから create）にする。オーナーが SQL Editor で手動実行するので、実行が必要なことを必ず伝える。

## 詳しい経緯
@docs/history.md
