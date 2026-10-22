---
description: Get examined — a check on a concept, due reviews, or a mock
argument-hint: Optional concept id, "reviews" or "mock"
---

Use the `drona` skill and its `assess.md`. Request: $ARGUMENTS

- Empty: run due reviews if any, else check the active concept.
- A concept id: check that concept.
- "mock": run the next milestone's mock.

The examiner writes and grades the questions from a fresh context. Record each score with `drona check`, then show the updated bar.
