### 📁 Folder layout

```
/docs/
└─ decisions/
   ├─ README.md
   └─ TEMPLATE.md
```

---

### 🧭 `/docs/decisions/README.md`

```md
# Architecture Decision Records (ADRs)

This folder contains **Architecture Decision Records** documenting key technical choices in this project.

Each ADR captures:
- **Context:** the background or problem being solved
- **Decision:** the solution or direction chosen
- **Rationale:** why this approach was selected
- **Consequences:** effects or tradeoffs
- **Future evolution:** when or how it might change

---

## 📘 Naming convention

Files use sequential numbering and a short descriptive slug:

```

0001-database-location.md
0002-job-queueing.md
0003-transcription-storage.md

````

Use all lowercase with hyphens.  
Once an ADR is published, it should **not be edited to change history**—instead, create a new one and link it:

```md
**Supersedes:** [ADR 0001](./0001-database-location.md)
````

---

## 🧱 Folder structure example

```
/docs/decisions/
│
├─ 0001-database-location.md
├─ 0002-job-queueing.md
├─ 0003-storage-layer.md
└─ TEMPLATE.md
```

---

## 🧩 Tags convention

Each ADR should include tags at the top in **Obsidian format**, e.g.:

```md
**Tags:** #adr #architecture #database #express #whisper
```

This allows AI agents and search tools to locate relevant context easily.

---

## 🧠 Recommended workflow

1. Copy `TEMPLATE.md` → `00XX-descriptive-title.md`
2. Fill in the sections
3. Commit it along with the change it documents
4. Cross-link related ADRs at the bottom

---

## 🧰 References

* [Michael Nygard’s original ADR concept](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
* [ADR GitHub pattern](https://github.com/joelparkerhenderson/architecture_decision_record)


