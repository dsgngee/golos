# golos – UX/UI-Prototyp im Code: Design

**Datum:** 2026-10-21 · **Status:** Freigegeben vom Designer (2026-10-21)
**Quelle:** Kundengespräch („golos transcript.pdf“) + Abstimmung mit dem Designer in dieser Session.

Markierungen: **[Entscheidung Designer]** = vom Designer so festgelegt. **[Annahme Claude]** = mein Vorschlag, vom Designer im Überblick bestätigt, Details prüfbar. **[Dem Umsetzer überlassen]** = frei wählbar, solange die Ziele erfüllt sind.

---

## 1. Worum es geht

**Das Produkt:** Eine iOS-App, die beliebige Texte – Artikel, PDFs, Bücher, Sprachlern-Dialoge, Märchen – mit der **eigenen, geklonten Stimme** des Nutzers vorliest und als benannte Audiodatei in einer persönlichen Bibliothek ablegt. Man kann jederzeit an der letzten Stelle weiterhören.

**Warum:** Der Kunde nimmt Inhalte mit der eigenen Stimme nach eigener Erfahrung deutlich besser auf als mit fremden Sprechern (nur ~10 % der Hörbuch-Sprecher sind für ihn erträglich). Viele Inhalte existieren nur als Text/PDF. Persönliche Treiber: Chinesisch lernen (mit korrekter Aussprache in der eigenen Stimme), viel Fachliteratur, Gute-Nacht-Geschichten in Elternstimme für das eigene (autistische) Kind.

**Dieses Dokument beschreibt nicht die App, sondern den UX/UI-Prototyp:**
- Ein **Wegwerf-Prototyp im Code** statt Figma. **[Entscheidung Designer]**
- Zweck: ein echtes Gefühl für die App bekommen und daran **UX und UI verbessern**.
- Der Code wird **nicht** in die echte App übernommen; sobald die Technologie steht, wird das Design neu implementiert. **[Entscheidung Designer]**
- Was erhalten bleiben muss, sind die **Designentscheidungen**: Tokens, Komponenten, Abläufe, Screens.

**Wer ihn benutzt:** der Designer (iterieren, testen) und der Kunde (per privatem Link auf seinem iPhone durchklicken).

## 2. Ziele, Nicht-Ziele, Anti-Ziele

### Ziele
1. Alle Abläufe aus Abschnitt 6 sind auf einem iPhone **ohne Sackgassen durchklickbar**.
2. Er **fühlt sich wie eine native iOS-App an**, nicht wie eine Website.
3. Durchgehend in der gewählten visuellen Richtung **B «Студия»** (Abschnitt 4).
4. Designentscheidungen sind **übertragbar**: eine zentrale Token-Datei und eine **Styleguide-Seite** mit allen Tokens und Komponenten inkl. Zuständen.
5. **Schnell änderbar**: Tokens zentral, Inhalte/Texte in Datendateien, damit Iterationen billig sind.

### Nicht-Ziele
- Kein Backend, kein echtes Stimmklonen, keine echte Sprachsynthese, **kein Ton**. Wiedergabe, Aufnahme und Vertonung werden **simuliert**. **[Entscheidung Designer]**
- Kein echtes Parsen von PDFs/Links (Auswahl liefert vorbereiteten Beispieltext).
- Kein Telegram-Bot. **[Entscheidung Designer]**
- Kein Abo, keine Bezahlung, keine Paywall. **[Entscheidung Designer]**
- Keine anderen UI-Sprachen als Russisch, kein Android-spezifisches Design.
- Keine Produktionsqualität im Code (Architektur, Testabdeckung) – nur so viel Ordnung, dass Iterieren leichtfällt.
- Steuerung auf dem Sperrbildschirm, echte Push-Nachrichten, Hintergrundwiedergabe: im Web nicht machbar → **nicht** Teil des Prototyps (Push wird als In-App-Banner im iOS-Stil nachgestellt).

### Anti-Ziele (Misserfolg, selbst wenn alles „funktioniert“)
- Sieht nach generischer KI-App aus: Indigo-/Violett-Verläufe, Glasmorphismus, austauschbare Karten, Standard-Iconsets ohne Haltung.
- Fühlt sich nach Website an: Hover-Effekte als Hauptfeedback, Browser-Scrollverhalten, zu kleine Touch-Ziele, Layout-Sprünge.
- Russische Texte klingen übersetzt, oder lange russische Wörter sprengen Buttons/Titel.
- Prototyp und Styleguide laufen auseinander, sodass Entscheidungen nicht mehr übertragbar sind.

