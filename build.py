"""キャラシ工房のビルド。

src/ にあるソース（index.html・css/・js/）を組み立てて、次の3つを作ります。

  index.html, css/app.css, js/app.js   GitHub Pages で公開するもの（このフォルダの直下）
  dist/キャラシ工房.html                ダブルクリックで開ける1ファイル版
  dist/claude-artifact.html             Claude の公開版（Artifact）用（git には入れない）

使い方：  python3 build.py

結合の順番は src/files.txt に書いてあります。JS は全体を1つの即時関数で包むので、
ファイルをまたいで同じ変数・関数を使えます（順番は大事です）。
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / 'src'

order = [l.strip() for l in (SRC / 'files.txt').read_text(encoding='utf-8').splitlines() if l.strip() and not l.startswith('#')]
css = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in order if f.startswith('css/'))
js = "(() => {\n'use strict';\n\n" + '\n'.join((SRC / f).read_text(encoding='utf-8') for f in order if f.startswith('js/')) + '})();\n'
shell = (SRC / 'index.html').read_text(encoding='utf-8')
head, rest = shell.split('<!-- build:css -->', 1)
markup, _ = rest.split('<!-- build:js -->', 1)
head, markup = head.strip(), markup.strip()

META = '''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="クトゥルフ神話TRPGのキャラクターシートを作って、ココフォリアのコマにそのまま貼り付けられるツール">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2217%22 fill=%22none%22 stroke=%22%231f6fe0%22 stroke-width=%223%22/%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%229%22 fill=%22%2312a6cf%22/%3E%3Ccircle cx=%2234%22 cy=%2211%22 r=%224%22 fill=%22%23ff8a1f%22/%3E%3C/svg%3E">'''
RESET = '''<style>
html { color-scheme: light; }
body { margin: 0; }
img { max-width: 100%; }
[hidden] { display: none !important; }
</style>'''


def page(css_part, js_part):
    return f"""<!doctype html>
<html lang="ja">
<head>
{META}
{head}
{RESET}
{css_part}
</head>
<body>
{markup}
{js_part}
</body>
</html>
"""


# GitHub Pages: separate, cacheable files
site = ROOT
(site / 'css').mkdir(parents=True, exist_ok=True)
(site / 'js').mkdir(parents=True, exist_ok=True)
(site / 'css' / 'app.css').write_text(css, encoding='utf-8')
(site / 'js' / 'app.js').write_text(js, encoding='utf-8')
(site / 'index.html').write_text(page('<link rel="stylesheet" href="css/app.css">', '<script src="js/app.js"></script>'), encoding='utf-8')

# single-file versions
dist = ROOT / 'dist'
dist.mkdir(exist_ok=True)
MIME = {'.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg'}


def data_uri(name):
    f = ROOT / 'assets' / name
    return f'data:{MIME[f.suffix]};base64,' + base64.b64encode(f.read_bytes()).decode()


# 1ファイル版は assets/ の画像・音も中に埋め込む
css1 = re.sub(r'\.\./assets/([\w.-]+)', lambda m: data_uri(m.group(1)), css)
js1 = re.sub(r'(?<=[\'"])assets/([\w.-]+)(?=[\'"])', lambda m: data_uri(m.group(1)), js)
inline_css, inline_js = f'<style>\n{css1}</style>', f'<script>\n{js1}</script>'
(dist / 'キャラシ工房.html').write_text(page(inline_css, inline_js), encoding='utf-8')
(dist / 'claude-artifact.html').write_text(f'{head}\n{inline_css}\n\n{markup}\n{inline_js}\n', encoding='utf-8')

print(f'built: index.html ({len(css) // 1024}KB css, {len(js) // 1024}KB js), dist/キャラシ工房.html, dist/claude-artifact.html')
