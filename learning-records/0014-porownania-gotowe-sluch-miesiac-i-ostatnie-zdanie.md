# Porównania (より, ほうが, いちばん) opanowane w pierwszej produkcji; こと wróciło; ze słuchu miesiąc i odpowiedź z ostatniego zdania

Lekcja 0012 (udostępniona 10.11.2026, wynik oddany 15.11 po przerwie 11–13.11): 29/32 za pierwszym razem. Cała nowa gramatyka i cała powtórka bez błędu merytorycznego. Dwa błędy są w słuchaniu, trzeci to odpowiedź wpisana razem z partykułą, która już stała w zdaniu.

**Evidence**:
- A は B より (A1–A5) bez błędu: wpisane より, zwycięzca przy odwróconym szyku, przymiotnik w przeszłości po より, ★ = 少し.
- ～の ほうが (B1, B3–B6) bez błędu: wpisane のほうが, が po pytajniku, どちらも, どちら o ludziach, ★ = ほうが.
- b2: 肉と 魚と ＿＿ が 好きですか → wpisane どちらが. Pytajnik dobry, a が stało już w zdaniu za luką. Moja interpretacja: to błąd czytania polecenia, nie wiedzy (uczeń wie, że po どちら idzie が, i dopisał je z rozpędu). Efektywnie 30/32.
- ～で ～が いちばん (C1–C5) i pytania mieszane D1–D3 bez błędu: で zakresu, いつ, どれ przy trzech rzeczach, zdanie o Fuji, wybór いちばん／より／どちら.
- Powtórka 6/6. r1 作ることができます z promptu w formie ます i bez こと w poleceniu: pierwsze poprawne po dwóch potknięciach (0010: ✗ 泳ぎことが, 0011: ✗ 話すができます). r2 作ったことがあります, r3 wybór formy przed まえに／あとで, r4 data ze słuchu (じゅうよっか), r5 poprawka くじじゃなくて しちじ, r6 さんかい vs いちども ありません (błąd e3 z 0011 zamknięty).
- e3 (słuch): 十二月が いちばん 忙しいです → wybrane „w listopadzie”. Wzór いちばん zrozumiany, pomylony miesiąc: じゅうにがつ usłyszane jako じゅういちがつ. To kolejny błąd na liczbie w dacie ze słuchu (LR 0010), mimo że r4 (dzień miesiąca) poszło dobrze.
- e6 (słuch, potocznie): 犬の ほうが すき！でも、鳥が いちばん すき → wybrane „psy”. Moja interpretacja: uczeń zatrzymał się na pierwszej odpowiedzi (ほうが) i nie doczekał zdania po でも. W e4 (lotnisko) ta sama budowa „odpowiedź, でも, zmiana” poszła dobrze, ale tam było grzecznie i powoli; tu forma zwykła bez です i wykrzyknik.
- e5: nagranie było wadliwe. Uczeń odsłuchał je ok. 15 razy i odpowiedział dobrze z domysłu. Przyczyna: きょうは po zamianie は → わ syntezator czytał jak jedno słowo i zlewał z きのうより bez pauzy (nagranie 2,19 s zamiast ok. 2,4 s). Poprawione na 今日は (commit `93c46c9`). Tego pytania nie liczę ani jako dowodu, ani jako błędu.
- Słuchanie 4/6 (bez e5: 3/5). Dobrze: szybciej vs taniej, どちらも + poranna kawa, decyzja na końcu dialogu o lotnisku.

**Implications**:
- Porównania są gotowe do użycia w kolejnych lekcjach. W powtórce wystarczy jedno nagranie, bez osobnego ćwiczenia pisemnego.
- ～ことができます: jedno poprawne na zimno. Zasada „dwa z rzędu” zostaje, więc r1 w 0013 (読むことができます) zostaje bez zmian. Jeśli wyjdzie dobrze, wzór schodzi do Anki.
- Słuchanie jest teraz wyraźnie słabsze niż gramatyka (gramatyka 26/26 merytorycznie, słuch 3/5). Dwa konkretne cele:
  - miesiące ze słuchu, zwłaszcza para じゅういちがつ／じゅうにがつ: w r4 lekcji 0013 dystraktor „6 listopada” obok „6 grudnia”, karta Anki ze słuchu z 十二月.
  - słuchanie do końca wypowiedzi: gdy po odpowiedzi pada でも, właściwa informacja jest dalej. W 0013 nagranie tej samej budowy w formie zwykłej (ほうが → でも → いちばん), w Anki karta ze słuchu z e6.
- Nagrania do lekcji trzeba sprawdzać także długością i pauzami, nie tylko `anki/.segment` i rozpoznawaniem mowy: wadę e5 pokazała dopiero różnica długości. Pułapka きょうは opisana w nagłówku `anki/build.py`.
- Przy lukach z partykułą obok warto uznawać odpowiedź z dopisaną partykułą jako „prawie” z komunikatem (tak było w b2: `data-near`), ale liczy się ona jako błąd; uczniowi mówić wprost, że to nie jest luka w wiedzy.
