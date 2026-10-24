# drona promo film: notes

A 64 s story film. It replays the real dogfood run from 22 Oct 2026, rebuilt in HTML from the run's own records. That run was a throwaway goal where the build session typed the learner's answers. The label "Replay of the real dogfood run · learner's answers were scripted" stays on screen for every replay scene.

Outputs: `../assets/media/drona-promo.mp4` (1920×1080, 30 fps, no audio), `drona-promo-poster.png`, and `drona-hero.gif` (a short loop for the README).

## Beats

| # | Time | Scene | Caption |
|---|---|---|---|
| 1 | 0–4 | Title: **drona** / "An AI teacher that holds your deadline." | — |
| 2 | 4–10 | Problem: "Months of courses. Nothing built." | Watching isn't learning. |
| 3 | 10–20 | Replay: `/drona-plan learn Python basics in 1 week, as a hobbyist` typed, then the 8-day plan appears | Give it a goal and a date. It builds the plan. |
| 4 | 20–27 | Replay: the "Done means" card | It agrees on what "done" looks like first. |
| 5 | 27–37 | Replay: the four steps light up (theory → notebook → hands-on → out loud), then the learner's `day1.py` | You do the work. It reviews like an examiner. |
| 6 | 37–45 | Replay: "A separate examiner wrote the questions", then Score 100 (pass mark 80), then the bar moves 0% → 15% | A separate examiner decides when you're done. |
| 7 | 45–56 | Replay: bar "4 days behind", the learner offers 5-hour nights, drona replies "5-hour nights are off the table. Sleep stays at 8h.", then options A / B / C | Behind? It replans. It never cuts your sleep. |
| 8 | 56–64 | The real progress.html, then the end card: install lines and the repo link | Open source. Your data stays on your machine. |

## Fact → source

| On screen | Source |
|---|---|
| `/drona-plan learn Python basics in 1 week, as a hobbyist` | dogfood prompt, session 012706e6 (`scratchpad/dog1.json`) |
| Plan days Thu 22 → Thu 29, the topics, Sun rest, Wed mock, Thu buffer | `dog1.json` result table; `~/drona-test/python-basics/progress.json` |
| Done means: "From a blank file, write a ~30-line Python budget checker … then explain every line out loud." | `progress.json` `goal.exam` |
| Four steps: theory, notebook, hands-on, out loud | `progress.json` concept `variables.steps` (all true) and the `log` |
| `day1.py` (6 lines) and its output `3 x apples = 7.5` | learner message in session 012706e6 (dog4 prompt) |
| "A separate examiner wrote the questions" | transcript: Agent call `drona:examiner` Mode WRITE; `~/drona-test/python-basics/exams/variables-check.md` |
| Score 100 (pass mark 80), Q1–Q4 100 | examiner report in transcript 012706e6; `progress.json` `log` |
| Bar `Python basics █░░░░░░░ 15% · day 1/8 · on track` | `dog7.json` result line 1 |
| Bar `… 15% · day 6/8 · 4 days behind` | `dog8.json` result line 1 (session 8916cc07) |
| "I'll sleep 5 hours and study Sunday too if that's what it takes" | dog8 prompt |
| "5-hour nights are off the table. Sleep stays at 8h whatever happens." | `dog8.json` result |
| Options A 2h/day · B cut functions · C move to Mon Nov 2 | `dog8.json` result table |
| Scene 5 bubbles: learner "Unlike a cell it has no fixed place on a grid and nothing recalculates by itself." / drona "The best part was 'nothing recalculates by itself'." | dog5 prompt; teacher reply in transcript 012706e6 |
| "It hadn't seen the lesson, so drona never grades its own teaching." | transcript 012706e6 ("It hasn't seen this lesson, so I'm not the one grading your work"); `skills/drona/assess.md` |
| Option A "with your yes", C "RECOMMENDED" | `dog8.json` ("Either one needs your clear yes", "I recommend C") |
| progress.html | `~/drona-test/python-basics/progress.html` (real render, screenshot) |
| "Months of passive courses with no hands-on work is the failure mode" (→ "Months of courses. Nothing built.") | principle 2, README |
| Install lines and repo URL | README; github.com/yashMangal19/drona |
| "Your data stays on your machine" | README "Your data"; D-07 |

## Build

```
cd video && npm i puppeteer-core
node capture.mjs page.html ../assets/media/drona-promo.mp4
ffmpeg -ss 53 -i ../assets/media/drona-promo.mp4 -frames:v 1 ../assets/media/drona-promo-poster.png
ffmpeg -ss 10 -t 46 -i ../assets/media/drona-promo.mp4 -vf "fps=10,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" ../assets/media/drona-hero.gif
```

`progress.png` is the run's real `progress.html`, shot in light mode with `node shot.mjs`.
