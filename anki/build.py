"""Buduje talie Anki (.apkg) z plików anki/src/NNNN-*.tsv.

Uruchomienie (z katalogu projektu):
    anki/.venv/bin/python anki/build.py            # wszystkie lekcje
    anki/.venv/bin/python anki/build.py 0002       # tylko pliki zaczynające się od 0002

Dwie talie: gramatyka (pliki NNNN-slug.tsv → „JLPT N5::Gramatyka”) i słownictwo (sNNNN-slug.tsv → „JLPT N5::Słownictwo”).

Format TSV gramatyki (tabulatory, pierwsza linia z '#' to nagłówek):
    typ  id  tekst  wyjaśnienie  tagi  [tekst_do_audio]
    typ = cloze  → tekst z luką {{c1::odpowiedź::podpowiedź}}; audio całego zdania na odwrocie
                   Podpowiedź mówi, CO zrobić, bo karty z różnych lekcji się mieszają: „帰る → nie (forma ない)”,
                   „待つ → forma て”, „高い → nie był”. Sam czasownik (帰る) nie wystarczy: nie wiadomo, jaka forma.
    typ = listen → tekst = zdanie japońskie (audio na awersie), wyjaśnienie = znaczenie po polsku
Kolumna tekst_do_audio (opcjonalna) nadpisuje to, co czyta syntezator (np. czytanie w hiraganie).

Format TSV słownictwa (jedna linia = jedno słowo = dwie karty: ze słuchu i PL → JA z wpisywaniem kany):
    typ  id  słowo  czytanie  znaczenie  przykład  przykład_pl  tagi  przykład_do_audio  [uwaga]  [słowo_do_audio]
    typ = word; słowo w kanji (albo kaną, jeśli tak się je pisze), czytanie zawsze kaną (jest też tekstem
    do audio słowa, chyba że podasz słowo_do_audio). Przykład używa tylko znanej gramatyki. Uwaga (opcjonalna) to np. para 開く／開ける.
    Karty testują tylko kanę (słuch, wpisywanie); kanji jest na odwrocie mniejszą czcionką, pod kaną,
    bo egzamin pisze kanji tylko z listy N5, a resztę słów kaną. Zapis kanji zostaje dla podróży (napisy).
    Każde słowo tylko raz w całej talii: build przerywa się, jeśli słowo (albo czytanie słowa pisanego kaną)
    jest już w innym pliku sNNNN. Przed dopisaniem listy sprawdź: grep -h "^word" anki/src/s*.tsv | cut -f3,4
Partykuły は／へ po kanie lub kanji, przed spacją lub interpunkcją, idą do syntezatora jako わ／え (jak Speech.spoken
w lesson.js), więc po partykule zawsze stawiaj spację: きのうは　さむかった.
Zawsze wypełniaj tekst_do_audio kaną: syntezator myli czytania kanji (前 → „zen”, 九時 → きゅうじ).
Pułapki zapisu kaną (sama hiragana nie ma granic słów, syntezator zgaduje podział):
- niektóre słowa zaczynające się od は／へ syntezator tnie na partykułę + resztę (はつか → „wa tsuka”,
  へや → „e ya”, はたち, はく). W zdaniu zapisz je w kanji (部屋, 二十歳, どうぞ、入って), daty katakaną (ハツカ).
  Samo słowo (karta słówka): kolumna słowo_do_audio z katakaną (ヘヤ), bo czytanie jest też na karcie.
- kana może się rozpaść na inne słowa (とおか → と＋おか, きょうと → きょう＋と). Wtedy kanji z jednym
  czytaniem (京都) albo katakana dla dat (トオカ, ニジュウヨッカ). Daty w kanji są niejednoznaczne (一日, 十日).
- małe ゃゅょ odcięte od poprzedniej kany (と | し | ょ | かん, じゅ | ぎ | ょ | う) syntezator czyta jak duże
  („toshiyokan”, „jugiyou”). Wtedy kanji: 図書館, 授業, 練習 (w zdaniu i w słowo_do_audio).
- spacja nie jest dla syntezatora granicą słowa: kana po obu stronach może się skleić (わ　に → わに, え　い → えい).
  W .segment widać to jako znak zgubiony po spacji („わ　 | か | い　 | き” zamiast に, い). Głoski są dobre,
  ale podział i intonacja złe. Wtedy kanji po spacji: 北海道は　二回　行きました, 図書館へ　行きます.
- słowa po spacji mogą się też skleić w inne słowo albo nazwę własną: に　もつ → に + 持つ, 毎日　新聞 → 毎日新聞 (gazeta).
  Wtedy kanji (荷物) albo przecinek (毎日、新聞を).
- 行って／行った Kyoko czyta „okonatte／okonatta” (行う). Formy て／た od 行く pisz kaną i bez spacji po partykule:
  京都へいって, 沖縄へいった (bez spacji へ nie jest zamieniane na え, Kyoko sama czyta je jako partykułę).
  行きます／行きました／行きませんか są bezpieczne.
- きょうは przed słowem kaną: po zamianie は → わ Kyoko czyta „きょうわ” jak jedno słowo i zlewa je z następnym
  bez pauzy (きょうわきのうより; głoski dobre, więc rozpoznawanie mowy tego nie widzi, nagranie krótsze o ok. 0,2 s).
  Pisz 今日は: po kanji granica słowa jest pewna i po partykule jest pauza (今日は　きのうより　あたたかいですね).
  To samo w data-say w lekcjach. Tak samo zlewa się くうこうは　えきより (pisz 空港は　駅より); きのうは　今日より jest dobre.
  Wykrywanie: długość nagrania z は i z わ w tym samym miejscu różni się o więcej niż ok. 0,08 s.
- liczniki kaną w środku zdania i przed います: にひきと Kyoko wycisza prawie do zera, a w いっぴき　います gubi morę
  (うちに　ねこが　にひきと　いぬが　いっぴき　います nie dało się zrozumieć). .segment wygląda dobrze i długość całego
  zdania jest taka sama jak w kanji, więc widać to dopiero na obwiedni głośności: anki/.venv/bin/python anki/envelope.py "kana" "kanji".
  Pisz kanji: 猫が　二匹と　犬が　一匹　います. To samo w data-say w lekcjach.
Podział słów syntezatora pokazuje anki/segment.swift (instrukcja w pliku); „は | つか” albo „と | おか” = błąd.
Sam .segment nie wystarcza (えいがかんへ wyglądało dobrze, a brzmiało źle): nagrania z nowej talii warto przepuścić
przez rozpoznawanie mowy (model whisper large-v3-turbo, language="ja"; mlx-whisper liczy ok. 1,5 s na plik,
faster-whisper na procesorze ok. 13 s) i porównać z tekstem zdania.
Rozpoznawanie mowy nie odróżni czytań tego samego kanji (行って = いって i おこなって, 日本, 七月): wtedy porównaj
długość nagrania z wersją kaną (to samo czytanie = różnica poniżej ok. 0,1 s; 行って było dłuższe o 0,3 s).
Pojedynczych słów rozpoznawanie mowy często nie rozpoznaje (すむ → 詰む, なか → だか) niezależnie od zapisu: to nie błąd tekstu.
Nagranie dostaje ciszę na początku i końcu, bo odtwarzacze (zwłaszcza AnkiDroid) ucinają końcówkę pliku.

ID modeli, talii i notatek są stałe, więc ponowny import aktualizuje karty, zamiast je dublować.
Audio: macOS `say` → mp3 przez ffmpeg. Głos: najlepsza zainstalowana Kyoko (Premium > Enhanced > zwykła).
Po instalacji lepszego głosu przebuduj wszystko i zaimportuj ponownie (nazwy plików zależą od głosu).
"""
import csv
import hashlib
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import genanki