## 3. Rahmenbedingungen

- **Entwicklungsrechner Windows** → kein Xcode/SwiftUI; Web-Technik.
- **Sprache der Oberfläche: Russisch.** **[Entscheidung Designer]**
  - Nur Schriften mit vollständigem Kyrillisch.
  - Russische Pluralformen (1 запись · 2 записи · 5 записей; 1 минута · 2 минуты · 5 минут).
  - Datums-/Zeitformate `ru-RU`.
  - Layouts müssen lange Wörter aushalten (z. B. „Воспроизвести“, „Синхронизация“, „Озвучивается…“).
- **Ziel-Viewport:** iPhone-Breiten **375–430 pt** (iPhone mini/SE bis Pro Max), Safe Areas (Notch/Dynamic Island, Home-Indikator).
- **Barrierefreiheit von Anfang an** (spätere Zielgruppe: Blinde/Sehbehinderte, und es sind übertragbare Designentscheidungen): Kontrast min. WCAG AA, Touch-Ziele ≥ 44 pt, Text skaliert (relative Einheiten), sinnvolle russische Bedienhilfen-Labels (`aria-label`), `prefers-reduced-motion` respektieren.
  - **Bei Konflikt mit den Entwürfen gewinnt die Barrierefreiheit.** **[Annahme Claude]** Text ≥ 4,5 : 1; große Schrift (≥ 18 pt bzw. ≥ 14 pt fett), Symbole und Bedienelemente ≥ 3 : 1. Die Token-Werte in 4.1 sind dafür gegenüber den Entwürfen minimal nachgedunkelt.

## 4. Visuelle Richtung: B «Студия» (Hi-Fi hell)

**[Entscheidung Designer]** – gewählt aus drei Premium-Richtungen und drei Varianten. Grundgefühl laut Designer: **„Premium & hochwertig“**. Charakter: wie ein hochwertiges Audiogerät – präzise, selbstbewusst, werkzeughaft, aber edel.

**Verbindliche Referenz-Entwürfe** (im Browser öffnen):
- Hell, Startseite mit finalem Player-Block: `docs/design/mockups/studiya-player-v2.html` → **rechter Entwurf („Sprungtasten als Symbol“) ist maßgeblich.**
- Dunkel: `docs/design/mockups/studiya-varianten.html` → mittlerer Entwurf **B2 «Ночь»**, **nur als Farbreferenz**.

**Dunkelmodus = gleiches Layout wie hell, nur mit dunklen Tokens.** **[Annahme Claude]** Von B2 werden ausschließlich die Farben übernommen, nicht seine Player-Details (kleiner dunkler Play-Knopf, kombinierte Zeitangabe, fehlende ±15). Es gilt überall der Player aus dem hellen Referenz-Entwurf: orange Play-Fläche, Fortschrittslinie, ±15-Symbole. Der Gute-Nacht-Modus ist davon getrennt (6.7).

### 4.1 Farben (Tokens)

| Token | Hell | Dunkel («Ночь») | Verwendung |
|---|---|---|---|
| `bg` | `#F1EFEA` (Papier) | `#131313` | Hintergrund |
| `ink` | `#121212` | `#ECEAE4` | Haupttext, schwarze Flächen (hell) |
| `surface-inverse` | `#121212` | `#ECEAE4` | „Weiterhören“-Karte, Tab-Dock (invertiert) |
| `on-inverse` | `#F1EFEA` | `#131313` | Text auf invertierten Flächen |
| `muted` | `#6E6A62` (Entwurf `#77736B`) | `#85827A` (Entwurf `#7D7A73`) | Sekundärtext, Dauern, Meta (≥ 4,5 : 1) |
| `muted-on-inverse` | `#9A968E` | `#6A675F` (Entwurf `#6E6B64`) | Sekundärtext auf invertierter Fläche |
| `decor` | `#8A867D` (Entwurf `#A39F96`) | `#66635D` (Entwurf `#5A5853`) | **nur dekorativ** (Listennummern „01“), ≥ 3 : 1, nie für inhaltlichen Text |
| `line` | `#DAD6CE` | `#262624` | Trennlinien |
| `track-on-inverse` | `#3A3936` | `#C9C6BE` | ungespielter Teil der Fortschrittslinie |
| `accent` | `#E2461F` (Signal-Orange) | `#E2461F` | Play-Fläche, Fortschritt, Symbole; als kleiner Text nur auf Schwarz (4,6 : 1) |
| `accent-text-on-light` | `#BF360E` | `#BF360E` | kleiner Akzent-Text auf hellen Flächen (z. B. „ПРОДОЛЖИТЬ“ auf der hellen Karte im Dunkelmodus) |
| `accent-on-dark` | – | `#FF5B2E` | Akzent-Symbole/-Text direkt auf dunklem Hintergrund |

