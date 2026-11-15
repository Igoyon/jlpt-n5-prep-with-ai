/*
 * Komponenty lekcji kursu JLPT N5.
 *
 * Użycie w HTML (po <link rel="stylesheet" href="../assets/style.css">):
 *   <body data-lesson="0001"> … <script src="../assets/lesson.js"></script>
 *
 * Audio (Web Speech API, głos ja-JP):
 *   <button class="say" data-say="たかいです">▶</button>
 *   Dialog (dwa głosy na zmianę, kwestie rozdzielone „|”):
 *   <button class="say" data-dialog="A: 行きませんか。|B: いいですね。">▶</button>
 *   Syntezator czyta kanę dosłownie, więc partykuły は／へ po kanie zamieniamy na わ／え, gdy stoją przed
 *   spacją, przecinkiem, kropką albo „…” (Speech.spoken). Po partykule zawsze stawiaj spację: じゅうじは　どう.
 *   Po kanji zostawiamy は (前は czyta dobrze, a 前わ czyta jako „zen”).
 *   Głosy: najlepszy dostępny (premium > enhanced > Google > compact). Głosów Eloquence (Eddy, Reed…)
 *   nie używamy, bo są robotyczne. Brak drugiego dobrego głosu → druga osoba mówi tym samym głosem niżej.
 *
 * Pytanie wyboru (opcje tasowane; poprawna ma atrybut data-ok):
 *   <div class="q mcq" data-id="p1">
 *     <p class="prompt">…</p>
 *     <div class="opts"><button data-ok>に</button><button>で</button></div>
 *     <p class="why">wyjaśnienie</p>
 *   </div>
 *   data-say="…"      na .q → przycisk odtwarzania (zadanie ze słuchu); .transcript odsłania się po odpowiedzi
 *   data-dialog="…"   na .q → jak data-say, ale dialog dwóch osób
 *   data-noshuffle    na .q → stała kolejność opcji
 *
 * Pytanie wpisywane:
 *   <div class="q typed" data-id="t1" data-answers="まって|待って" data-near="もって=>To forma 持つ (trzymać)."></div>
 *   Odmiana przymiotnika (odpowiedzi generowane automatycznie, forma grzeczna):
 *   <div class="q typed" data-id="t2" data-adj="寒い|さむい" data-kind="i|na|ii" data-form="pres|neg|past|pastneg|te"></div>
 *   data-register="plain" → oczekiwana forma zwykła zamiast grzecznej
 *   te = forma łącząca (寒くて, 静かで, よくて); podpowiada przy ✗ 静かくて, ✗ 安いで, ✗ いくて, ✗ 寒くで.
 *   Odmiana czasownika (odpowiedzi i typowe błędy generowane automatycznie):
 *   <div class="q typed" data-id="t3" data-verb="書く|かく" data-group="u|ru|irr" data-form="te|ta|kudasai|teimasu|temoii|tewaikenai|nai|naide|nakereba|dict|koto|mae|taato|tari|takoto"></div>
 *   u = godan (行く obsłużone jako wyjątek), ru = ichidan, irr = する／来る (też 勉強する).
 *   kudasai = forma て + ください (przyjmuje też 下さい; podpowiada przy samym て i przy ✗ 待ちください).
 *   teimasu = forma て + います (podpowiada przy samym て, przy zwykłym ている i przy ✗ 読みています).
 *   temoii = forma て + もいいです (przyjmuje też ～てもいいですか; podpowiada przy braku も, przy zwykłym ～てもいい).
 *   tewaikenai = forma て + はいけません (przyjmuje też ～てはだめです; podpowiada przy ✗ ～てわ, ✗ ～てもいけません,
 *   potocznym ～ちゃいけない／～ちゃだめ i zwykłym ～てはいけない).
 *   nai = forma ない (書かない, 食べない, しない, こない／来ない, ある → ない); podpowiada przy ✗ 買あない, ✗ 帰ない (る-u),
 *   ✗ 食べらない, ✗ 書きない (rdzeń ます), ✗ きない／すない, ✗ あらない i przy grzecznym ～ません.
 *   naide = forma ない + でください (przyjmuje też 下さい); podpowiada przy samym ない, braku で, potocznym ～ないで,
 *   ✗ ～なくてください, ✗ 撮りないでください, ✗ ～ませんでください i przy prośbie twierdzącej ～てください.
 *   nakereba = forma ない + ければなりません (przyjmuje też ～なければいけません, ～なくてはいけません); podpowiada przy samym
 *   ない, ✗ ～ないければ, ✗ ～なければなります, zwykłym ～なければならない, potocznym ～なきゃ／～なくちゃ, ～ないでください
 *   i przy błędach samej formy ない (jak nai).
 *   dict = forma słownikowa (data-verb to odpowiedź; w prompcie pokaż formę ます); podpowiada przy ✗ 書きる.
 *   koto = forma słownikowa + ことができます (przyjmuje też 出来ます, 事, ～か); podpowiada przy braku こと (✗ 泳ぐができます),
 *   ✗ ことをできます, braku が, zwykłym ～ことができる, rdzeniu ます (✗ 泳ぎことが) i ✗ 泳ぎる.
 *   mae = forma słownikowa + まえに (przyjmuje też 前に); podpowiada przy formie た (✗ 来たまえに), formie て (✗ 来てまえに,
 *   ～てから to „po”), ✗ 寝るのまえに, braku に i rdzeniu ます.
 *   taato = forma た + あとで (przyjmuje też 後で); podpowiada przy formie słownikowej (✗ 食べるあとで, lustro まえに),
 *   formie て (✗ 食べてあとで, ～てから), samej formie た, ✗ 食べたのあとで, braku で, ✗ ～ましたあとで i błędach formy た.
 *   tari = forma た + り (読んだり, 見たり, したり); podpowiada przy ✗ 読んでり, ✗ 読むたり, ✗ 読みたり, samej formie た i て.
 *   takoto = forma た + ことがあります (przyjmuje też 事, ～か); podpowiada przy formie słownikowej (to wzór ～ことができます),
 *   ✗ ～たことができます, braku が, zwykłym ～たことがある, ✗ ～たことがありました, ✗ ～ましたことが i formie て.
 *   Czytanie daty (odpowiedź hiraganą; typowe błędy generowane automatycznie):
 *   <div class="q typed" data-id="t4" data-date="4/8"></div>     → しがつようか
 *   data-date="4/" → sam miesiąc (しがつ), data-date="/8" → sam dzień (ようか), data-date="12/24" → じゅうにがつにじゅうよっか.
 *   Podpowiada przy ✗ よんがつ／なながつ／きゅうがつ, ✗ はちにち／よんにち (dni 1–10, 14, 20, 24 mają czytania specjalne),
 *   przy ✗ にち po dniu specjalnym (ようかにち) i gdy wpisano kanji zamiast kany. N5.Dates.read(m, d) zwraca czytanie.
 *   Liczba z licznikiem (odpowiedź hiraganą; liczby 1–10, typowe błędy generowane automatycznie):
 *   <div class="q typed" data-id="t5" data-count="3/hon"></div>   → さんぼん
 *   Liczniki: tsu (～つ), nin (～人), hon (～本), mai (～枚), hiki (～匹), kai (～回). data-count="?/hon" → pytajnik (なんぼん, いくつ).
 *   Przyjmuje warianty (はっぽん／はちほん, じゅっぽん／じっぽん, ななにん／しちにん). Podpowiada przy ✗ さんつ, dniu miesiąca
 *   zamiast sztuk (みっか), ✗ いちにん, ✗ よんにん, braku zmiany brzmienia (✗ さんほん, ✗ いちかい), ✗ さんがい (piętro),
 *   złym liczniku (さんまい zamiast さんぼん) i gdy wpisano kanji albo cyfry. N5.Counters.read(n, "hon") zwraca czytanie.
 *   data-near działa też przy data-adj/data-verb/data-date/data-count. data-hint="…" → podpowiedź po błędzie bez dopasowania
 *   (przy data-verb domyślnie reguła dla końcówki).
 *
 * Wynik: <div class="summary"></div> — liczy pierwsze podejścia, „Kopiuj wynik” do wklejenia nauczycielowi.
 */