ROOT = Path(__file__).resolve().parent
SRC, OUT, MEDIA = ROOT / "src", ROOT / "out", ROOT / "media"
DECK_ID, DECK_NAME = 1_726_000_001, "JLPT N5::Gramatyka"
VOCAB_DECK_ID, VOCAB_DECK_NAME = 1_726_000_002, "JLPT N5::Słownictwo"
RATE = "165"


def best_voice() -> str:
    names = subprocess.run(["say", "-v", "?"], capture_output=True, text=True).stdout
    for v in ("Kyoko (Premium)", "Kyoko (Enhanced)"):
        if re.search(rf"^{re.escape(v)}\s", names, re.M):
            return v
    return "Kyoko"


VOICE = best_voice()

CSS = """
.card { font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif; font-size: 26px;
        text-align: center; color: #1f1f1c; background: #fffff8; line-height: 1.6; padding: 12px; }
.nightMode.card, .night_mode .card { color: #e9e6da; background: #1b1a17; }
.cloze { font-weight: bold; color: #a3321d; }
.nightMode .cloze, .night_mode .cloze { color: #e0785f; }
.extra, .meaning { font-family: -apple-system, sans-serif; font-size: 17px; margin-top: 14px; color: #6b6a63; }
.meaning { font-size: 20px; color: inherit; }
.prompt { font-family: -apple-system, sans-serif; font-size: 16px; color: #6b6a63; margin-bottom: 10px; }
.lesson { font-family: -apple-system, sans-serif; font-size: 12px; color: #a3a092; margin-top: 18px; }
.reading { font-size: 40px; } .word { font-size: 22px; color: #6b6a63; }
.example { margin-top: 16px; font-size: 22px; } .example-pl { font-family: -apple-system, sans-serif; font-size: 16px; color: #6b6a63; }
.note { font-family: -apple-system, sans-serif; font-size: 15px; color: #a3321d; margin-top: 10px; }
.nightMode .note, .night_mode .note { color: #e0785f; }
"""

