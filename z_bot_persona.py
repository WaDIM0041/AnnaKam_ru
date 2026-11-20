import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
pat = re.compile(r"(.{0,70}(?:зовут|Ты\s*[-—]|ты\s*[-—]|имя|персон|Аннакам|AnnaKam|ассистент|assistant).{0,70})", re.I)
files = ["bot-api/bridge.php", "bot-api/knowledge.php", "bot/widget.js", "_source/bot-knowledge/site-knowledge.md", "bot/privacy.html"]
for rel in files:
    p = ROOT / rel
    if not p.exists():
        print("нет:", rel); continue
    t = p.read_text(encoding="utf-8", errors="replace")
    hits = [m.group(0).replace("\n", " ").strip() for m in pat.finditer(t)]
    print("==", rel, "| совпадений:", len(hits))
    for h in hits[:12]:
        print("   ", h[:170])