Kontrast-Notizen: `accent` auf Papier = 3,6 : 1 → dort nur für Symbole und große Elemente (z. B. „+“, Fortschritt). Weißes Play-Symbol auf Orange = 4,1 : 1 → als Symbol in Ordnung.

**Akzent-Regel:** genau **ein** Akzent (in seinen Kontrast-Abstufungen). Nur für Play, Fortschritt, kleine Status-Labels und primäre Signale – nie dekorativ, keine Verläufe.

### 4.2 Typografie
- **Onest** (Google Fonts, Kyrillisch): 800 für große Screen-Titel (≈ 33 pt, Laufweite −0,035 em), 600 für Titel/Listeneinträge, 400/500 für Fließtext.
- **JetBrains Mono** 500: Timecodes, Dauern, Zähler („24 записи“), Nummerierung („01“), kleine Großbuchstaben-Labels („ПРОДОЛЖИТЬ“, Laufweite +0,06 em).

### 4.3 Formen & Komponenten (aus den Referenz-Entwürfen)
- Radien: 22 pt Karten/Dock, 16 pt Buttons/Felder, voll rund für Play/Avatare.
- **Screen-Titel** groß + Mono-Zähler rechts.
- **„Weiterhören“-Karte**: invertierte Fläche; Mono-Label in Akzent, Titel, Meta, Fortschrittslinie, Timecodes, Steuerung.
- **Fortschrittslinie** (aus Variante B3, **[Entscheidung Designer]**): 2 pt Linie, gespielter Teil in Akzent, 12 pt Punkt mit weichem Halo; darunter links verstrichene Zeit, rechts **Restzeit mit Minus** (`12:41` · `−05:39`). Mit dem Finger ziehbar.
- **Sprungtasten ±15 s** (**[Entscheidung Designer]**, Pflicht): **Kreispfeil-Symbol mit „15“** (Muster wie Apple Podcasts), links zurück, rechts vor; Play als oranger Kreis dazwischen.
- **Primäraktion „Озвучить текст +“**: umrandeter Button, Plus in Akzent.
- **Listenzeile**: Mono-Nummer · Titel + Typ · Mono-Dauer, Trennlinien.
- **Tab-Leiste** als schwebendes schwarzes Dock (hell) bzw. papierweißes Dock (dunkel), Linien-Icons (Strichstärke ≈ 1,6).

## 5. Informationsarchitektur  **[Annahme Claude]**

**Tab-Leiste (4):** **Библиотека** · **Озвучить** · **Голос** · **Профиль**
**Mini-Player:** erscheint über dem Dock, sobald etwas abgespielt/pausiert wurde; Tippen öffnet den Vollbild-Player (Sheet von unten).

| Bereich | Screens |
|---|---|
| Erststart | Willkommen → Stimme einrichten (Flow 6.1) |
| Библиотека | Start (Weiterhören, Озвучить, Neueste) · Suche & Filter · Ordner-Ansicht · Aufnahme bearbeiten |
| Озвучить | Quelle wählen · Text prüfen · Optionen · Wird vertont · Fertig |
| Голос | Stimm-Übersicht & Qualität · Nachaufnahme-Sessions · Neu vertonen |
| Профиль | Profil & Einstellungen |
| Global | Vollbild-Player · Gute-Nacht-Modus · iOS-artige Sheets, Dialoge, Banner |

## 6. Abläufe

Alle Abläufe sind **[Entscheidung Designer]** im Umfang; die Detailschritte sind **[Annahme Claude]**.

