# ADR 0003 — Database File Location

**Status:** Accepted
**Date:** 2025-10-29
**Context:** Backend Persistence, Environment Setup

---

## **Context**

ADR-0001 defined that the **API Gateway owns the database layer**.
During implementation, we needed to choose where the SQLite file physically lives in the project directory.

An initial version placed the SQLite file under the `/shared/` folder, which is also used by both the Gateway and the Whisper Service for shared runtime files like uploads and transcripts.

This raised the question of whether the DB file should live in `/shared/` or within the Gateway’s own folder.

---

## **Decision**

The database file will live inside the **API Gateway service**, under a `data/` directory:

```
api-gateway/
  ├─ data/
  │  └─ database.sqlite
  └─ src/
     └─ db/
        └─ index.ts
```

This preserves the ownership and architectural boundaries described in ADR-0001 — the database is an internal concern of the Gateway, not a shared resource.

---

## **Alternatives Considered**

1. **Keep the database in `/shared/`**

   * ✅ Simpler for local dev (both services can read it)
   * ❌ Breaks service ownership boundaries
   * ❌ Risk of accidental cross-service writes

2. **Use an external DB server**

   * ✅ Clean boundaries
   * ❌ Overkill for local development

---

## **Consequences**

**Pros**

* Clear ownership and consistent with ADR-0001
* Safer boundaries for when services are containerized
* Easier to manage volume mounts per service

**Cons**

* The Whisper Service won’t directly access the DB in local testing (must go through Gateway APIs)

---

## **Tags**

#adr #database #architecture #sqlite #api-gateway #backend