CLOZE = genanki.Model(
    1_726_000_101, "N5 Luka",
    model_type=genanki.Model.CLOZE,
    fields=[{"name": "Text"}, {"name": "Extra"}, {"name": "Audio"}, {"name": "Lesson"}],
    templates=[{
        "name": "Luka",
        "qfmt": "{{cloze:Text}}",
        "afmt": '{{cloze:Text}}<div>{{Audio}}</div><div class="extra">{{Extra}}</div>'
                '<div class="lesson">lekcja {{Lesson}}</div>',
    }],
    css=CSS,
)

LISTEN = genanki.Model(
    1_726_000_102, "N5 Słuchanie",
    fields=[{"name": "Transcript"}, {"name": "Meaning"}, {"name": "Audio"}, {"name": "Lesson"}],
    templates=[{
        "name": "Słuchanie",
        "qfmt": '<div class="prompt">🎧 Posłuchaj. Co to znaczy?</div>{{Audio}}',
        "afmt": '<div class="prompt">🎧 Posłuchaj. Co to znaczy?</div>{{Audio}}<hr id="answer">'
                '<div>{{Transcript}}</div><div class="meaning">{{Meaning}}</div>'
                '<div class="lesson">lekcja {{Lesson}}</div>',
    }],
    css=CSS,
)

VOCAB = genanki.Model(
    1_726_000_103, "N5 Słowo",
    fields=[{"name": "Word"}, {"name": "Reading"}, {"name": "Meaning"}, {"name": "Example"}, {"name": "ExamplePl"},
            {"name": "WordAudio"}, {"name": "ExampleAudio"}, {"name": "Note"}, {"name": "Lesson"}],
    templates=[{
        "name": "Słuchanie",
        "qfmt": '<div class="prompt">🎧 Posłuchaj. Co to za słowo?</div>{{WordAudio}}',
        "afmt": '<div class="prompt">🎧 Posłuchaj. Co to za słowo?</div>{{WordAudio}}<hr id="answer">'
                '<div class="reading">{{Reading}}</div>{{#Word}}<div class="word">{{Word}}</div>{{/Word}}<div class="meaning">{{Meaning}}</div>'
                '<div class="example">{{Example}} {{ExampleAudio}}</div><div class="example-pl">{{ExamplePl}}</div>'
                '<div class="note">{{Note}}</div><div class="lesson">słownictwo {{Lesson}}</div>',
    }, {
        "name": "PL → JA",
        "qfmt": '<div class="prompt">Po japońsku (kaną):</div><div class="meaning">{{Meaning}}</div>{{type:Reading}}',
        "afmt": '<div class="prompt">Po japońsku (kaną):</div><div class="meaning">{{Meaning}}</div>{{type:Reading}}<hr id="answer">'
                '<div class="reading">{{Reading}}</div>{{#Word}}<div class="word">{{Word}}</div>{{/Word}}{{WordAudio}}'
                '<div class="example">{{Example}} {{ExampleAudio}}</div><div class="example-pl">{{ExamplePl}}</div>'
                '<div class="note">{{Note}}</div><div class="lesson">słownictwo {{Lesson}}</div>',
    }],
    css=CSS,
)


def plain_text(cloze_text: str) -> str:
    """Zdanie z uzupełnioną luką, do syntezatora."""
    return re.sub(r"\{\{c\d+::(.*?)(::.*?)?\}\}", r"\1", cloze_text)