### 6.1 Stimme einrichten (Onboarding)
1. **Willkommen**: Nutzenversprechen in einem Satz (z. B. „Слушайте любой текст своим голосом“), CTA „Начать“.
2. **Erwartung setzen** (wichtigstes UX-Risiko laut Gespräch): Die eigene Stimme klingt anfangs ungewohnt, weil man sie sonst über den Knochen hört – nach kurzer Zeit gewöhnt man sich daran. Kurz, freundlich, kein Fachjargon.
3. **Vorbereitung**: ruhiger Raum, Telefon ~20 cm vom Mund, Dauer (z. B. „около 10 минут“, kann pausiert werden).
4. **Aufnahme**: Vorlesetext Satz für Satz (Teleprompter), großer Aufnahmeknopf, simulierter Pegel, Fortschritt („Фраза 3 из 30“), Satz wiederholen, Pause/später fortsetzen.
5. **Qualitätscheck**: simuliertes Feedback inkl. eines Beispiel-Hinweises („Слишком тихо — попробуйте ещё раз“).
6. **Stimme wird erstellt**: Wartezustand (simuliert, wenige Sekunden).
7. **Erstes Hörbeispiel**: „Послушайте себя“ (simulierte Wiedergabe) → CTA „Озвучить первый текст“.
- **Überspringen** möglich („Позже“): App mit Beispielinhalten erkunden, Hinweis „Голос ещё не настроен“. **[Annahme Claude]**

### 6.2 Text vertonen
1. **Quelle**: Text einfügen · PDF laden · Link (Auswahl liefert vorbereiteten Beispieltext).
2. **Text prüfen**: editierbare Vorschau, automatisch vorgeschlagener Titel, Länge und geschätzte Dauer („≈ 18 мин“); bei Büchern erkannte Kapitel.
3. **Optionen**: Название · Папка · Теги · **Язык озвучки** mit „Перевести на…“ (Extra „Übersetzen vor Vertonen“, Zielsprachen z. B. Английский, Китайский) · **Манера чтения**: Обычная / Выразительная / Спокойная (для сна) **[Annahme Claude – aus dem Gespräch: Kunde hat Stimmaufnahmen in verschiedenen Stilen]**.
4. **Wird vertont**: Fortschritt + Restzeit; man kann den Screen verlassen, der Eintrag steht in der Bibliothek als „Озвучивается…“ mit Fortschritt.
5. **Fertig**: iOS-artiges In-App-Banner („Готово: …“), direkt abspielbar.

### 6.3 Bibliothek & Ordner
- **Start** wie Referenz-Entwurf: Titel + Zähler, Weiterhören-Karte, „Озвучить текст“, neueste Einträge.
- **Suche**, Filter-Chips nach Typ (Все · Книги · Статьи · Языки · Сказки), **Ordner**, **Tags**; Sortierung (Недавние · По названию · По длительности).
- **Zustände eines Eintrags**: neu · angefangen (mit Fortschritt) · gehört (✓) · wird vertont.
- **Aktionen** pro Eintrag über „…“/langes Drücken → iOS-Action-Sheet. **[Annahme Claude]**

### 6.4 Aufnahme bearbeiten
Name · **Cover-Bild** · Tags · Ordner · Sprache/Манера чтения (Info) · „Озвучить заново“ (mit verbesserter Stimme) · Löschen (mit Bestätigung).
- „Avatar“ aus der Anforderung des Designers wird als **Cover-Bild der Aufnahme** verstanden. **[Annahme Claude]** Vorschlag: automatisch erzeugte typografische Cover im Stil B (Farbfläche + Titel/Initiale) plus „Фото“ (simuliert).

### 6.5 Vollbild-Player
- Cover, Titel, Meta, aktuelles Kapitel.
- Fortschrittslinie (ziehbar), Zeiten, **⟲15 · Play/Pause · 15⟳**.
- Zweite Reihe: **Tempo** (0,75× · 1× · 1,25× · 1,5× · 2×), **Sleep-Timer** (Выкл · 15 · 30 · 45 · 60 мин · До конца главы), **Kapitel**, **Текст** (Mitlesen, aktueller Satz hervorgehoben, simuliert) **[Annahme Claude]**, **Mond** = Gute-Nacht-Modus.
- Position wird gemerkt; Weiterhören-Karte und Mini-Player zeigen sie.

### 6.6 Stimme verbessern (Tab Голос)
- Stimm-Karte: **Qualität in %** (z. B. 92 %), aufgenommene Minuten, letzte Aktualisierung.
- **Nachaufnahme-Sessions** à ~5 min: „Расскажите историю о себе“, „Прочитайте отрывок“, „Прочитайте с эмоцией“ – nutzt die Aufnahme-UI aus 6.1.
- Danach: „Голос обновлён“ → Angebot, ältere Aufnahmen **neu zu vertonen** (Auswahl per Checkbox, simuliert).
- Hörproben der Sprechstile.

