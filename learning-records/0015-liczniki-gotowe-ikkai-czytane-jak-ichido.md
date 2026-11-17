# Liczniki (～つ, ～人, ～本, ～枚, ～匹, ～回) opanowane w pierwszej produkcji; 一回 przeczytane jak 一度; słuchanie bez błędu

Lekcja 0013 (udostępniona 15.11.2026, wynik oddany 17.11): 30/32 za pierwszym razem, jedno pytanie pominięte (e5, wadliwe nagranie). Prawdziwy błąd jest jeden: czytanie 一回. Drugi to kanji wpisane w miejsce hiragany. Powtórka i wszystkie sprawne nagrania bez błędu.

**Evidence**:
- ～つ (A2–A5) bez błędu: やっつ, ひとつ, brak partykuły po liczbie, いくつ vs いくら.
- a1: りんごを ＿＿ ください (3 sztuki) → wpisane 三つ. Sprawdzarka czekała na hiraganę i policzyła to jako błąd. Moja interpretacja (niepotwierdzona przez ucznia): wpisał みっつ, a klawiatura zamieniła to na kanji. To nie jest luka w wiedzy; efektywnie 31/32. Sprawdzarka przyjmuje teraz 一つ…九つ.
- ～人 (B1–B5) bez błędu: ひとり, ふたり, よにん, さんにん na pytanie 何名様, なんにん.
- ～本／～枚／～匹 (C1–C6) bez błędu: dobór licznika do kształtu, いっぽん, さんぼん, にひき, なんぼん, ★ = 二枚. Zmiany h → p／b wyszły od razu.
- d1: 日本へ ＿＿ 行きました (一回: wpisz czytanie) → wpisane いちど. Znaczenie dobre („raz”), czytanie znaku złe: 回 czyta się かい, a いちど to 一度. Moja interpretacja: もう一度 i 一度も (lekcja 0011) siedzą mocniej niż świeże いっかい, a akapit o 一度 stał tuż przed ćwiczeniem. W d5 ろっかい i w d4 なんかい były już dobre, więc sam licznik かい jest znany; chwieje się tylko jedynka.
- Reszta ～回 (D2–D5) bez błędu: 一週間に, もう一度 vs もう一つ.
- Powtórka 6/6. r1 読むことができます: drugie poprawne z rzędu po 0012, czyli warunek z LR 0014 spełniony. r4 data ze słuchu z dystraktorem „6 listopada” obok „6 grudnia”: dobrze. r6 potoczne „ラーメンの ほうが すき。でも、カレーが いちばん” → curry: dobrze. Oba cele słuchowe z LR 0014 trafione przy pierwszej próbie.
- Słuchanie e1–e4, e6 bez błędu (z powtórką 9/9 na sprawnych nagraniach): みっつ nie pomylone z むっつ, よにん, poprawka kasjera (さんまい → にまい + いちまい), にかい vs いちども, いちにちに さんかい + あとで. To pierwsza lekcja bez błędu ze słuchu.
- e5 (猫 二匹, 犬 一匹): uczeń pominął pytanie, bo nagrania nie dało się zrozumieć. Miał rację. W zapisie kaną syntezator wyciszał にひきと prawie do zera i gubił morę w いっぴき　います. `anki/.segment` i długość całego zdania (3,10 s kaną, 3,11 s w kanji) wyglądały dobrze; wadę pokazała dopiero obwiednia głośności. Poprawione na 猫が　二匹と　犬が　一匹　います. Tego pytania nie liczę ani jako dowodu, ani jako błędu.

**Implications**:
- Liczniki są gotowe do użycia w kolejnych lekcjach. W powtórce 0014: jedno wpisywanie 一回 (retest d1) i jedno ～匹, reszta w Anki.
- 一回 = いっかい, 一度 = いちど: dwie karty Anki z tagiem `blad` (wpisywanie いっかい i nagranie なんかい／いっかい) oraz podpowiedź w sprawdzarce, gdy przy ～回 padnie ～ど.
- ～ことができます schodzi z powtórek w lekcjach, zostaje w Anki.
- Słuchanie: daty i „odpowiedź, でも, właściwa odpowiedź” wyszły raz. Zgodnie z ustaleniem po jednym nagraniu każdego typu zostaje w powtórce do testu próbnego #1, ale bez dokładania nowych.
- Uczeń poprawnie rozpoznał wadliwe nagranie i nie zgadywał (w 0012 odsłuchał takie 15 razy). Gdy zgłasza „źle wygenerowane”, sprawdzać od razu obwiednią: `anki/.venv/bin/python anki/envelope.py "kana" "kanji"`.
- Liczniki z h (匹, 本) przed います／あります w nagraniach pisać w kanji. Nowe nagrania sprawdzać trzema sposobami: `.segment`, długość, obwiednia. Rozpoznawania mowy w tej sesji nie było (instalacja mlx-whisper została zablokowana), więc nagrania 0013 i 0014 nie mają tej kontroli.
- Gdy sprawdzarka odrzuca odpowiedź w kanji przy poleceniu „wpisz hiraganą”, mówić uczniowi wprost, że to nie błąd wiedzy, i nie budować na tym kart `blad`.
