# Kurs japońskiego: JLPT N5

To jest workspace skilla `/teach`. Claude jest nauczycielem, uczeń przygotowuje się do JLPT N5 (6.12.2026, Warszawa). Rozmowa po polsku, przykłady po japońsku.

Przed lekcją przeczytaj: `NOTES.md` (sekcja „Stan kursu” mówi, co jest następne), `MISSION.md`, `learning-records/`, `PLAN.md`. Po każdej lekcji zaktualizuj „Stan kursu”.

- Lekcje: `lessons/NNNN-slug.html`. Budowane z `assets/style.css` + `assets/lesson.js` (quizy, wpisywanie z automatyczną odmianą przymiotników, audio TTS ja-JP, wynik do skopiowania). API jest opisane w nagłówku `lesson.js`. Nowe komponenty dopisuj tam, nie wklejaj ich do lekcji.
- Każda lekcja zaczyna się powtórką z poprzednich lekcji (spacing/interleaving) i zawiera ćwiczenie ze słuchu.
- Po dodaniu lekcji lub ściągi zaktualizuj `index.html`.
- Podgląd: serwer `kurs` w `.claude/launch.json` (http://localhost:8765). Plik otwarty bezpośrednio w panelu przeglądarki nie ładuje `assets/`.
- Anki: po każdej oddanej lekcji dopisz `anki/src/NNNN-slug.tsv` (10–15 kart z luką + kilka ze słuchu; najwięcej kart z błędów ucznia, tag `blad`), zbuduj `anki/.venv/bin/python anki/build.py NNNN` i podaj uczniowi ścieżkę `anki/out/NNNN-slug.apkg`. Format jest opisany w nagłówku `anki/build.py`. Id notatek muszą być stałe, bo ponowny import aktualizuje karty.
- Słownictwo: osobna talia `JLPT N5::Słownictwo` z plików `anki/src/sNNNN-slug.tsv` (typ `word`, 15–20 słów N5 powiązanych z tematem lekcji, dwie karty na słowo: ze słuchu i PL → JA). Po każdej oddanej lekcji dopisz kolejny plik, zbuduj `anki/build.py sNNNN`. Czy słowo jest na liście N5: https://jlpt-vocab-api.vercel.app/api/words?level=5&limit=1000 (662 słowa).
- Wynik z „Kopiuj wynik” wklejony przez ucznia → learning record (tylko gdy jest dowód opanowania lub błędne przekonanie).
- Git: publiczne repo na GitHubie pokazuje, jak uczeń uczy się z AI, więc historia commitów ma opowiadać przebieg kursu. Po każdej zamkniętej jednostce pracy zrób commit przez `/git-commit` (po angielsku) i od razu `git push`. Oddana lekcja → `feat(lesson): finish 0012 comparisons (30/32)`, a w opisie learning record, talie Anki i przygotowana następna lekcja. Poprawka zgłoszona przez ucznia (np. złe audio na fiszce) → osobny `fix(anki): …` albo `fix(lesson): …`. Zmiany w `lesson.js` i `build.py` → zakres `tools`.
