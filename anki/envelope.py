"""Obwiednia głośności nagrania syntezatora: pokazuje sylaby połknięte albo wyciszone.

Uruchomienie (z katalogu projektu):
    anki/.venv/bin/python anki/envelope.py "うちに　ねこが　にひきと　いぬが　いっぴき　います。" "うちに　猫が　二匹と　犬が　一匹　います。"

Każdy argument to jeden zapis tego samego zdania (zwykle kana i kanji). Skrypt nagrywa go tym samym głosem
i tempem co build.py, a potem drukuje długość i pasek głośności (jeden znak = 20 ms, wyżej = głośniej).
Czytaj tak: oba paski powinny mieć tyle samo „górek” w tych samych miejscach. Dłuższa dolina w środku zdania
albo krótsza końcówka w jednym z zapisów = syntezator wyciszył lub zgubił mory (tak było z にひきと i いっぴき　います).
Długość całego zdania może przy tym wyjść taka sama, więc samo porównanie długości tego nie wykryje.
Tekst podawaj tak, jak idzie do syntezatora (は／へ jako partykuły wpisz jako わ／え).
"""
import math
import struct
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from build import RATE, VOICE

BARS = " ▁▂▃▄▅▆▇█"
STEP = 320  # 20 ms przy 16 kHz


def envelope(text: str) -> tuple[list[float], float]:
    with tempfile.TemporaryDirectory() as d:
        aiff, wav = Path(d) / "a.aiff", Path(d) / "a.wav"
        subprocess.run(["say", "-v", VOICE, "-r", RATE, "-o", str(aiff), text], check=True)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(aiff), "-ac", "1", "-ar", "16000", str(wav)], check=True)
        with wave.open(str(wav)) as f:
            n = f.getnframes()
            samples = struct.unpack(f"<{n}h", f.readframes(n))
    rms = [math.sqrt(sum(x * x for x in samples[i:i + STEP]) / STEP) for i in range(0, n - STEP, STEP)]
    return rms, n / 16000


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for text in sys.argv[1:]:
        rms, seconds = envelope(text)
        top = max(rms) or 1
        print(f"{seconds:.2f} s  {text}")
        print("".join(BARS[min(8, int(8 * x / top + 0.5))] for x in rms))