### 6.7 Gute-Nacht-Modus  **[Annahme Claude]**
- **Was er ist**: eine eigene, reduzierte Ansicht **nur des Vollbild-Players** („Ночной плеер“) – nicht die ganze App und nicht dasselbe wie der Dunkelmodus.
- **Aktivierung**: Mond-Taste im Vollbild-Player; schaltet sich automatisch ein, wenn ein Eintrag vom Typ „Сказка“ startet.
- **Dauer**: bleibt an, bis man ihn ausschaltet oder der Sleep-Timer die Wiedergabe beendet; danach zurück zum normalen Player.
- **Aussehen**: eigener kleiner Token-Satz **`night`**, abgeleitet aus «Ночь», aber ohne helle Flächen:
  - `night-bg` `#0B0B0B`
  - `night-ink` `#BDB9B0` (10 : 1)
  - `night-muted` `#85827A` (5,1 : 1)
  - `night-accent` `#B8441F` (nur Symbole, 3,6 : 1)
- **Steuerung**: nur Titel, großes Play, ±15, Fortschrittslinie und ein **prominenter Sleep-Timer** (Standard 30 мин); sanftes Ausblenden zum Ende angedeutet.
- Passt zur Манера „Спокойная (для сна)“.

### 6.8 Einstellungen (Tab Профиль)
Profil (Name) · **Оформление**: Светлая / Тёмная / Как в системе · Скорость по умолчанию · Шаг перемотки (10 / 15 / 30 сек, Standard 15) · Таймер сна по умолчанию · Уведомления (Vertonung fertig) · Голос (verwalten, **Stimmdaten löschen**) · Хранилище (offline gespeichert) · О приложении. **[Annahme Claude]**

### 6.9 Startzustand & Prototyp-Menü  **[Annahme Claude]**
- **Erster Aufruf** des Links → Onboarding (6.1).
- **Nach Onboarding oder „Позже“** → Bibliothek mit den 24 Beispieleinträgen. Dass die Stimme gerade erst entstanden ist, die Bibliothek aber schon voll ist, ist für den Prototyp akzeptiert.
- **Leere Zustände** werden trotzdem gestaltet: leere Bibliothek, leerer Ordner, keine Suchtreffer.
- **Prototyp-Menü**: ganz unten im Tab Профиль ein deutlich abgesetzter Bereich „Прототип“ (gestrichelt umrandet, nicht Teil des echten Designs). Er ermöglicht, dass Kunde und Designer jeden Ablauf wiederholen können, auch wenn der Zustand gespeichert wird. Er enthält:
  - **Сбросить всё** (zurück zum Erststart)
  - Sprünge in Szenarien: Голос не настроен · Пустая библиотека · Идёт озвучивание · Предупреждение «Слишком тихо» · Баннер «Готово» · Ночной режим

  Auf dem Desktop dürfen dieselben Schalter zusätzlich neben dem iPhone-Rahmen stehen.

## 7. Inhalte & Texte

- **Anrede „вы“** (Sie-Form) – passt zu Premium und erwachsener Zielgruppe. **[Annahme Claude]**
- UX-Texte kurz, natürlich, nicht übersetzt klingend; Kontrolle mit der Copy-Checkliste aus `avoiding-ai-website-slop`.
- **Beispielbibliothek** (24 Einträge, realistisch, fiktiv, keine realen Personen als Autoren):
  - Sprachen: „В метро: диалог“, „В магазине“, „В миграционной службе“ (Chinesisch-Lektionen)
  - Artikel: „Сенсорная интеграция при аутизме“ u. ä.
  - Buch: „Психология общения“ (mehrere Kapitel, ~4 ч)
  - Märchen (gemeinfrei): „Колобок“, „Теремок“ …
  - Studium: „Доклад к защите курсовой“
- Der **App-Name** ist noch offen; Platzhalter „golos“. **[Dem Umsetzer überlassen]**, leicht austauschbar halten.

## 8. Technischer Rahmen

