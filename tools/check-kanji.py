#!/usr/bin/env python3
"""Szuka w lekcji słów ze znakami, których uczeń nie zna, podanych bez czytania.

    python3 tools/check-kanji.py lessons/0014-tai-hoshii-ni-iku.html

Znane znaki: tools/known-kanji.txt. Sprawdzany jest tylko tekst widoczny (bez atrybutów, więc bez
data-say / data-dialog / data-verb). Blok = fragment pliku między pustymi liniami (pytanie, tabelka,
akapit). Znak jest w porządku, jeśli gdziekolwiek w bloku stoi przy nim czytanie w nawiasie:
歯（は）, 遊び（あそび）, 帰ります（かえります）. Brak wyniku = nic do poprawienia.
Wyjątek, którego skrypt nie zna: znak, którego czytanie jest odpowiedzią na pytanie (三匹: wpisz czytanie).
"""
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
KANJI = r"一-鿿々"
KNOWN = {
    ch
    for line in (HERE / "known-kanji.txt").read_text(encoding="utf-8").splitlines()
    if not line.startswith("#")
    for ch in line.strip()
}


def blocks(text):
    """(numer pierwszej linii, treść) dla fragmentów rozdzielonych pustą linią."""
    start, buf = 1, []
    for n, line in enumerate(text.splitlines(), 1):
        if line.strip():
            if not buf:
                start = n
            buf.append(line)
        elif buf:
            yield start, "\n".join(buf)
            buf = []
    if buf:
        yield start, "\n".join(buf)


def check(path):
    found = 0
    text = pathlib.Path(path).read_text(encoding="utf-8")
    cut = max(text.find("<body"), 0)
    body, offset = text[cut:], text.count("\n", 0, cut)
    for start, block in blocks(body):
        visible = re.sub(r"<[^>]+>", "", block)
        seen = set()
        for m in re.finditer(f"[{KANJI}]+", visible):
            word = m.group()
            for ch in word:
                if ch in KNOWN or ch in seen:
                    continue
                seen.add(ch)
                if re.search(re.escape(ch) + f"[{KANJI}ぁ-んァ-ヶー]{{0,8}}（", visible):
                    continue
                found += 1
                ctx = visible[max(0, m.start() - 12):m.end() + 12].replace("\n", " ").strip()
                print(f"{path}:{start + offset}: {word} (znak {ch}) … {ctx}")
    return found


if __name__ == "__main__":
    total = sum(check(p) for p in sys.argv[1:])
    print(f"{total} słów bez czytania" if total else "OK: każde słowo z nieznanym znakiem ma czytanie")
    sys.exit(1 if total else 0)
