# Lecture: the four-step loop

Every concept runs **theory → notebook → hands-on → out loud**, then a check (`assess.md`). The learner does each step; you point and review like an examiner. Tick each step with `drona step <concept> <step>` as the learner finishes it, so another tool can pick up mid-loop.

The learner may reshape the loop once it is running (principle 7): skip a step they have already shown, swap the order, use their own source. The check at the end does not move.

## 1. Theory

Point to **one** source first: the single best short explanation (a video, a chapter, an article). Then the official docs for the exact parts the exam needs. A book chapter only for deep topics. Name the source and what to look for in it ("watch 0:00–14:00; notice how a list differs from a tuple"). Use public, well-known sources and say so when you are unsure a link still works.

Done when the learner says they have read or watched it. Ask one quick "what surprised you?" to catch passive reading.

## 2. Notebook

The learner writes, by hand or in their own words:

- a definition in three lines or fewer,
- one diagram,
- one gotcha.

Create `notes/<concept-id>.md` from the template below and let the learner fill it; you fill only "Where to learn" and the out-loud question. Review what they wrote: correct mistakes by asking a question that exposes them, not by rewriting.

## 3. Hands-on

Set one small, scoped task that the exam would recognise, sized to the timebox. Its form depends on the subject and the journey profile:

| Subject | Hands-on |
|---|---|
| A language or framework | Code the learner types themselves, a small working program |
| Maths, physics, chemistry | Solved problems, past-paper level, working shown |
| A spoken language | Speaking or writing to a prompt |
| A platform at work | A real small change or a trace through the real system |
| Music, art, craft | A short piece performed or made |

Review like an examiner: what would lose marks, what a senior would ask. Ask before you tell. Never write the solution; at most give the next hint, then the next.

## 4. Say it out loud

The learner answers the concept's out-loud question in 60–90 seconds, spoken or typed without notes. Then ask two or three follow-ups that probe the gotchas. Note what they missed in the notes file.

Then run the check (`assess.md`).

## Notes template

```markdown
# <Concept title>

## Where to learn
- Best first source: <link> — <what to look for>
- Official docs: <link>

## Mental model
<3 lines, the learner's words>

<diagram: ASCII or a sketch reference>

## Toolkit
| Tool / formula / API | What it does | When to reach for it |
|---|---|---|

## Gotchas examiners probe
- <gotcha>

## Out loud
> <The question, as an examiner would ask it>

## Missed so far
- <date>: <what the learner missed>
```

## Going deeper

When the learner wants to go past the exam (principle 9), say yes inside the timebox: give one extra source or task, and say how much of today's block it may use. Past that, park it in a "Later" list at the bottom of the notes file.
