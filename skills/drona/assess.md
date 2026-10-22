# Assess

The exam defines done (principle 8). A concept is `done` only after the learner answers exam-style questions on it without help and scores 80 or more. The teacher never grades its own teaching: questions and grades come from the **examiner**, a fresh context that has not seen the lesson.

If your tool can run a fresh-context subagent, dispatch the `examiner` agent with this file's path, the goal folder, the concept id and the kind (check, review, mock or diagnostic). Without one, start a fresh chat or a clearly separate turn, and follow "Examiner" below using only the inputs it lists.

## Kinds

| Kind | When | Size | Records |
|---|---|---|---|
| **check** | End of a concept's loop | 3–5 questions | `drona check <concept> <score>` |
| **review** | `drona status` shows a review due | 1–2 quick recall questions, out loud or written | `drona check <concept> <score> --kind review` |
| **mock** | A milestone date | Exam-length, mixed concepts, timed | `drona check <milestone> <score> --kind mock`, then a check per weak concept |
| **diagnostic** | Intake | 1 question per likely-known concept | Planner marks passed concepts `done` |

The script schedules the spaced reviews (+1, +3, +7, +21 days) and sends a failed concept back to `active`. After a mock, any concept under 80 gets its own check score recorded, and the planner replans from the mock (`planner.md`).

## Examiner

You write and grade questions as the real exam (or a senior) would, from a fresh context.

**Inputs, and only these:** `goal.exam` and `goal.journey` from `progress.json`, the concept's title and `notes/<id>.md` "Gotchas" and "Out loud" sections, the journey profile's "Exam" section, and the learner's answers. Not the lesson transcript.

1. **Write** the questions in the exam's own style (see the profile): past-paper style for NEET/JEE, senior follow-ups for a new joiner, the done-test task for a hobbyist. At least one question probes a gotcha. At least one asks the learner to produce something (code, a worked solution, an explanation), never only recognise it.
2. **Ask** them one at a time. No hints during a check. If the learner asks for help, the question scores 0 and you explain afterwards.
3. **Grade** each answer 0–100 against a model answer you wrote before asking. Score the whole as the average, rounded.
4. **Report** in this shape:

```
Score: 72 (pass mark 80)
Q1 90 · Q2 50 · Q3 75
Missed: <the specific gap, one line each>
Next: <the one thing to fix before the retry>
Human check: <only if needed, see below>
```

5. **Record** the score with `drona check` and append each "Missed" line to the notes file's "Missed so far".

## When a human must validate

Flag it in "Human check" when the answer needs judgement you cannot give reliably: pronunciation or performance, handwriting or lab technique, code review against a real team's conventions, or a claim you cannot verify. Name the role (mentor, teacher, senior, peer) from `learner.humans`, and what to show them.
