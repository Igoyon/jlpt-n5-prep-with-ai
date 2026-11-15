# JLPT N5 prep with AI

My personal Japanese course for the JLPT N5 exam (6 December 2026), taught by an AI agent.

The teacher is [Claude Code](https://claude.com/claude-code) running the `/teach` skill from [Matt Pocock's skills](https://github.com/mattpocock/skills). The skill turns a folder into a teaching workspace: the agent keeps the mission, the plan, its own notes and a record of what I have learned, and writes each new lesson from that state.

The course is written in Polish, my native language, with Japanese examples.

## How a lesson works

1. The agent writes a short interactive lesson as a single HTML page: explanations, quizzes, typed answers and listening exercises read by text-to-speech.
2. Every lesson opens with a review of earlier lessons, picked from the mistakes I made before.
3. I do the lesson and paste my result back to the agent.
4. The agent writes a learning record, updates its notes and plan, and generates Anki flashcards, most of them from my mistakes.
5. The next lesson is built on what the records say I still get wrong.

The commit history follows that loop: a finished lesson, the next one prepared, a fix when I report a flashcard with bad audio.

## What is in the repo

| Path | What it is |
|---|---|
| `lessons/` | The lessons, one HTML file each |
| `reference/` | Cheat sheets distilled from the lessons |
| `print/` | Wall posters for printing |
| `assets/` | Shared stylesheet and the quiz, typing and audio components |
| `learning-records/` | What I mastered and what I got wrong, lesson by lesson |
| `MISSION.md`, `PLAN.md`, `NOTES.md`, `RESOURCES.md` | Why I am learning, the schedule, the agent's working notes, and its sources |
| `anki/src/` | Flashcard sources (TSV), one grammar deck and one vocabulary deck per lesson |
| `anki/build.py` | Builds the Anki decks with audio from the TSV files |
| `CLAUDE.md` | Instructions the agent follows in this workspace |

The built Anki decks and their audio are not in the repo. They are generated locally with a macOS system voice.

## Running it

Serve the folder and open the index:

```bash
python3 -m http.server 8765
```

Then go to http://localhost:8765. The listening exercises use the browser's Japanese text-to-speech voice.

To build the Anki decks (macOS only, needs the Kyoko voice):

```bash
python3 -m venv anki/.venv && anki/.venv/bin/pip install -r anki/requirements.txt
```

```bash
anki/.venv/bin/python anki/build.py
```

## Alongside the course

Kanji and vocabulary come from WaniKani, the flashcards go into Anki, and I practise listening with JLPT N5 recordings on YouTube.
