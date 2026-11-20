import pathlib
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
old = "?v=sphere-responsive-20261117"
total = 0
for path in sorted(ROOT.rglob("*")):
    if not path.is_file() or ".git" in path.parts: continue
    if path.suffix.lower() not in {".html", ".mjs", ".js", ".json", ".txt"}: continue
    t = path.read_text(encoding="utf-8", errors="replace")
    n = t.count(old)
    if n:
        total += n
        print(f"{path.relative_to(ROOT)}: {n}")
print("итого:", total)
