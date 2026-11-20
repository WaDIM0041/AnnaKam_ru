import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
files = ["bot-api/knowledge.php", "bot-api/bridge.php", "bot/demo-engine.mjs", "bot/demo-knowledge.json", "bot/widget.js"]
pat = re.compile(r"(.{0,80}(?:Здравствуйте|Я\s+помощник|помощник|Помощник|бот|Анна|Anna|ANNA).{0,80})")
for rel in files:
    p = ROOT / rel
    if not p.exists():
        print("нет:", rel); continue
    t = p.read_text(encoding="utf-8", errors="replace")
    hits = [m.group(0).replace("\n", " ").strip() for m in pat.finditer(t)]
    print("==", rel, "|", len(hits))
    for h in hits[:10]:
        print("   ", h[:170])
