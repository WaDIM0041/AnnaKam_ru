import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
pat = re.compile(r"<script[^>]*widget\.js[^>]*>", re.I)
seen = {}
for path in sorted(ROOT.rglob("*.html")):
    if ".git" in path.parts: continue
    t = path.read_text(encoding="utf-8", errors="replace")
    for m in pat.finditer(t):
        seen.setdefault(m.group(0), []).append(str(path.relative_to(ROOT)))
for tag, files in seen.items():
    print(len(files), "файлов |", tag[:120])
    print("   например:", files[:3])
