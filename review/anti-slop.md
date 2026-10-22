# Anti-Slop- und Qualitätsprüfung – golos Prototyp

**Datum:** 2026-10-22 · **Grundlage:** `.claude/skills/avoiding-ai-website-slop` (Gold-Standard-Loop, Copy-Checkliste), `ui-ux-pro-max`-Regeln für iOS/Mobile
**Gold-Standard:** `.superpowers/brainstorm/3225-1792574096/content/studiya-player-v2.html`, rechter Entwurf (vom Designer gewählt)
**Screenshots:** `review/screenshots/iphone-390-chromium/` (typografisch maßgeblich), dazu `iphone-375/` und `iphone-430/` (WebKit)

## Automatische Prüfung (`e2e/quality.spec.ts`)

40 Screens × 3 iPhone-Projekte, je Screen:

| Prüfung | Ergebnis |
|---|---|
| kein horizontaler Überlauf (375 / 390 / 430 px) | ✓ alle |
| kein abgeschnittener Text in Buttons, Tabs, Radios, Überschriften | ✓ alle |
| Touch-Ziele ≥ 44 × 44 px | ✓ alle |
| axe WCAG 2 A/AA (ohne `[data-decor]`, siehe unten) | ✓ alle |

**Behobene Befunde aus den ersten Läufen:**
- Entfernen-Knopf an Tags war 44 × 40 px → 44 × 44 px.
- Player-Aktion „Ночной режим“ lief bei 375 und 430 px über → sichtbares Label „Ночь“, Bedienhilfen-Label bleibt „Ночной режим“.
- Mitlese-Text scrollte, war aber nicht per Tastatur erreichbar (axe `scrollable-region-focusable`) → `role="region"`, `tabIndex=0`, Label „Текст“.
- Dekorative Listennummern „01“ (Token `decor`, laut Spec bewusst 3 : 1) wurden von axe als Text gewertet → als `aria-hidden` und `data-decor` markiert und von der Kontrastprüfung ausgenommen. Alle anderen Texte erfüllen 4,5 : 1.

**Hinweis Testumgebung:** Playwright-WebKit unter Windows rendert die Gewichtsachse der variablen Schrift Onest im DOM nicht. Titel wirken dort dünn, obwohl `font-weight: 800` korrekt berechnet wird (geprüft). Echtes Safari auf dem iPhone ist nicht betroffen. Für die Review-Screenshots gibt es deshalb zusätzlich das Projekt `iphone-390-chromium`.

## Gold-Standard-Vergleich

Kriterien aus dem Brief: Papier `#F1EFEA` / Schwarz, genau ein Akzent als Fokuspunkt, Onest 800 für Screen-Titel, Mono für Zeiten/Zähler/Labels, invertierte Karten, schwebendes Dock, keine Verläufe/Glas/generischen Karten.

| Screen | Durchgang 1 | Delta | Durchgang 2 |
|---|---|---|---|
| Bibliothek (Start) | ✓ | – | ✓ |
| Vollbild-Player, Nacht-Player | ✓ | – | ✓ |
| Vertonen: Quelle, Parameter, Generierung | ✗ | „Выразительная“ wurde mitten im Wort getrennt (Segment zu schmal) | ✓ Abstand/Schriftgröße angepasst, `hyphens: auto` |
| Aufnahme bearbeiten | ✗ | „Готово“ brach in der NavBar um („Гото/во“) | ✓ Seitenspalten passen sich dem Inhalt an, kein Umbruch |
| Tab „Голос“ | ✗ | drei große orange Play-Kreise untereinander – mehrere Akzent-Fokuspunkte | ✓ Hörproben als ruhige Variante (Linie, Tinte), Orange nur noch im Qualitätsbalken |
| Profil, Onboarding, Aktions-Sheet | ✓ | – | ✓ |

## Textprüfung (russische UX-Texte in `src/content/ru.ts`)

Checkliste: keine Floskeln/KI-Signalwörter (russische Entsprechungen von *unlock, seamless, revolutionize …*), konkrete statt abstrakter Aussagen, handlungsspezifische CTAs, kein gleichförmiger Gedankenstrich-Rhythmus, Anrede „вы“.

| Befund | Vorher | Nachher |
|---|---|---|
| gleicher Satzrhythmus „X — Y“ in sechs Texten | „Можно закрыть экран — мы сообщим, когда всё будет готово.“ | „Экран можно закрыть. Когда всё будет готово, придёт уведомление.“ |
| | „Звучит непривычно? Это нормально — дайте себе пару дней.“ | „Звучит непривычно? Так и должно быть. Через пару дней вы привыкнете.“ |
| | „Голос ещё не настроен — без него озвучить текст не получится.“ | „Голос ещё не настроен. Без него текст не озвучить.“ |
| | „Запишите около 10 минут речи — и приложение сможет …“ | „Запишите около 10 минут речи, и приложение начнёт …“ |
| | „Вставьте текст, загрузите PDF или ссылку — и слушайте своим голосом.“ | „Добавьте статью, PDF или ссылку и слушайте её своим голосом.“ |
| abstrakt statt konkret | „… голосом, который вам ближе всего.“ | „Статьи, книги, уроки и сказки на ночь — вашим собственным голосом.“ |
| generischer CTA | „Начать“ (Willkommen) | „Настроить голос“ |

Keine Floskeln gefunden. Anrede durchgehend „вы“. Pluralformen, Dezimalkomma und Minuszeichen werden über `src/i18n/format.ts` erzeugt und sind getestet.

**Offen für den Designer:** Die russischen Texte sollte vor der Kunden-Runde einmal eine russische Muttersprachlerin bzw. ein Muttersprachler gegenlesen.
