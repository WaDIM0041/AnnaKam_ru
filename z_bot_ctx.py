import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
targets = ["bot/widget.js", "bot/demo-knowledge.json", "_source/bot-knowledge/site-knowledge.md"]
pat = re.compile(r".{0,90}(?:Аннакам|Анна Кам|AnnaKam|anna\s*кам).{0,90}", re.I)
for rel in targets:
    p = ROOT / rel
    if not p.exists():
        print("нет файла:", rel); continue
    text = p.read_text(encoding="utf-8", errors="replace")
    print("==", rel, len(text), "симв.")
    for m in pat.finditer(text):
        print("   ", m.group(0).replace("\n", " ").strip()[:190])
