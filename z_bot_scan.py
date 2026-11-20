import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
pats = [re.compile(p, re.I) for p in (r"аннакам", r"annakam")]
for path in sorted(ROOT.rglob("*")):
    if not path.is_file() or ".git" in path.parts:
        continue
    if path.suffix.lower() not in {".html", ".js", ".mjs", ".php", ".json", ".md", ".css", ".txt"}:
        continue
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        continue
    hits = sum(len(p.findall(text)) for p in pats)
    if hits:
        print(f"{path.relative_to(ROOT)}: {hits}")
