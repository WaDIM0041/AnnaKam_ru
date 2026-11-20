import pathlib, re
ROOT = pathlib.Path(r"D:\AutoClawTemp\gigatool\annakam-seo")
w = (ROOT / "bot/widget.js").read_text(encoding="utf-8")
for needle in ("Помощник", "annakam-mark", "greeting()", "Попробовать чат-бота"):
    print("=====", needle)
    for m in re.finditer(re.escape(needle), w):
        a, b = max(0, m.start() - 170), min(len(w), m.end() + 170)
        print("  ...", w[a:b].replace("\n", " "), "...\n")
b = (ROOT / "bot-api/bridge.php").read_text(encoding="utf-8")
print("===== bridge.php: system / prompt")
for m in re.finditer(r"(system|prompt|persona|Ты|ты —|роль)", b, re.I):
    a, bb = max(0, m.start() - 120), min(len(b), m.end() + 120)
    print("  ...", b[a:bb].replace("\n", " "), "...")