- **React + Vite** (statisch baubar). TypeScript empfohlen. **[Annahme Claude – vom Designer bestätigt: „Web-Prototyp mit React“]**
- **Kein UI-Kit** (eigener Look); Styling über **CSS-Variablen aus einer zentralen Token-Datei** (hell/dunkel). Konkrete Styling-Methode **[Dem Umsetzer überlassen]**.
- **Simulierter Zustand** in einem In-Memory-Store mit Beispieldaten; Zeiten laufen bei „Wiedergabe“ wirklich hoch. Persistenz in `localStorage` **[Dem Umsetzer überlassen]** (mit try/catch).
- **iOS-Gefühl**:
  - Sheets, Action-Sheets, Push-Navigation mit **Zurück-Pfeil**. Keine eigene Wisch-Geste vom Bildschirmrand, weil sie in Safari mit der Browser-Geste kollidiert. **[Annahme Claude]**
  - Active-States statt Hover, keine Textauswahl auf Bedienelementen, kein Überscroll-Wackeln der ganzen Seite.
- **Darstellung**: auf dem Desktop in einem iPhone-Rahmen zentriert; auf dem Telefon (schmaler Viewport) randlos.
  - Muss **im normalen Safari-Tab** voll funktionieren.
  - „Zum Home-Bildschirm“ im Vollbild ist ein Bonus, falls der Hoster die nötigen Meta-Tags durchlässt.
- **Styleguide-Seite** (eigene Route): alle Tokens (hell, dunkel, night), Typo-Skala, Komponenten mit Zuständen.
- **Hosting-unabhängig bauen**: statischer Build, **Hash-Routing**, relative Pfade – läuft auf jedem statischen Hoster. **[Annahme Claude]**
- **Teilen**: zuerst als **privates Artifact** (der Designer gibt den Link frei). Kann der Kunde ihn nicht öffnen oder passt die Darstellung dort nicht, wird vor der ersten Kunden-Runde auf einen statischen Hoster ausgewichen (z. B. Netlify, Vercel, GitHub Pages) – **nur nach Zustimmung des Designers**. Schriften kommen über Google Fonts, JS/CSS als lokale Dateien im Build.
- Icons: eigene Linien-Icons wie in den Entwürfen oder eine Bibliothek mit passender Strichstärke. **[Dem Umsetzer überlassen]**

## 9. Werkzeuge & Skills

| Wofür | Skill/Plugin |
|---|---|
| Ablauf | `superpowers:writing-plans` → `superpowers:executing-plans` oder `subagent-driven-development`; `superpowers:verification-before-completion` |
| Design-Wissen | `ui-ux-pro-max` (iOS-/Mobile-UX-Regeln, Barrierefreiheit), `frontend-design` |
| Gegen KI-Einheitslook | `avoiding-ai-website-slop` (aus BRU Facility) – **in `golos/.claude/skills/` kopieren** und für eine App statt Website nutzen: Referenz = die Entwürfe aus Abschnitt 4 als Gold-Standard, Copy-Checkliste für russische Texte |
| Prüfen | **Playwright-Plugin**: jeder Screen als Screenshot in iPhone-Viewports (375 und 430), Abläufe automatisch durchklicken, Vergleich mit Referenz-Entwürfen |
| Teilen | **Artifact** (privater Link) |
| Später | `skill-creator` → eigener Skill „golos-Designsystem“, sobald der Styleguide steht |
| Nicht nötig | Figma-Plugin, Expo/React-Native, SwiftUI, `dataviz` |

**Kandidaten zum Dazuholen – vor der Umsetzung recherchieren, nur mit Zustimmung des Designers installieren:** ein Barrierefreiheits-Skill (WCAG/VoiceOver), ein Skill mit React-/Web-Best-Practices.

## 10. Erfolgskriterien

1. Der Kunde öffnet den Link auf dem iPhone in Safari und klickt **alle Abläufe aus 6.1–6.9** ohne Sackgasse durch. Mit dem Prototyp-Menü lässt sich jeder Ablauf wiederholen.
2. Jeder Screen nutzt ausschließlich die Tokens aus 4.1/4.2; Vergleich mit den Referenz-Entwürfen zeigt keine Abweichung im Charakter.
3. Alle Texte russisch, **kein Überlauf** bei 375 pt Breite.
4. Styleguide-Seite dokumentiert alle Tokens und Komponenten mit Zuständen.
5. Kein Punkt aus den Anti-Zielen trifft zu (Prüfung mit der Checkliste aus `avoiding-ai-website-slop`).
6. Alle Text-/Hintergrund-Paare erfüllen die Kontrastregeln aus Abschnitt 3.