(function () {
  "use strict";

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Audio ---------- */
  const Speech = {
    rate: parseFloat(store.get("n5.rate")) || 0.9,
    voice: null,
    voiceB: null,
    pitchB: 1,
    // Ocena jakości głosu: nazwy bywają zlokalizowane, voiceURI na macOS nie (com.apple.voice.premium.ja-JP.Kyoko).
    score(v) {
      const id = v.name + " " + v.voiceURI;
      if (/eloquence|speech\.synthesis|\b(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/i.test(id)) return 0;
      if (/premium/i.test(id)) return 4;
      if (/enhanced|ulepsz|rozszerz|erweitert|amélior/i.test(id)) return 3;
      if (/google/i.test(id)) return 2;
      return 1;
    },
    pickVoice() {
      if (!("speechSynthesis" in window)) return;
      const vs = speechSynthesis.getVoices()
        .filter(v => /^ja/i.test(v.lang) && this.score(v) > 0)
        .sort((a, b) => this.score(b) - this.score(a) || /Kyoko/i.test(b.name) - /Kyoko/i.test(a.name));
      this.voice = vs[0] || null;
      // Druga osoba w dialogu: inny głos (inna osoba, nie ta sama w innej jakości).
      const who = v => v.name.replace(/\s*\(.*$/, "");
      this.voiceB = vs.find(v => this.voice && who(v) !== who(this.voice)) || this.voice;
      this.pitchB = this.voiceB === this.voice ? 0.75 : 1;
    },
    // Tekst dla syntezatora: partykuły は／へ czytane jako わ／え.
    spoken(text) {
      return text
        .replace(/(?<=[ぁ-ゖァ-ヺー])は(?=[\s　、。,.…！？!?]|$)/g, "わ")
        .replace(/(?<=[ぁ-ゖァ-ヺー])へ(?=[\s　、。,.…！？!?]|$)/g, "え");
    },
    utter(text, voice, pitch) {
      const u = new SpeechSynthesisUtterance(this.spoken(text));
      u.lang = "ja-JP";
      if (voice) u.voice = voice;
      u.rate = this.rate;
      u.pitch = pitch || 1;
      return u;
    },
    say(text) {
      if (!("speechSynthesis" in window)) { alert("Ta przeglądarka nie obsługuje syntezy mowy."); return; }
      speechSynthesis.cancel();
      speechSynthesis.speak(this.utter(text, this.voice));
    },
    dialog(lines) {
      if (!("speechSynthesis" in window)) { alert("Ta przeglądarka nie obsługuje syntezy mowy."); return; }
      speechSynthesis.cancel();
      const speakers = [];
      lines.forEach(line => {
        const m = line.match(/^\s*([A-Za-zＡ-Ｚ一-龯ぁ-んァ-ン]+)\s*[:：]\s*(.*)$/);
        const who = m ? m[1] : String(speakers.length % 2);
        if (!speakers.includes(who)) speakers.push(who);
        const b = speakers.indexOf(who) % 2 === 1;
        speechSynthesis.speak(this.utter(m ? m[2] : line, b ? this.voiceB : this.voice, b ? this.pitchB : 1));
      });
    },
  };
  if ("speechSynthesis" in window) {
    Speech.pickVoice();
    speechSynthesis.onvoiceschanged = () => Speech.pickVoice();
  }

  /* ---------- Odmiana przymiotników ---------- */
  const Adj = {
    // Zwraca {polite: [...], plain: [...]} dla jednej pisowni słowa.
    forms(word, kind, form) {
      if (kind === "na") {
        const s = word.replace(/な$/, "");
        return {
          pres: { polite: [s + "です"], plain: [s + "だ"] },
          neg: { polite: [s + "じゃないです", s + "ではないです", s + "じゃありません", s + "ではありません"], plain: [s + "じゃない", s + "ではない"] },
          past: { polite: [s + "でした"], plain: [s + "だった"] },
          pastneg: {
            polite: [s + "じゃなかったです", s + "ではなかったです", s + "じゃありませんでした", s + "ではありませんでした"],
            plain: [s + "じゃなかった", s + "ではなかった"],
          },
          te: { polite: [s + "で"], plain: [s + "で"] },
        }[form];
      }
      const stem = kind === "ii" ? (word.startsWith("良") ? "良" : "よ") : word.slice(0, -1);
      return {
        pres: { polite: [word + "です"], plain: [word] },
        neg: { polite: [stem + "くないです", stem + "くありません"], plain: [stem + "くない"] },
        past: { polite: [stem + "かったです"], plain: [stem + "かった"] },
        pastneg: { polite: [stem + "くなかったです", stem + "くありませんでした"], plain: [stem + "くなかった"] },
        te: { polite: [stem + "くて"], plain: [stem + "くて"] },
      }[form];
    },
    all(spellings, kind, form, register) {
      return spellings.flatMap(w => this.forms(w, kind, form)[register]);
    },
  };

  /* ---------- Odmiana czasowników ---------- */
  const Verb = {
    // Końcówka godan → forma て (forma た: て→た, で→だ).
    U_TE: { "う": "って", "つ": "って", "る": "って", "む": "んで", "ぶ": "んで", "ぬ": "んで", "く": "いて", "ぐ": "いで", "す": "して" },
    RULE: {
      "う": "う・つ・る → って", "つ": "う・つ・る → って", "る": "う・つ・る → って",
      "む": "む・ぶ・ぬ → んで", "ぶ": "む・ぶ・ぬ → んで", "ぬ": "む・ぶ・ぬ → んで",
      "く": "く → いて", "ぐ": "ぐ → いで", "す": "す → して",
    },
    isIku: w => /^(行|い)く$/.test(w) || w.endsWith("行く"),
    te(word, group) {
      if (group === "irr") {
        if (word.endsWith("する")) return word.slice(0, -2) + "して";
        if (word.endsWith("来る")) return word.slice(0, -2) + "来て";
        if (word.endsWith("くる")) return word.slice(0, -2) + "きて";
      }
      if (group === "ru") return word.slice(0, -1) + "て";
      if (this.isIku(word)) return word.slice(0, -1) + "って";
      return word.slice(0, -1) + this.U_TE[word.slice(-1)];
    },
    // Forma て → forma docelowa: ta (て→た, で→だ), kudasai (+ください), teimasu (+います),
    // temoii (+もいいです), tewaikenai (+はいけません), te (bez zmian).
    fix(x, form) {
      if (form === "ta") return x.replace(/て$/, "た").replace(/で$/, "だ");
      if (form === "kudasai") return x + "ください";
      if (form === "teimasu") return x + "います";
      if (form === "temoii") return x + "もいいです";
      if (form === "tewaikenai") return x + "はいけません";
      return x;
    },
    // Rdzeń formy ます (待ち, 食べ, し, 来): typowy błąd ✗ 待ちください.
    masuStem(word, group) {
      const I = { "う": "い", "つ": "ち", "る": "り", "む": "み", "ぶ": "び", "ぬ": "に", "く": "き", "ぐ": "ぎ", "す": "し" };
      if (group === "irr") return word.endsWith("する") ? word.slice(0, -2) + "し" : word.slice(0, -1).replace(/く$/, "き");
      if (group === "ru") return word.slice(0, -1);
      return word.slice(0, -1) + I[word.slice(-1)];
    },
    // Forma ない: u → rząd あ (う → わ), ある → ない; る: odetnij る; する → しない, 来る → こない.
    A_ROW: { "う": "わ", "つ": "た", "る": "ら", "む": "ま", "ぶ": "ば", "ぬ": "な", "く": "か", "ぐ": "が", "す": "さ" },
    isAru: w => /^(有|あ)る$/.test(w),
    nai(word, group) {
      if (group === "irr") {
        if (word.endsWith("する")) return [word.slice(0, -2) + "しない"];
        if (word.endsWith("来る")) return [word.slice(0, -2) + "来ない", word.slice(0, -2) + "こない"];
        if (word.endsWith("くる")) return [word.slice(0, -2) + "こない"];
      }
      if (group === "ru") return [word.slice(0, -1) + "ない"];
      if (this.isAru(word)) return ["ない"];
      return [word.slice(0, -1) + this.A_ROW[word.slice(-1)] + "ない"];
    },
    form(word, group, form) {
      if (form === "dict") return [word];
      if (form === "nai") return this.nai(word, group);
      if (form === "nakereba") return this.nai(word, group).flatMap(n => {
        const s = n.slice(0, -1); // 飲まな
        return [s + "ければなりません", s + "ければいけません", s + "くてはいけません"];
      });
      if (form === "koto") return ["できます", "出来ます"].flatMap(x => ["こと", "事"].map(k => word + k + "が" + x)).flatMap(x => [x, x + "か"]);
      if (form === "mae") return [word + "まえに", word + "前に"];
      if (form === "naide") {
        const r = this.nai(word, group).map(x => x + "でください");
        return r.concat(r.map(x => x.replace(/ください$/, "下さい")));
      }
      if (form === "taato" || form === "tari" || form === "takoto") {
        const ta = this.form(word, group, "ta");
        if (form === "taato") return ta.flatMap(t => [t + "あとで", t + "後で"]);
        if (form === "tari") return ta.map(t => t + "り");
        return ta.flatMap(t => ["こと", "事"].map(k => t + k + "があります")).flatMap(x => [x, x + "か"]);
      }
      const t = this.te(word, group);
      const out = [t];
      if (group === "irr" && word.endsWith("来る")) out.push(word.slice(0, -2) + "きて");
      const res = out.map(x => this.fix(x, form));
      if (form === "kudasai") return res.concat(res.map(x => x.replace(/ください$/, "下さい")));
      if (form === "temoii") return res.map(x => x + "か").concat(res); // pytanie pokazywane jako wzór
      if (form === "tewaikenai") return res.concat(res.map(x => x.replace(/いけません$/, "だめです")));
      return res;
    },
    // Typowe błędy: zła grupa, zła reguła, 行く jak zwykłe く; przy kudasai też brak ください i ✗ 待ちください.
    near(word, group, form) {
      if (form === "nai" || form === "naide" || form === "nakereba") return this.nearNai(word, group, form);
      if (form === "koto" || form === "mae") return this.nearDict(word, group, form);
      if (form === "taato" || form === "tari" || form === "takoto") return this.nearTa(word, group, form);
      if (form === "dict") {
        const bad = this.masuStem(word, group) + "る";
        return group !== "u" ? [] : [[bad, `Forma słownikowa czasownika u kończy się na rzędzie う: ${this.masuStem(word, group)} → ${word}.`]];
      }
      const fix = x => this.fix(x, form);
      const end = word.slice(-1), stem = word.slice(0, -1), out = [];
      if (form === "kudasai") {
        this.form(word, group, "te").forEach(t => out.push([t, `Forma て jest dobra. Grzeczna prośba: dodaj jeszcze ください.`]));
        out.push([this.masuStem(word, group) + "ください", `ください łączy się z formą て, nie z rdzeniem formy ます: ${this.form(word, group, form)[0]}.`]);
      }
      if (form === "teimasu") {
        this.form(word, group, "te").forEach(t => {
          out.push([t, `Forma て jest dobra. Teraz dodaj います.`]);
          out.push([t + "いる", `To forma zwykła (～ている). Tu grzecznie: ${t}います.`]);
          out.push([t + "る", `To potoczne ～てる (い wypada). Tu grzecznie: ${t}います.`]);
        });
        out.push([this.masuStem(word, group) + "ています", `います łączy się z formą て, nie z rdzeniem formy ます: ${this.form(word, group, form)[0]}.`]);
      }
      if (form === "temoii") {
        this.form(word, group, "te").forEach(t => {
          out.push([t, `Forma て jest dobra. Pozwolenie: dodaj もいいです.`]);
          out.push([t + "いいです", `Brakuje も: ${t}もいいです.`]);
          out.push([t + "いいですか", `Brakuje も: ${t}もいいですか.`]);
          out.push([t + "もいい", `To forma zwykła (～てもいい). Tu grzecznie: ${t}もいいです.`]);
          out.push([t + "もいい?", `To forma zwykła (～てもいい). Tu grzecznie: ${t}もいいですか.`]);
          out.push([t + "はいいです", `Pozwolenie to ～てもいいです (も, nie は). ～てはいけません to zakaz.`]);
        });
        out.push([this.masuStem(word, group) + "もいいです", `もいいです łączy się z formą て, nie z rdzeniem formy ます: ${this.form(word, group, form)[0]}.`]);
      }
      if (form === "tewaikenai") {
        const te = this.form(word, group, "te");
        te.forEach(t => {
          out.push([t, `Forma て jest dobra. Zakaz: dodaj はいけません.`]);
          out.push([t + "わいけません", `Czytasz „wa”, ale to partykuła は: ${t}はいけません.`]);
          out.push([t + "もいけません", `Zakaz to ～てはいけません (は, nie も). ～ても jest w pozwoleniu: ～てもいいです.`]);
          out.push([t + "はいけない", `To forma zwykła (～てはいけない). Tu grzecznie: ${t}はいけません.`]);
          out.push([t + "はだめ", `To forma zwykła. Tu grzecznie: ${t}はいけません (albo ${t}はだめです).`]);
          out.push([t + "はいけませんです", `Po いけません nie ma です: ${t}はいけません.`]);
          out.push([t.replace(/て$/, "ちゃ").replace(/で$/, "じゃ") + "いけない", `To potoczne ～ちゃいけない (z anime). Tu grzecznie: ${t}はいけません.`]);
          out.push([t.replace(/て$/, "ちゃ").replace(/で$/, "じゃ") + "だめ", `To potoczne ～ちゃだめ (z anime). Tu grzecznie: ${t}はいけません.`]);
        });
        out.push([this.masuStem(word, group) + "はいけません", `はいけません łączy się z formą て, nie z rdzeniem formy ます: ${te[0]}はいけません.`]);
      }
      if (group === "ru") {
        out.push([fix(stem + "って"), `${word} to czasownik る: odcinasz る i dodajesz ${fix("て")}.`]);
      } else if (group === "u") {
        if (end === "る") out.push([fix(stem + "て"), `${word} wygląda jak czasownik る, ale to u (wyjątek). Reguła: ${this.RULE[end]}.`]);
        if (this.isIku(word)) out.push([fix(stem + "いて"), `行く to wyjątek: ${fix("行って")}, nie ${fix("行いて")}.`]);
        Object.values(this.U_TE).forEach(e => out.push([fix(stem + e), `Końcówka ${end}: ${this.RULE[end]}.`]));
        out.push([fix(stem + "て"), `To czasownik u, więc nie wystarczy zamienić ${end} na て. Reguła: ${this.RULE[end]}.`]);
      }
      // Przy pytaniu o pozwolenie te same błędy z か na końcu.
      if (form === "temoii") out.push(...out.map(([a, m]) => [a + "か", m]));
      const ok = this.form(word, group, form);
      return out.filter(([a]) => !ok.includes(a));
    },
    // Typowe błędy formy ない, ～ないでください i ～なければなりません. Najpierw podpowiedzi dla grupy, potem ogólne (wygrywa pierwsze dopasowanie).
    nearNai(word, group, form) {
      const end = word.slice(-1), stem = word.slice(0, -1), out = [];
      const ok = this.form(word, group, form), nai = this.nai(word, group);
      const fix = x => form === "naide" ? x + "でください" : form === "nakereba" ? x.replace(/ない$/, "なければなりません") : x;
      if (group === "irr" && word.endsWith("する")) {
        const s = word.slice(0, -2);
        [s + "すない", s + "さない", s + "しらない"].forEach(a => out.push([fix(a), `する → しない: ${ok[0]}.`]));
      } else if (group === "irr") {
        const s = word.replace(/(来|く)る$/, "");
        [s + "きない", s + "くない", s + "くらない", s + "来らない"].forEach(a => out.push([fix(a), `来る → こない (kanji 来ない też czytasz こない).`]));
      } else if (group === "ru") {
        out.push([fix(stem + "らない"), `${word} to czasownik る: odcinasz る i dodajesz ない (${ok[0]}).`]);
      } else {
        if (this.isAru(word)) out.push([fix("あらない"), `ある ma nieregularne przeczenie: samo ない.`]);
        if (end === "う") out.push([fix(stem + "あない"), `Końcówka う przechodzi w わ, nie w あ: ${ok[0]}.`]);
        if (end === "る") out.push([fix(stem + "ない"), `${word} wygląda jak czasownik る, ale to u (wyjątek): る → ら, ${ok[0]}.`]);
        out.push([fix(this.masuStem(word, group) + "ない"), `ない łączy się z rzędem あ, nie z rdzeniem formy ます (rząd い): ${ok[0]}.`]);
        out.push([fix(word + "ない"), `Forma ない powstaje z rzędu あ: ${end} → ${this.A_ROW[end]}, potem ない (${ok[0]}).`]);
      }
      if (form === "nai") {
        out.push([this.masuStem(word, group) + "ません", `To przeczenie grzeczne. Tu forma zwykła: ${ok[0]}.`]);
      }
      if (form === "naide") {
        nai.forEach(n => {
          out.push([n, `Forma ない jest dobra. Prośba: dodaj でください.`]);
          out.push([n + "ください", `Brakuje で: ${n}でください.`]);
          out.push([n + "で", `To potoczne ～ないで (z anime: 行かないで！). Tu grzecznie: ${n}でください.`]);
          out.push([n.replace(/ない$/, "なくて") + "ください", `Prośba to ～ないでください, nie なくて: ${n}でください.`]);
        });
        out.push([this.masuStem(word, group) + "ないでください", `ないでください łączy się z formą ない, nie z rdzeniem formy ます: ${ok[0]}.`]);
        out.push([this.masuStem(word, group) + "ませんでください", `Przeczenie w prośbie to forma ない: ${ok[0]}.`]);
        this.form(word, group, "te").forEach(t => out.push([t + "ください", `To prośba „proszę zrób”. „Proszę nie rób” to forma ない + でください: ${ok[0]}.`]));
      }
      if (form === "nakereba") {
        nai.forEach(n => {
          const s = n.slice(0, -1), must = s + "ければなりません";
          out.push([n, `To samo „nie robię”. „Muszę” to forma ない bez い + ければなりません: ${must}.`]);
          out.push([n + "ければなりません", `ない traci い: ${must} (nie ないければ).`]);
          out.push([s + "ければなります", `Na końcu jest przeczenie なりません (dosł. „jeśli nie zrobię, nie będzie dobrze”): ${must}.`]);
          out.push([s + "ければならない", `To forma zwykła. Tu grzecznie: ${must}.`]);
          out.push([s + "ければ", `Brakuje końca: ${must}.`]);
          out.push([s + "きゃ", `To potoczne ～なきゃ (z anime). Tu grzecznie: ${must}.`]);
          out.push([s + "くちゃ", `To potoczne ～なくちゃ. Tu grzecznie: ${must}.`]);
          out.push([n + "でください", `To prośba „proszę nie rób”. „Muszę” to ${must}.`]);
        });
        out.push([this.masuStem(word, group) + "なければなりません", `なければ łączy się z formą ない (rząd あ), nie z rdzeniem formy ます: ${ok[0]}.`]);
      }
      const seen = new Set(ok);
      return out.filter(([a]) => !seen.has(a) && seen.add(a));
    },
    // Typowe błędy ～ことができます i ～まえに: przed nimi zawsze forma słownikowa.
    nearDict(word, group, form) {
      const end = form === "koto" ? "ことができます" : "まえに", out = [];
      const ok = this.form(word, group, form), stem = this.masuStem(word, group);
      this.near(word, group, "dict").forEach(([a, m]) => out.push([a + end, m]));
      out.push([stem + end, `${end} łączy się z formą słownikową, nie z rdzeniem formy ます: ${ok[0]}.`]);
      out.push([stem + "ます" + end, `Przed ${end} stoi forma słownikowa, nie forma ます: ${ok[0]}.`]);
      if (form === "koto") {
        out.push([word + "ができます", `Czasownika nie łączysz od razu z が. Najpierw zrób z niego rzeczownik przez こと: ${ok[0]}.`]);
        out.push([word + "ことをできます", `Z できます idzie が, nie を: ${ok[0]}.`]);
        out.push([word + "ことできます", `Brakuje が: ${ok[0]}.`]);
        out.push([word + "ことができる", `To forma zwykła. Tu grzecznie: ${ok[0]}.`]);
        out.push(...out.map(([a, m]) => [a + "か", m]));
      }
      if (form === "mae") {
        const te = this.te(word, group);
        out.push([this.fix(te, "ta") + "まえに", `Przed まえに zawsze forma słownikowa, także gdy mówisz o przeszłości: ${ok[0]}.`]);
        out.push([te + "まえに", `Forma て łączy się z から („po”). „Przed” to forma słownikowa + まえに: ${ok[0]}.`]);
        out.push([te + "から", `To „po” (najpierw ${word}, potem reszta). Tu chcemy „przed”: ${ok[0]}.`]);
        out.push([word + "のまえに", `の stawiasz po rzeczowniku (ご飯のまえに). Po czasowniku od razu まえに: ${ok[0]}.`]);
        out.push([word + "まえ", `Brakuje に: ${ok[0]}.`]);
        out.push(...out.filter(([a]) => a.endsWith("まえに")).map(([a, m]) => [a.replace(/まえに$/, "前に"), m]));
      }
      const seen = new Set(ok);
      return out.filter(([a]) => !seen.has(a) && seen.add(a));
    },
    // Typowe błędy ～たあとで, ～たり i ～たことがあります: przed nimi zawsze forma た.
    nearTa(word, group, form) {
      const end = { taato: "あとで", tari: "り", takoto: "ことがあります" }[form], out = [];
      const ok = this.form(word, group, form), stem = this.masuStem(word, group);
      const ta = this.form(word, group, "ta"), te = this.form(word, group, "te");
      this.near(word, group, "ta").forEach(([a, m]) => out.push([a + end, m]));
      if (form === "taato") {
        out.push([word + "あとで", `Przed あとで stoi forma た (ta czynność jest już zrobiona), odwrotnie niż przed まえに: ${ok[0]}.`]);
        te.forEach(t => {
          out.push([t + "あとで", `Przed あとで forma た, nie て: ${ok[0]}. Forma て łączy się z から (${t}から).`]);
          out.push([t + "から", `To też znaczy „po”, ale tu ćwiczymy あとで: ${ok[0]}.`]);
        });
        ta.forEach(t => {
          out.push([t, `Forma た jest dobra. Teraz dodaj あとで.`]);
          out.push([t + "のあとで", `の stawiasz po rzeczowniku (ご飯のあとで). Po czasowniku od razu あとで: ${ok[0]}.`]);
          out.push([t + "あと", `W rozmowie samo あと też się słyszy, ale wzór z N5 to あとで: ${ok[0]}.`]);
          out.push([t + "あとに", `Na N5 ćwiczymy wzór z で: ${ok[0]}.`]);
          out.push([t + "まえに", `まえに to „przed” (i stoi po formie słownikowej). „Po” to forma た + あとで: ${ok[0]}.`]);
        });
        out.push([stem + "あとで", `あとで łączy się z formą た, nie z rdzeniem formy ます: ${ok[0]}.`]);
        out.push([stem + "ましたあとで", `Przed あとで stoi zwykła forma た, nie ～ました: ${ok[0]}.`]);
        out.push(...out.filter(([a]) => a.endsWith("あとで")).map(([a, m]) => [a.replace(/あとで$/, "後で"), m]));
      }
      if (form === "tari") {
        te.forEach(t => out.push([t + "り", `～たり powstaje z formy た, nie て (て → た, で → だ): ${ok[0]}.`]));
        ta.forEach(t => out.push([t, `Forma た jest dobra. Dodaj jeszcze り: ${ok[0]}.`]));
        te.forEach(t => out.push([t, `Forma て ustawia czynności po kolei. Tu podajesz przykłady, więc forma た + り: ${ok[0]}.`]));
        out.push([word + "たり", `たり to forma た + り, nie forma słownikowa + たり: ${ok[0]}.`]);
        out.push([word + "り", `Przed り stoi forma た, nie słownikowa: ${ok[0]}.`]);
        out.push([stem + "たり", `Forma た powstaje jak forma て, nie z rdzenia formy ます: ${ok[0]}.`]);
        out.push([stem + "ましたり", `Przed り stoi zwykła forma た, nie ～ました: ${ok[0]}.`]);
      }
      if (form === "takoto") {
        out.push([word + "ことがあります", `Forma słownikowa + こと to „umiem” (～ことができます). Doświadczenie to forma た: ${ok[0]}.`]);
        out.push([word + "ことができます", `To „umiem／można”. „Zdarzyło mi się” to forma た + ことがあります: ${ok[0]}.`]);
        ta.forEach(t => {
          out.push([t, `Forma た jest dobra. Teraz dodaj ことがあります.`]);
          out.push([t + "ことができます", `できます to „umiem／można” (po formie słownikowej). Doświadczenie: ${ok[0]}.`]);
          out.push([t + "ことあります", `Brakuje が: ${ok[0]}.`]);
          out.push([t + "ことをあります", `Z あります idzie が, nie を: ${ok[0]}.`]);
          out.push([t + "ことがある", `To forma zwykła. Tu grzecznie: ${ok[0]}.`]);
          out.push([t + "ことがありました", `Doświadczenie „masz” teraz, więc あります zostaje w czasie teraźniejszym: ${ok[0]}.`]);
          out.push([t + "があります", `Czasownika nie łączysz od razu z が. Najpierw こと: ${ok[0]}.`]);
        });
        te.forEach(t => out.push([t + "ことがあります", `Przed こと forma た, nie て: ${ok[0]}.`]));
        out.push([stem + "ことがあります", `ことがあります łączy się z formą た, nie z rdzeniem formy ます: ${ok[0]}.`]);
        out.push([stem + "ましたことがあります", `Przed こと stoi zwykła forma た, nie ～ました: ${ok[0]}.`]);
        out.push(...out.map(([a, m]) => [a + "か", m]));
      }
      const seen = new Set(ok);
      return out.filter(([a]) => !seen.has(a) && seen.add(a));
    },
    hint(word, group, form) {
      if (form === "dict") {
        if (group === "irr") return "Nieregularny: します → する, 来ます → くる.";
        if (group === "ru") return `Czasownik る: rdzeń + る (${word}).`;
        return "Czasownik u: rząd い przed ます zamień na rząd う (書き → 書く).";
      }
      if (form === "naide") return this.hint(word, group, "nai").replace(/\.$/, ". Potem でください.");
      if (form === "nakereba") return this.hint(word, group, "nai").replace(/\.$/, ". Potem ない → なければなりません.");
      if (form === "koto") return this.hint(word, group, "dict").replace(/\.$/, ". Potem ことができます.");
      if (form === "mae") return this.hint(word, group, "dict").replace(/\.$/, ". Potem まえに.");
      if (form === "taato") return this.hint(word, group, "ta").replace(/\.$/, ". Potem あとで.");
      if (form === "tari") return this.hint(word, group, "ta").replace(/\.$/, ". Potem り.");
      if (form === "takoto") return this.hint(word, group, "ta").replace(/\.$/, ". Potem ことがあります.");
      if (form === "nai") {
        if (group === "irr") return "Nieregularny: する → しない, 来る → こない.";
        if (group === "ru") return "Czasownik る: odetnij る, dodaj ない.";
        if (this.isAru(word)) return "ある to wyjątek: samo ない.";
        const end = word.slice(-1);
        return `Czasownik u: ${end} → ${this.A_ROW[end]}, potem ない${end === "う" ? " (う → わ, nie あ)" : ""}.`;
      }
      const fix = x => form === "ta" ? x.replace(/て/g, "た").replace(/で/g, "だ") : x;
      if (form === "kudasai") return this.hint(word, group, "te").replace(/\.$/, ". Potem ください.");
      if (form === "teimasu") return this.hint(word, group, "te").replace(/\.$/, ". Potem います.");
      if (form === "temoii") return this.hint(word, group, "te").replace(/\.$/, ". Potem もいいです.");
      if (form === "tewaikenai") return this.hint(word, group, "te").replace(/\.$/, ". Potem はいけません.");
      if (group === "irr") return `Nieregularny: ${fix("する → して, 来る → きて")}.`;
      if (group === "ru") return `Czasownik る: odetnij る, dodaj ${fix("て")}.`;
      if (this.isIku(word)) return `行く to wyjątek: ${fix("行って")}.`;
      return `Czasownik u, końcówka ${word.slice(-1)}: ${fix(this.RULE[word.slice(-1)])}.`;
    },
  };


  /* ---------- Daty: miesiące i dni miesiąca ---------- */
  const Dates = {
    MONTH: ["", "いちがつ", "にがつ", "さんがつ", "しがつ", "ごがつ", "ろくがつ", "しちがつ", "はちがつ", "くがつ", "じゅうがつ", "じゅういちがつ", "じゅうにがつ"],
    MONTH_BAD: { 4: "よんがつ", 7: "なながつ", 9: "きゅうがつ" },
    SPECIAL: { 1: "ついたち", 2: "ふつか", 3: "みっか", 4: "よっか", 5: "いつか", 6: "むいか", 7: "なのか", 8: "ようか", 9: "ここのか", 10: "とおか", 14: "じゅうよっか", 20: "はつか", 24: "にじゅうよっか" },
    NUM: ["", "いち", "に", "さん", "よん", "ご", "ろく", "しち", "はち", "く", "じゅう"],
    // Czytanie liczby 1–31 „po chińsku” (じゅういち, にじゅうさん); dla dni zwykłych + にち.
    number(n) {
      if (n <= 10) return this.NUM[n];
      const tens = Math.floor(n / 10), ones = n % 10;
      return (tens > 1 ? this.NUM[tens] : "") + "じゅう" + (ones ? this.NUM[ones] : "");
    },
    month(m) { return this.MONTH[m]; },
    day(d) {
      if (this.SPECIAL[d]) return this.SPECIAL[d];
      return this.number(d) + "にち"; // 11 → じゅういちにち, 17 → じゅうしちにち (przyjmuje też じゅうななにち)
    },
    // Wszystkie przyjmowane czytania dnia (17 → じゅうしちにち i じゅうななにち, 19 → じゅうくにち i じゅうきゅうにち).
    dayAll(d) {
      if (this.SPECIAL[d]) return [this.SPECIAL[d]];
      const alt = { 7: "なな", 9: "きゅう" };
      const out = [this.number(d) + "にち"];
      const ones = d % 10;
      if (alt[ones]) {
        const tens = Math.floor(d / 10);
        out.push((tens > 1 ? this.NUM[tens] : "") + "じゅう" + alt[ones] + "にち");
      }
      return out;
    },
    read(m, d) { return (m ? this.month(m) : "") + (d ? this.day(d) : ""); },
    all(m, d) {
      const ms = m ? [this.month(m)] : [""];
      const ds = d ? this.dayAll(d) : [""];
      return ms.flatMap(a => ds.map(b => a + b));
    },
    // Typowe błędy: liczebnik zamiast czytania specjalnego, miesiące 4/7/9, にち doklejone do czytania specjalnego.
    near(m, d) {
      const out = [];
      const ms = m ? [[this.month(m), ""]] : [["", ""]];
      if (m && this.MONTH_BAD[m]) ms.push([this.MONTH_BAD[m], `Miesiąc ${m} czyta się ${this.month(m)}, nie ${this.MONTH_BAD[m]}. Wyjątki: 四月 しがつ, 七月 しちがつ, 九月 くがつ.`]);
      const ds = d ? [[this.day(d), ""]] : [["", ""]];
      if (d && this.SPECIAL[d]) {
        const plain = this.number(d).replace(/し(?=にち$)|^し$/, "よん") + "にち";
        const special = {
          1: "いちにち to „jeden dzień” (ile dni). Pierwszy dzień miesiąca to ついたち.",
          20: "20. dzień miesiąca to はつか (jak 二十歳 はたち). にじゅうにち nie istnieje.",
          14: "14. to じゅうよっか: 十 + よっか (czwarty). Tak samo 24. にじゅうよっか.",
          24: "24. to にじゅうよっか: 二十 + よっか (czwarty). Tak samo 14. じゅうよっか.",
        };
        ds.push([plain, special[d] || `Dzień ${d} ma czytanie specjalne: ${this.SPECIAL[d]}, nie ${plain}.`]);
        if (d === 4) ds.push(["しにち", "Dzień 4 ma czytanie specjalne: よっか."]);
        ds.push([this.SPECIAL[d] + "にち", `${this.SPECIAL[d]} już znaczy „${d}. dzień”, bez にち.`]);
      }
      if (d && !this.SPECIAL[d]) {
        ds.push([this.number(d) + "か", `Czytania na か mają tylko dni 2–10, 14, 20 i 24. Dzień ${d}: ${this.day(d)}.`]);
        ds.push([this.number(d), `Brakuje にち: ${this.day(d)}.`]);
      }
      ms.forEach(([a, ma]) => ds.forEach(([b, mb]) => { if (ma || mb) out.push([a + b, [ma, mb].filter(Boolean).join(" ")]); }));
      return out;
    },
  };

  /* ---------- Liczniki: ～つ, ～人, ～本, ～枚, ～匹, ～回 ---------- */
  const Counters = {
    NUM: ["", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう", "じゅう"],
    KANJI: ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
    TSU: ["", "ひとつ", "ふたつ", "みっつ", "よっつ", "いつつ", "むっつ", "ななつ", "やっつ", "ここのつ", "とお"],
    DAY: ["", "", "ふつか", "みっか", "よっか", "いつか", "むいか", "なのか", "ようか", "ここのか", "とおか"],
    SOKUON: { 1: "いっ", 6: "ろっ", 8: "はっ", 10: "じゅっ" },
    C: {
      tsu: { kanji: "つ", what: "rzeczy ogólnie", q: "いくつ" },
      nin: { kanji: "人", base: "にん", what: "ludzi", q: "なんにん",
        irr: { 1: ["ひとり"], 2: ["ふたり"], 4: ["よにん"], 7: ["ななにん", "しちにん"], 9: ["きゅうにん", "くにん"] } },
      hon: { kanji: "本", base: "ほん", what: "rzeczy długie i wąskie", q: "なんぼん",
        irr: { 1: ["いっぽん"], 3: ["さんぼん"], 6: ["ろっぽん"], 8: ["はっぽん", "はちほん"], 10: ["じゅっぽん", "じっぽん"] } },
      mai: { kanji: "枚", base: "まい", what: "rzeczy płaskie", q: "なんまい", irr: {} },
      hiki: { kanji: "匹", base: "ひき", what: "małe zwierzęta", q: "なんびき",
        irr: { 1: ["いっぴき"], 3: ["さんびき"], 6: ["ろっぴき"], 8: ["はっぴき", "はちひき"], 10: ["じゅっぴき", "じっぴき"] } },
      kai: { kanji: "回", base: "かい", what: "razy", q: "なんかい",
        irr: { 1: ["いっかい"], 6: ["ろっかい"], 8: ["はっかい", "はちかい"], 10: ["じゅっかい", "じっかい"] } },
    },
    // Wszystkie przyjmowane czytania; n = 0 → pytajnik (いくつ, なんぼん).
    all(n, c) {
      const k = this.C[c];
      if (!n) return [k.q];
      if (c === "tsu") return [this.TSU[n]];
      if (k.irr[n]) return k.irr[n];
      const out = [this.NUM[n] + k.base];
      if (n === 7) out.push("しち" + k.base);
      return out;
    },
    read(n, c) { return this.all(n, c)[0]; },
    rule(c) {
      if (c === "hon") return "Przed ～本 liczby 1, 6, 8, 10 kończą się na っ i h → p (いっぽん, ろっぽん, はっぽん, じゅっぽん), po 3 i なん h → b (さんぼん, なんぼん). Reszta bez zmian (にほん).";
      if (c === "hiki") return "Przed ～匹 liczby 1, 6, 8, 10 kończą się na っ i h → p (いっぴき, ろっぴき, はっぴき, じゅっぴき), po 3 i なん h → b (さんびき, なんびき). Reszta bez zmian (にひき).";
      if (c === "kai") return "Przed ～回 liczby 1, 6, 8, 10 kończą się na っ (いっかい, ろっかい, はっかい, じゅっかい). Samo かい się nie zmienia.";
      if (c === "nin") return "Ludzie: ひとり, ふたり (wyjątki), od trzech liczba + にん; cztery osoby to よにん.";
      if (c === "mai") return "～枚 nigdy nie zmienia brzmienia: liczba + まい.";
      return "～つ ma własne liczebniki, o tych samych rdzeniach co dni miesiąca (ふつか → ふたつ, みっか → みっつ).";
    },
    // Typowe błędy: liczebnik chiński przy ～つ, brak zmiany brzmienia (✗ さんほん), zły licznik, kanji zamiast kany.
    near(n, c) {
      const k = this.C[c], ok = this.all(n, c), right = ok[0], out = [];
      const push = (a, m) => { if (a && !ok.includes(a) && !out.some(([x]) => x === a)) out.push([a, m]); };
      const plain = this.NUM[n];
      if (!n) {
        if (c === "tsu") {
          push("なんつ", "O liczbę sztuk pytasz いくつ, nie ✗ なんつ.");
          push("いくら", "いくら pyta o cenę. O liczbę sztuk: いくつ.");
        } else {
          push("なん" + k.base, `Po なん licznik dźwięczy tak jak po さん: ${right}.`);
          push("なに" + k.base, `Przed licznikiem 何 czyta się なん: ${right}.`);
          push("いくつ", `いくつ pyta o sztuki (～つ). Z licznikiem ～${k.kanji}: ${right}.`);
          if (c === "kai") push("なんがい", "なんがい to „które piętro” (何階). „Ile razy” to なんかい.");
        }
        push("何" + k.kanji, `Zapis dobry, ale tu chodzi o czytanie. Wpisz hiraganą: ${right}.`);
        return out;
      }
      if (c === "tsu") {
        push(plain + "つ", `～つ łączy się z rodzimymi liczebnikami: ${right}, nie ✗ ${plain}つ.`);
        push(plain, `Sam liczebnik to za mało. Sztuki liczysz przez ～つ: ${right}.`);
        if (this.DAY[n]) push(this.DAY[n], `${this.DAY[n]} to ${n}. dzień miesiąca. Rdzeń ten sam, ale sztuki kończą się inaczej: ${right}.`);
        if (n === 10) push("とおつ", "10 to samo とお, już bez つ.");
        const twin = { 3: 6, 6: 3, 4: 8, 8: 4 }[n];
        if (twin) push(this.TSU[twin], `${this.TSU[twin]} to ${twin}. Tutaj ${n}: ${right}.`);
      } else {
        if (c === "nin") {
          if (n <= 2) {
            push(plain + "にん", `${n === 1 ? "Jedna osoba to ひとり" : "Dwie osoby to ふたり"} (wyjątek, rodzimy liczebnik). Od trzech: liczba + にん.`);
            push(this.TSU[n], `${this.TSU[n]} liczy rzeczy. O ludziach: ${right}.`);
          }
          if (n === 4) ["よんにん", "しにん"].forEach(a => push(a, "Cztery osoby to よにん: よ bez ん. (しにん to 死人, „zmarły”.)"));
        }
        const stems = [plain, this.SOKUON[n]].filter(Boolean);
        const ends = c === "hon" ? ["ほん", "ぼん", "ぽん"] : c === "hiki" ? ["ひき", "びき", "ぴき"] : c === "kai" ? ["かい", "がい"] : [];
        stems.forEach(s => ends.forEach(e => {
          if (c === "kai" && e === "がい") push(s + e, `${s + e} brzmi jak piętro (～階, np. さんがい). „Razy” się nie udźwięcznia: ${right}.`);
          else push(s + e, k.irr[n] ? this.rule(c) : `Po ${n} licznik się nie zmienia: ${right}. ${this.rule(c)}`);
        }));
        if (n === 4) push("し" + k.base, `4 przed licznikiem to よん: ${right}.`);
        if (n === 9) push("く" + k.base, `9 przed licznikiem to きゅう: ${right}.`);
        if (n === 10) push("じゅう" + k.base, this.rule(c));
        push(plain, `Brakuje licznika: ${right}.`);
        // Zły licznik.
        Object.keys(this.C).filter(o => o !== c).forEach(o => this.all(n, o).forEach(a => push(a, o === "tsu"
          ? `${a} jest zrozumiałe (～つ pasuje do większości rzeczy), ale tu ćwiczymy licznik ～${k.kanji}: ${right}.`
          : `${a} liczy ${this.C[o].what} (～${this.C[o].kanji}). Tu potrzebny licznik ～${k.kanji} (${k.what}): ${right}.`)));
      }
      const full = "０１２３４５６７８９"[n] || "１０";
      [this.KANJI[n], String(n), full].forEach(d => push(d + k.kanji, `Zapis dobry, ale tu chodzi o czytanie. Wpisz hiraganą: ${right}.`));
      return out;
    },
  };

  /* ---------- Wynik ---------- */
  const results = new Map(); // id → {ok, given, label}
  function record(id, ok, given, label) {
    if (results.has(id)) return; // liczy się tylko pierwsze podejście
    results.set(id, { ok, given, label });
    renderSummary();
  }
  function renderSummary() {
    const el = document.querySelector(".summary .score");
    if (!el) return;
    const total = document.querySelectorAll(".q").length;
    const ok = [...results.values()].filter(r => r.ok).length;
    el.textContent = `Wynik (pierwsze podejście): ${ok} / ${results.size} · pozostało ${total - results.size}`;
  }
  function summaryText() {
    const lesson = document.body.dataset.lesson || "?";
    const total = document.querySelectorAll(".q").length;
    const ok = [...results.values()].filter(r => r.ok).length;
    const errs = [...results.entries()].filter(([, r]) => !r.ok)
      .map(([id, r]) => `- ${id} ${r.label}: ${r.given}`);
    return `Lekcja ${lesson} — ${ok}/${results.size} poprawnie za pierwszym razem (pytań: ${total}).\n` +
      (errs.length ? `Błędy:\n${errs.join("\n")}` : "Bez błędów.");
  }

  /* ---------- Pomocnicze ---------- */
  const norm = s => s.replace(/[\s　。．.!！?？]/g, "").trim();
  function sayButton(text, big, isDialog) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "say" + (big ? " big" : "");
    b.textContent = big ? "▶ Odtwórz" : "▶";
    if (isDialog) b.dataset.dialog = text; else b.dataset.say = text;
    return b;
  }
  function shuffle(parent) {
    const kids = [...parent.children];
    for (let i = kids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kids[i], kids[j]] = [kids[j], kids[i]];
    }
    kids.forEach(k => parent.appendChild(k));
  }
  function labelOf(q) {
    const p = q.querySelector(".prompt");
    return p ? p.textContent.replace(/\s+/g, " ").trim().slice(0, 60) : "";
  }

  /* ---------- Pytania wyboru ---------- */
  function initMcq(q) {
    const opts = q.querySelector(".opts");
    if (!q.hasAttribute("data-noshuffle")) shuffle(opts);
    if (q.dataset.say) q.insertBefore(sayButton(q.dataset.say, true), q.firstChild);
    if (q.dataset.dialog) q.insertBefore(sayButton(q.dataset.dialog, true, true), q.firstChild);
    opts.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b || b.disabled) return;
      const ok = b.hasAttribute("data-ok");
      record(q.dataset.id, ok, b.textContent.trim(), labelOf(q));
      if (ok) {
        b.classList.add("ok");
        opts.querySelectorAll("button").forEach(x => (x.disabled = true));
        q.classList.add("done");
      } else {
        b.classList.add("bad");
        b.disabled = true;
      }
    });
  }

  /* ---------- Pytania wpisywane ---------- */
  function initTyped(q) {
    let accept, near = [], shown, hint = q.dataset.hint;
    if (q.dataset.adj) {
      const spellings = q.dataset.adj.split("|");
      const kind = q.dataset.kind, form = q.dataset.form;
      const reg = q.dataset.register === "plain" ? "plain" : "polite";
      const otherReg = reg === "plain" ? "polite" : "plain";
      accept = Adj.all(spellings, kind, form, reg);
      shown = Adj.forms(spellings[0], kind, form)[reg][0];
      if (form !== "te") Adj.all(spellings, kind, form, otherReg).forEach(a => near.push([a, reg === "polite"
        ? "Forma poprawna, ale zwykła. Tu potrzebna jest grzeczna: dodaj です."
        : "Forma poprawna, ale grzeczna. Tu potrzebna jest zwykła: bez です."]));
      const other = kind === "na" ? "i" : "na";
      const msg = form === "te"
        ? (kind === "na" ? "To przymiotnik な: łączysz przez で, bez くて." : "To przymiotnik い: łączysz przez くて (い → くて), bez で.")
        : kind === "na"
        ? "To przymiotnik な: odmieniasz go przez じゃ／でした, bez く／かった."
        : "To przymiotnik い: odmieniasz go przez く／かった, bez じゃ／でした.";
      if (form === "te") spellings.forEach(w => {
        if (kind === "na") { near.push([w.replace(/な$/, "") + "くて", msg]); near.push([w.replace(/な$/, "") + "なで", `Przymiotnik な łączysz przez samo で: ${shown}.`]); }
        else { near.push([w + "で", msg]); near.push([w.slice(0, -1) + "くで", `Forma łącząca przymiotnika い to くて, nie くで: ${shown}.`]); }
        if (kind === "ii") near.push([w + "くて", "いい odmienia się od よ: よくて, tak jak よくない i よかった."]);
      });
      ["polite", "plain"].forEach(r => Adj.all(spellings, other, form, r).forEach(a => near.push([a, msg])));
      if (kind === "ii") {
        ["polite", "plain"].forEach(r => Adj.all(spellings, "i", form, r).forEach(a =>
          near.push([a, "いい odmienia się od よ: よくない, よかった, よくなかった."])));
      }
      // ✗ じゃないでした / ✗ 寒くないでした: czas przeszły wchodzi do środka przeczenia.
      if (form === "pastneg") {
        Adj.all(spellings, kind, "neg", "plain").forEach(a => near.push([a + "でした",
          `Czas przeszły wchodzi do środka przeczenia: ${a} → ${a.replace(/ない$/, "なかった")}, potem です.`]));
      }
    } else if (q.dataset.verb) {
      const spellings = q.dataset.verb.split("|");
      const group = q.dataset.group, form = q.dataset.form || "te";
      accept = spellings.flatMap(w => Verb.form(w, group, form));
      shown = accept[0];
      spellings.forEach(w => near.push(...Verb.near(w, group, form)));
      if (!hint) hint = Verb.hint(spellings[0], group, form);
    } else if (q.dataset.date) {
      const [m, d] = q.dataset.date.split("/").map(x => parseInt(x, 10) || 0);
      accept = Dates.all(m, d);
      shown = Dates.read(m, d);
      near.push(...Dates.near(m, d));
      // Kanji albo cyfry zamiast czytania.
      const kanjiNum = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九", "三十", "三十一"];
      const kanji = (m ? kanjiNum[m] + "月" : "") + (d ? kanjiNum[d] + "日" : "");
      const digits = (m ? m + "月" : "") + (d ? d + "日" : "");
      [kanji, digits].forEach(k => near.push([k, `Zapis dobry, ale tu chodzi o czytanie. Wpisz hiraganą: ${shown}.`]));
      if (!hint) hint = m && d ? "Miesiąc + がつ, potem dzień (1–10, 14, 20, 24 mają czytania specjalne, reszta liczba + にち)."
        : m ? "Liczba + がつ. Wyjątki: 四月 し, 七月 しち, 九月 く." : "Dni 1–10, 14, 20, 24 mają czytania specjalne, reszta: liczba + にち.";
    } else if (q.dataset.count) {
      const [num, c] = q.dataset.count.split("/");
      const n = parseInt(num, 10) || 0;
      accept = Counters.all(n, c);
      shown = accept[0];
      near.push(...Counters.near(n, c));
      if (!hint) hint = Counters.rule(c);
    } else {
      accept = q.dataset.answers.split("|");
      shown = accept[0];
    }
    // Ręczne podpowiedzi mają pierwszeństwo przed generowanymi.
    (q.dataset.near || "").split(";;").filter(Boolean).reverse().forEach(pair => {
      const [a, m] = pair.split("=>");
      near.unshift([a, m]);
    });
    accept = accept.map(norm);
    near = near.map(([a, m]) => [norm(a), m]);

    const row = document.createElement("div");
    row.className = "row";
    const input = document.createElement("input");
    input.setAttribute("lang", "ja");
    input.setAttribute("autocomplete", "off");
    input.placeholder = "wpisz po japońsku…";
    const check = document.createElement("button");
    check.type = "button"; check.textContent = "Sprawdź";
    const reveal = document.createElement("button");
    reveal.type = "button"; reveal.textContent = "Pokaż";
    row.append(input, check, reveal);
    const fb = document.createElement("p");
    fb.className = "feedback";
    q.append(row, fb);

    function finish(ok) {
      input.disabled = true; check.disabled = true; reveal.disabled = true;
      input.classList.add(ok ? "ok" : "bad");
      q.classList.add("done");
      fb.className = "feedback " + (ok ? "ok" : "bad");
      fb.textContent = (ok ? "✓ " : "Odpowiedź: ") + shown + " ";
      fb.appendChild(sayButton(shown));
    }
    function doCheck() {
      const v = norm(input.value);
      if (!v) return;
      if (accept.includes(v)) { record(q.dataset.id, true, input.value, labelOf(q)); finish(true); return; }
      record(q.dataset.id, false, input.value, labelOf(q));
      const hit = near.find(([a]) => a === v);
      fb.className = "feedback bad";
      fb.textContent = hit ? hit[1] : (hint ? hint + " Spróbuj ponownie." : "Jeszcze nie. Spróbuj ponownie albo kliknij „Pokaż”.");
      input.classList.add("bad");
      input.select();
    }
    check.addEventListener("click", doCheck);
    // Enter zatwierdzony w trakcie konwersji IME nie powinien sprawdzać odpowiedzi.
    input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.isComposing && e.keyCode !== 229) doCheck(); });
    input.addEventListener("input", () => input.classList.remove("bad"));
    reveal.addEventListener("click", () => { record(q.dataset.id, false, "(pokazano odpowiedź)", labelOf(q)); finish(false); });
  }

  /* ---------- Pasek narzędzi i podsumowanie ---------- */
  function initToolbar() {
    const bar = document.querySelector(".toolbar");
    if (!bar) return;
    const label = document.createElement("label");
    label.innerHTML = 'Tempo mowy <select><option value="0.7">wolno</option><option value="0.9">spokojnie</option><option value="1">naturalnie</option></select>';
    const sel = label.querySelector("select");
    sel.value = String(Speech.rate);
    sel.addEventListener("change", () => { Speech.rate = parseFloat(sel.value); store.set("n5.rate", sel.value); });
    bar.appendChild(label);
    if ("speechSynthesis" in window && !speechSynthesis.getVoices().some(v => /^ja/i.test(v.lang))) {
      setTimeout(() => {
        if (!speechSynthesis.getVoices().some(v => /^ja/i.test(v.lang))) {
          const w = document.createElement("span");
          w.textContent = "· Brak japońskiego głosu w systemie. Otwórz lekcję w Safari lub Chrome.";
          bar.appendChild(w);
        }
      }, 1500);
    }
  }
  function initSummary() {
    const s = document.querySelector(".summary");
    if (!s) return;
    s.innerHTML = '<span class="score"></span>';
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn"; b.textContent = "Kopiuj wynik";
    b.addEventListener("click", async () => {
      const t = summaryText();
      try { await navigator.clipboard.writeText(t); b.textContent = "Skopiowano ✓"; }
      catch (e) { prompt("Skopiuj wynik:", t); }
      setTimeout(() => (b.textContent = "Kopiuj wynik"), 2000);
    });
    s.appendChild(b);
    renderSummary();
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("button.say");
    if (!b) return;
    if (b.dataset.dialog) Speech.dialog(b.dataset.dialog.split("|"));
    else Speech.say(b.dataset.say);
  });

  document.addEventListener("DOMContentLoaded", () => {
    let n = 0;
    document.querySelectorAll(".q").forEach(q => {
      const p = q.querySelector(".prompt");
      if (p) { const s = document.createElement("span"); s.className = "num"; s.textContent = ++n + "."; p.prepend(s); }
      if (q.classList.contains("mcq")) initMcq(q);
      if (q.classList.contains("typed")) initTyped(q);
    });
    initToolbar();
    initSummary();
  });

  window.N5 = { Adj, Verb, Dates, Counters, Speech };
})();
