# Planner

How drona turns a goal into a plan and keeps it on the deadline. Two parts:

- **The contract** (stable): what the planner takes in, what it must write, and the checks every plan passes. Intake, commands and views depend only on this.
- **The model** (swappable): how the tree and timeline are built. The current model is `tree-timeline` (D-03, provisional). A new model replaces only that section and sets `plan.model` to its own name.

If your tool can run a fresh-context subagent, dispatch the `planner` agent for build and replan, passing this file's path and the goal folder. Otherwise follow this file inline.

## Intake

Intake belongs to the main session, because it is a conversation. Ask in this order, a few questions per message:

1. **Use case first:** which journey? Self-learner with a deadline, exam student (NEET/JEE and similar), new joiner learning a platform, or hobbyist. Then read `profiles/<journey>.md`; its defaults shape every later question.
2. **Goal and done-test:** what exactly, and what would prove it? Turn the answer into one `goal.exam` sentence the examiner can test. If the profile says to propose one, propose it and get a yes.
3. **Deadline.** Use the learner's date, or the profile's default proposal.
4. **Where they are now:** what they already know. Offer a short diagnostic (`assess.md`) instead of trusting self-ratings.
5. **Real life:** under 18? (needed for the sleep floor), hours of job, school or commute on a study day, study time per day, rest day, sleep. Read `safety.md` first.
6. **Sincerity:** "This works only if you do the steps yourself. Will you?" (principle 6).
7. **Humans:** who can check your work? A role, never a name.

Then `drona new <goal-id>`, fill `goal` and `learner` in `progress.json`, and build the plan.

## Contract

**Input:** `progress.json` with `goal` and `learner` filled, plus anything intake learned (prior knowledge, diagnostic results).

**Output** (into `progress.json`):

- `concepts`: every node with all fields from `docs/state.md`, `status` = `todo` (or `done` for diagnosed-known nodes, which get a review date).
- `milestones`: at least one mock before the deadline.
- `plan.model`, `plan.why` (2–4 sentences a learner can read), and a `plan.replans` entry on every replan.

**Done when** all of these hold:

- `drona validate` prints `ok`. On a replan, `drona snapshot` ran before the first edit, so validate also checks that sleep, rest days and study time were not traded away.
- Every concept traces to the done-test: you can say which exam question it serves. Cut what does not (principle 3).
- `drona render` has regenerated `PLAN.md` and `progress.html`.
- The learner has seen the plan and said yes, or changed it (principle 7). Their changes are written back to `progress.json` and validated again.

## Replan triggers

- `drona status` shows `behind`.
- A mock or check scores below 80 on a starred node.
- The learner's life changed (exam moved, a busy week, illness).
- The learner wants a different shape (principle 7).

A replan is in place: same goal, same deadline, the past kept in `log`.

## Model: tree-timeline (D-03, provisional)

### Build

1. **Tree.** From the done-test, work backwards: list what the exam asks, then what each of those needs, down to basics. Each node is one concept a learner can finish the four-step loop on in one to three study days. Give it `layer` (L0 basics → applied), `deps`, `weight` 1–3 by how much the exam leans on it, and `star` on the nodes the exam weighs most.
2. **Timebox.** Set `minutes` per node from the profile's pace. A node over one day's `study_minutes` spreads over `days`.
3. **Calendar.** Walk the study days from `start` (rest days skipped), placing nodes bottom-up, deps first, never over the daily budget. Keep about 10% of days as `buffer` (nothing planned) and the last study days before the deadline for a mock and fixes.
4. **Mocks.** One milestone per layer or every 1–2 weeks, whichever comes first, plus a final mock.
5. **Fit check.** If the tree does not fit, cut weight-1 nodes, then merge weight-2 nodes, then tell the learner what still does not fit and offer two choices: a smaller done-test or a later deadline. Never fit it by raising `study_minutes` or lowering sleep.

### Replan

1. `drona snapshot`.
2. Re-date every node that is not `done` or `cut` from today forward, same rules as Build step 3.
3. Still does not fit: set `status: cut` on weight-1 nodes, lowest layer-impact first, then weight-2. Never cut a starred node without the learner's yes.
4. Still does not fit: stop and give the learner the two choices from Build step 5.
5. Append to `plan.replans`: date, reason, change. `learner_approved: true` only when the learner agreed to more study time or a new deadline.
6. `drona validate`, `drona render`, then show the learner what moved and why in three lines or fewer.