def spoken(text: str) -> str:
    """Kana czytana dosłownie: partykuły は／へ → わ／え."""
    kana, end = r"(?<=[ぁ-ゖァ-ヺー一-龯々])", r"(?=[\s　、。,.…！？!?]|$)"
    return re.sub(kana + "へ" + end, "え", re.sub(kana + "は" + end, "わ", text))


def audio_for(text: str) -> Path:
    text = spoken(text)
    MEDIA.mkdir(exist_ok=True)
    name = "n5_" + hashlib.sha1(f"{VOICE}{RATE}pad2{text}".encode()).hexdigest()[:12] + ".mp3"
    path = MEDIA / name
    if not path.exists():
        with tempfile.TemporaryDirectory() as tmp:
            aiff = Path(tmp) / "a.aiff"
            subprocess.run(["say", "-v", VOICE, "-r", RATE, "-o", str(aiff), text], check=True)
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(aiff),
                            "-af", "adelay=200,apad=pad_dur=0.7", "-q:a", "4", str(path)], check=True)
    return path


def build(src: Path) -> Path:
    vocab = src.stem.startswith("s")
    lesson = src.stem.split("-")[0].lstrip("s")
    deck = genanki.Deck(VOCAB_DECK_ID, VOCAB_DECK_NAME) if vocab else genanki.Deck(DECK_ID, DECK_NAME)
    media = []
    with src.open(encoding="utf-8") as f:
        for row in csv.reader(f, delimiter="\t"):
            if not row or row[0].startswith("#"):
                continue
            if row[0] == "word":
                _, nid, word, reading, meaning, example, example_pl, tags, example_audio = row[:9]
                note_txt = row[9] if len(row) > 9 else ""
                word_audio = row[10] if len(row) > 10 and row[10] else reading
                w_mp3, e_mp3 = audio_for(word_audio), audio_for(example_audio)
                media += [str(w_mp3), str(e_mp3)]
                deck.add_note(genanki.Note(
                    model=VOCAB,
                    fields=[word, reading, meaning, example, example_pl, f"[sound:{w_mp3.name}]", f"[sound:{e_mp3.name}]", note_txt, lesson],
                    tags=[f"slownictwo::{lesson}"] + tags.split(), guid=genanki.guid_for("jlpt-n5", nid)))
                continue
            kind, nid, text, extra, tags = row[:5]
            spoken = row[5] if len(row) > 5 and row[5] else (plain_text(text) if kind == "cloze" else text)
            mp3 = audio_for(spoken)
            media.append(str(mp3))
            sound = f"[sound:{mp3.name}]"
            tag_list = [f"lekcja::{lesson}"] + tags.split()
            guid = genanki.guid_for("jlpt-n5", nid)
            if kind == "cloze":
                note = genanki.Note(model=CLOZE, fields=[text, extra, sound, lesson], tags=tag_list, guid=guid)
            elif kind == "listen":
                note = genanki.Note(model=LISTEN, fields=[text, extra, sound, lesson], tags=tag_list, guid=guid)
            else:
                raise ValueError(f"{src.name}: nieznany typ '{kind}' w {nid}")
            deck.add_note(note)
    OUT.mkdir(exist_ok=True)
    out = OUT / f"{src.stem}.apkg"
    pkg = genanki.Package(deck)
    pkg.media_files = media
    pkg.write_to_file(str(out))
    print(f"{out.relative_to(ROOT.parent)}: {deck.name}, {len(deck.notes)} notatek, {len(media)} plików audio")
    return out


def check_vocab_duplicates() -> None:
    """Przerywa build, jeśli to samo słowo jest w dwóch wierszach talii słownictwa (w dowolnych plikach sNNNN)."""
    seen, dups = {}, []
    for src in sorted(SRC.glob("s*.tsv")):
        with src.open(encoding="utf-8") as f:
            for row in csv.reader(f, delimiter="\t"):
                if not row or row[0] != "word":
                    continue
                key = row[2] or row[3]  # słowo pisane kaną ma puste pole słowo
                if key in seen:
                    dups.append(f"  {key}: {seen[key]} i {row[1]}")
                else:
                    seen[key] = row[1]
    if dups:
        sys.exit("Duplikaty w słownictwie (usuń nowszy wiersz):\n" + "\n".join(dups))


if __name__ == "__main__":
    prefix = sys.argv[1] if len(sys.argv) > 1 else ""
    check_vocab_duplicates()
    for src in sorted(SRC.glob(f"{prefix}*.tsv")):
        build(src)
